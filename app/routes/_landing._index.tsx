import { type LoaderArgs, type V2_MetaFunction } from "@remix-run/cloudflare";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useNavigate,
  useNavigation,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useRef } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { CurrentWeather } from "~/components/CurrentWeather";
import { WeatherCard } from "~/components/WeatherCard";
import WeatherRadarModal from "~/components/WeatherRadarModal";
import { getLocation, getWeather } from "~/models/weather.server";
import { latLonToXY } from "~/utils";

export const meta: V2_MetaFunction = () => {
  return [
    { name: "charSet", content: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "msapplication-TileColor", content: "#da532c" },
    { title: "Easy Weather" },
    { name: "description", content: "Get the weather forecast for your location but easily" },
    { name: "og:title", content: "Easy Weather" },
    { name: "og:description", content: "Get the weather forecast for your location but easily" },
    {
      name: "og:image",
      content: "https://em-content.zobj.net/thumbs/160/microsoft/319/sun-behind-cloud_26c5.png",
    },
    { name: "og:type", content: "website" },
    { name: "og:url", content: "https://easy-weather.fly.dev/" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Easy Weather" },
    {
      name: "twitter:description",
      content: "Get the weather forecast for your location but easily",
    },
    {
      name: "twitter:image",
      content: "https://em-content.zobj.net/thumbs/160/microsoft/319/sun-behind-cloud_26c5.png",
    },
  ];
};

export const loader = async ({ request, context }: LoaderArgs) => {
  const url = new URL(request.url);
  const zipCode = url.searchParams.get("zipcode");

  if (!zipCode) {
    return typedjson({
      weather: undefined,
      city: undefined,
      coords: undefined,
      error: "Enter a US Zipcode to get the forecast",
    });
  }

  const locationData = await getLocation(request);

  if (typeof locationData === "string") {
    return typedjson({
      weather: undefined,
      city: undefined,
      coords: undefined,
      error: locationData,
    });
  }

  const weather = await getWeather(locationData, context);

  if (typeof weather === "string") {
    return typedjson({
      weather: undefined,
      city: undefined,
      coords: undefined,
      error: weather,
    });
  }

  const coords = {
    lat: Number(locationData.places[0].latitude),
    lon: Number(locationData.places[0].longitude),
  };
  const convertedCoords = latLonToXY(coords.lat, coords.lon, 6);

  return typedjson({
    weather: weather,
    city: locationData.places[0]["place name"],
    coords: { ...coords, ...convertedCoords },
    error: undefined,
  });
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const zipcode = searchParams.get("zipcode");
  const data = useTypedLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";
  const isError = data !== null && "error" in data;

  return (
    <>
      {data.coords && <WeatherRadarModal />}
      <div className="container mx-auto gap-9 px-2 mb-10">
        <div className="flex flex-col lg:flex-row gap-4 mt-8 justify-between items-center mb-8">
          <Link to="/" className="text-3xl font-bold">
            Easy Weather
          </Link>
          {isLoading && !isError ? (
            <Spinner />
          ) : (
            <div className="flex gap-2 items-center">
              <h3 className="text-semibold text-xl">Currently</h3>

              <CurrentWeather
                city={data.city}
                icon={data.weather?.icon}
                temperature={data.weather?.temperature}
                className="dark:hover:bg-gray-700 cursor-pointer"
                onClick={() =>
                  navigate(
                    {
                      pathname: location.pathname,
                      hash: "showModal",
                      search: `zipcode=${zipcode}`,
                    },
                    { replace: true }
                  )
                }
              />
            </div>
          )}
        </div>

        <Form className="mt-8 mb-8 flex flex-col gap-4" action="/?index" method="GET">
          <Label htmlFor="zipcode">Zip Code</Label>

          <TextInput
            disabled={isLoading}
            defaultValue={zipcode ?? ""}
            type="search"
            id="zipcode"
            name="zipcode"
            placeholder="96605"
            required
            helperText={data?.error ? data.error : ""}
          />
          <Button type="submit" disabled={isLoading}>
            {!isLoading ? "Search" : <Spinner />}
          </Button>
        </Form>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {data.weather?.daily.map((day) => (
            <WeatherCard key={day.time} city={data.city} day={day} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;

export const ErrorBoundary = () => {
  const error = useRouteError();
  const stackRef = useRef<HTMLElement>(null);
  console.log(error);

  const onClick = () => {
    if (stackRef.current) {
      navigator.clipboard.writeText(stackRef.current.innerText);

      alert("Copied to clipboard");
    }
  };

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
      <div className="container mx-auto flex flex-col gap-4">
        <h1 className="text-xl font-bold">
          Oof! Sorry about that. There's a problem with the app. I'll get on it as soon as possible
        </h1>
        <p>
          Please open a new issue here:{" "}
          <a
            className="underline font-semibold"
            href="https://github.com/insuusvenerati/easy-weather/issues/new"
            rel="noreferrer noopener"
          >
            Report an issue
          </a>
        </p>
        <div className="flex flex-col gap-4">
          Here is a copy of the stacktrace if you feel so inclinded to include it:{" "}
          <pre>
            <code ref={stackRef}>{error.stack}</code>
          </pre>
          <Button onClick={onClick} type="button">
            Copy error
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <h1 className="text-xl">Unknown Error 😔</h1>
        <p>I'm not sure what happened here.</p>
        <p>
          Please open a new issue here:{" "}
          <a
            className="underline font-semibold"
            href="https://github.com/insuusvenerati/easy-weather/issues/new"
          >
            Report an issue
          </a>
        </p>
      </>
    );
  }
};
