import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { typedjson, useTypedFetcher } from "remix-typedjson";
import { CurrentWeather } from "~/components/CurrentWeather";
import { WeatherCard } from "~/components/WeatherCard";
import { getLocation, getWeather } from "~/models/weather.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Easy Weather ⛅" }];
};

export const action = async ({ request }: ActionArgs) => {
  const locationData = await getLocation(request);

  if (typeof locationData === "object" && Object.keys(locationData).length === 0) {
    return typedjson({ data: null, city: null, error: "Location not found with this zip code" });
  }

  const { currently, daily } = await getWeather(locationData);

  return typedjson({
    data: { currently, daily },
    city: locationData.places[0]["place name"],
    error: null,
  });
};

export default function Index() {
  const fetcher = useTypedFetcher<typeof action>();
  const isLoading = fetcher.state !== "idle";
  const data = fetcher.data?.data;
  const city = fetcher.data?.city;

  return (
    <div className="container mx-auto gap-9 px-2">
      <div className="flex flex-row gap-4 mt-8">
        <h1 className="text-3xl font-bold mb-8">Weather</h1>

        {isLoading ? (
          <Spinner />
        ) : (
          <CurrentWeather
            city={city}
            icon={data?.currently?.icon}
            temperature={data?.currently?.temperature}
          />
        )}
      </div>
      <fetcher.Form className="mt-8 mb-8 flex flex-col gap-4" action="/?index" method="POST">
        <Label htmlFor="zipcode">Zip Code</Label>

        <TextInput
          disabled={isLoading}
          type="number"
          id="zipcode"
          name="zipcode"
          placeholder="96605"
          required
        />
        {fetcher.data?.error && <p className="text-red-500">{fetcher.data.error}</p>}
        <Button type="submit" disabled={isLoading}>
          {!isLoading ? "Search" : <Spinner />}
        </Button>
      </fetcher.Form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.daily.data.map((day) => (
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
