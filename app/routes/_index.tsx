import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useEffect } from "react";
import { typedjson, useTypedFetcher } from "remix-typedjson";
import { CurrentWeather } from "~/components/CurrentWeather";
import { WeatherCard } from "~/components/WeatherCard";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { getLocation, getWeather } from "~/models/weather.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Easy Weather ⛅" }];
};

export const action = async ({ request }: ActionArgs) => {
  const locationData = await getLocation(request);

  if (typeof locationData === "object" && Object.keys(locationData).length === 0) {
    return typedjson({
      data: undefined,
      city: undefined,
      error: { message: "Location not found with this zip code", code: 400 },
    });
  }

  const data = await getWeather(locationData);

  if ("message" in data) {
    return typedjson({
      data: undefined,
      city: undefined,
      error: data,
    });
  }

  return typedjson({
    data,
    city: locationData.places[0]["place name"],
    error: undefined,
  });
};

export default function Index() {
  const fetcher = useTypedFetcher<typeof action>();
  const isLoading = fetcher.state !== "idle";
  const data = fetcher.data;
  const error = fetcher.data?.error;
  const city = fetcher.data?.city;
  const [storedZipcode, setStoredZipcode] = useLocalStorage<string | undefined>("zipcode", city);

  useEffect(() => {
    if (fetcher.data && !error) {
      if (fetcher.formData && fetcher.formData.get("zipcode") !== storedZipcode) {
        setStoredZipcode(fetcher.formData?.get("zipcode") as string);
      }
    }
  }, [error, fetcher.data, fetcher.formData, setStoredZipcode, storedZipcode]);

  useEffect(() => {
    if (storedZipcode && !fetcher.data) {
      fetcher.submit({ zipcode: storedZipcode }, { method: "POST", action: "/?index" });
    }
  }, [fetcher.data, fetcher.submit, storedZipcode]);

  return (
    <div className="container mx-auto gap-9 px-2">
      <div className="flex flex-row gap-4 mt-8">
        <h1 className="text-3xl font-bold mb-8">⛅ Easy Weather</h1>

        {isLoading && !error ? (
          <Spinner />
        ) : (
          <CurrentWeather
            city={city}
            icon={data?.data?.currently?.icon}
            temperature={data?.data?.currently?.temperature}
          />
        )}
      </div>
      <fetcher.Form className="mt-8 mb-8 flex flex-col gap-4" action="/?index" method="POST">
        <Label htmlFor="zipcode">Zip Code</Label>

        <TextInput
          disabled={isLoading}
          defaultValue={storedZipcode}
          type="number"
          id="zipcode"
          name="zipcode"
          placeholder="96605"
          required
          helperText={error ? error.message : ""}
        />
        <Button type="submit" disabled={isLoading}>
          {!isLoading ? "Search" : <Spinner />}
        </Button>
      </fetcher.Form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!error &&
          data?.data?.daily?.data?.map((day) => (
            <WeatherCard
              key={day.time}
              city={city}
              description={day.summary}
              humidity={day.humidity}
              icon={day.icon}
              sunrise={day.sunriseTime}
              sunset={day.sunsetTime}
              temperature={day.temperatureMax}
              windSpeed={day.windSpeed}
            />
          ))}
      </div>
    </div>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="container mx-auto mt-auto">
        <h1 className="text-xl font-bold">
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
};
