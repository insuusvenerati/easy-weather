import type { AppLoadContext } from "@remix-run/cloudflare";
import type { LocationData } from "~/types/location";
import type { WeatherResponse } from "~/types/weather";

export const getLocation = async (request: Request) => {
  const url = new URL(request.url);
  const zipCode = url.searchParams.get("zipcode");
  const locationResponse = await fetch(`https://api.zippopotam.us/us/${zipCode}?units=us`);

  if (!locationResponse.ok) {
    return locationResponse.statusText;
  }
  const locationData: LocationData = await locationResponse.json();

  return locationData;
};

export const getWeather = async (location: LocationData, context: AppLoadContext) => {
  const { latitude, longitude } = location.places[0];

  const response = await fetch(
    `${context.API_URL}/forecast/${context.API_KEY}/${latitude},${longitude}`
  );

  if (!response.ok) {
    return response.statusText;
  }
  const data: WeatherResponse = await response.json();

  return data;
};
