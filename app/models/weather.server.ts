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
    `${context.env.API_URL}/forecast/${context.env.API_KEY}/${latitude},${longitude}`
  );

  if (!response.ok) {
    return response.statusText;
  }
  const data: WeatherResponse = await response.json();

  const reducedWeatherData = {
    icon: data.currently.icon,
    temperature: `${Math.round(data.currently.temperature)} F`,
    daily: data.daily.data.map((day) => ({
      icon: day.icon,
      sunriseTime: day.sunriseTime,
      sunsetTime: day.sunsetTime,
      windSpeed: day.windSpeed,
      summary: day.summary,
      temperatureMax: day.temperatureMax,
      temperatureMin: day.temperatureMin,
      humidity: day.humidity,
      moonPhase: day.moonPhase,
      time: day.time,
    })),
  };

  return reducedWeatherData;
};
