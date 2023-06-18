import type { LoaderArgs, V2_MetaFunction } from "@remix-run/cloudflare";
import {
  Link,
  Outlet,
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useNavigation,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { Spinner } from "flowbite-react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { CurrentWeather } from "~/components/CurrentWeather";
import WeatherRadarModal from "~/components/WeatherRadarModal";
import { getLocation, getWeather } from "~/models/weather.server";
import { latLonToXY } from "~/utils";

export const meta: V2_MetaFunction = () => {
  return [
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

  const { latitude, longitude } = locationData.places[0];

  // const weather = await getWeather(null, { latitude, longitude });

  // if (!weather.success) {
  //   return typedjson({
  //     weather: undefined,
  //     city: undefined,
  //     coords: undefined,
  //     error: weather.errors,
  //   });
  // }

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

export default function Layout() {
  const data = useTypedLoaderData<typeof loader>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isLoading = navigation.state !== "idle";
  const isError = data !== null && "error" in data;

  return (
    <div className="container mx-auto gap-9 px-2 mb-10">
      <div className="flex flex-col md:flex-row gap-4 mt-8 justify-between items-center mb-8">
        <Link to="/" className="text-3xl font-bold">
          ⛅ Easy Weather
        </Link>
        {isLoading && !isError ? (
          <Spinner />
        ) : (
          <div className="flex gap-2 items-center">
            <h3 className="text-semibold text-xl">Currently</h3>

            <CurrentWeather
              city={data.city}
              icon={data.weather?.currently?.icon}
              temperature={data.weather?.currently?.temperature}
              className="dark:hover:bg-gray-700 cursor-pointer"
              onClick={() =>
                navigate(
                  {
                    pathname: location.pathname,
                    hash: "showModal",
                    search: `zipcode=${searchParams.get("zipcode")}`,
                  },
                  { replace: true }
                )
              }
            />
          </div>
        )}
      </div>
      {data.coords && <WeatherRadarModal />}
      <Outlet />
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
