import invariant from "tiny-invariant";
import type { LocationData } from "~/types/location";
import type { WeatherResponse } from "~/types/weather";

export const getLocation = async (request: Request) => {
  const formData = await request.formData();
  const zipCode = formData.get("zipcode");
  invariant(zipCode, "No zip code provided");

  const locationResponse = await fetch(`https://api.zippopotam.us/us/${zipCode}?units=us`);
  const locationData: LocationData = await locationResponse.json();

  return locationData;
};

export const getWeather = async (location: LocationData) => {
  const { latitude, longitude } = location.places[0];

  const response = await fetch(
    `${process.env.API_URL}/forecast/${process.env.API_KEY}/${latitude},${longitude}`
  );
  const data: WeatherResponse = await response.json();

  return data;
};
