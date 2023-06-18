import { makeDomainFunction } from "domain-functions";
import { z } from "zod";
import type { WeatherResponse } from "~/types/weather";

export const getWeather = makeDomainFunction(
  z.null(),
  z.object({ latitude: z.string(), longitude: z.string() })
)(async (_i, { latitude, longitude }) => {
  const response = await fetch(
    `${process.env.API_URL}/forecast/${process.env.API_KEY}/${latitude},${longitude}`
  );

  const data: WeatherResponse = await response.json();

  return data;
});
