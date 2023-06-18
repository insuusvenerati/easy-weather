import { z } from "zod";

export const alertSchema = z.object({
  title: z.string(),
  regions: z.array(z.string()),
  severity: z.string(),
  time: z.number(),
  expires: z.number(),
  description: z.string(),
  uri: z.string(),
});

export const currentlySchema = z.object({
  time: z.number(),
  summary: z.string(),
  icon: z.string(),
  nearestStormDistance: z.number().optional(),
  nearestStormBearing: z.number().optional(),
  precipIntensity: z.number(),
  precipProbability: z.number(),
  precipIntensityError: z.number(),
  precipType: z.string(),
  temperature: z.number(),
  apparentTemperature: z.number(),
  dewPoint: z.number(),
  humidity: z.number(),
  pressure: z.number(),
  windSpeed: z.number(),
  windGust: z.number(),
  windBearing: z.number(),
  cloudCover: z.number(),
  uvIndex: z.number(),
  visibility: z.number(),
  ozone: z.number(),
  precipAccumulation: z.number().optional(),
});

export const dailyDatumSchema = z.object({
  time: z.number(),
  icon: z.string(),
  summary: z.string(),
  sunriseTime: z.number(),
  sunsetTime: z.number(),
  moonPhase: z.number(),
  precipIntensity: z.number(),
  precipIntensityMax: z.number(),
  precipIntensityMaxTime: z.number(),
  precipProbability: z.number(),
  precipAccumulation: z.number(),
  precipType: z.string(),
  temperatureHigh: z.number(),
  temperatureHighTime: z.number(),
  temperatureLow: z.number(),
  temperatureLowTime: z.number(),
  apparentTemperatureHigh: z.number(),
  apparentTemperatureHighTime: z.number(),
  apparentTemperatureLow: z.number(),
  apparentTemperatureLowTime: z.number(),
  dewPoint: z.number(),
  humidity: z.number(),
  pressure: z.number(),
  windSpeed: z.number(),
  windGust: z.number(),
  windGustTime: z.number(),
  windBearing: z.number(),
  cloudCover: z.number(),
  uvIndex: z.number(),
  uvIndexTime: z.number(),
  visibility: z.number(),
  temperatureMin: z.number(),
  temperatureMinTime: z.number(),
  temperatureMax: z.number(),
  temperatureMaxTime: z.number(),
  apparentTemperatureMin: z.number(),
  apparentTemperatureMinTime: z.number(),
  apparentTemperatureMax: z.number(),
  apparentTemperatureMaxTime: z.number(),
});

export const flagsSchema = z.object({
  sources: z.array(z.string()),
  sourceTimes: z.string(),
  "nearest-station": z.number(),
  units: z.string(),
  version: z.string(),
});

export const hourlySchema = z.object({
  summary: z.string(),
  icon: z.string(),
  data: z.array(currentlySchema),
});

export const minutelyDatumSchema = z.object({
  time: z.number(),
  precipIntensity: z.number(),
  precipProbability: z.number(),
  precipIntensityError: z.number(),
  precipType: z.string(),
});

export const dailySchema = z.object({
  summary: z.string(),
  icon: z.string(),
  data: z.array(dailyDatumSchema),
});

export const minutelySchema = z.object({
  summary: z.string(),
  icon: z.string(),
  data: z.array(minutelyDatumSchema),
});

export const weatherResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  offset: z.number(),
  elevation: z.number(),
  currently: currentlySchema,
  minutely: minutelySchema,
  hourly: hourlySchema,
  daily: dailySchema,
  alerts: z.array(alertSchema),
  flags: flagsSchema,
});

export const indexLoaderDataSchema = z.object({
  weather: z.union([weatherResponseSchema, z.undefined()]),
  city: z.union([z.string(), z.undefined()]),
  coords: z.object({
    x: z.number(),
    y: z.number(),
    lat: z.number(),
    lon: z.number(),
  }),
  error: z.union([z.string(), z.undefined()]),
});
