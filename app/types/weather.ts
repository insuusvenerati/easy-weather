export type WeatherResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  offset: number;
  elevation: number;
  currently: Currently;
  minutely: Minutely;
  hourly: Hourly;
  daily: Daily;
  alerts: Alert[];
  flags: Flags;
};

export type Alert = {
  title: string;
  regions: string[];
  severity: string;
  time: number;
  expires: number;
  description: string;
  uri: string;
};

export type Currently = {
  time: number;
  summary: string;
  icon: string;
  nearestStormDistance?: number;
  nearestStormBearing?: number;
  precipIntensity: number;
  precipProbability: number;
  precipIntensityError: number;
  precipType: string;
  temperature: number;
  apparentTemperature: number;
  dewPoint: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windBearing: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
  ozone: number;
  precipAccumulation?: number;
};

export type Daily = {
  summary: string;
  icon: string;
  data: DailyDatum[];
};

export type DailyDatum = {
  time: number;
  icon: string;
  summary: string;
  sunriseTime: number;
  sunsetTime: number;
  moonPhase: number;
  precipIntensity: number;
  precipIntensityMax: number;
  precipIntensityMaxTime: number;
  precipProbability: number;
  precipAccumulation: number;
  precipType: string;
  temperatureHigh: number;
  temperatureHighTime: number;
  temperatureLow: number;
  temperatureLowTime: number;
  apparentTemperatureHigh: number;
  apparentTemperatureHighTime: number;
  apparentTemperatureLow: number;
  apparentTemperatureLowTime: number;
  dewPoint: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windGustTime: number;
  windBearing: number;
  cloudCover: number;
  uvIndex: number;
  uvIndexTime: number;
  visibility: number;
  temperatureMin: number;
  temperatureMinTime: number;
  temperatureMax: number;
  temperatureMaxTime: number;
  apparentTemperatureMin: number;
  apparentTemperatureMinTime: number;
  apparentTemperatureMax: number;
  apparentTemperatureMaxTime: number;
};

export type Flags = {
  sources: string[];
  sourceTimes: string;
  "nearest-station": number;
  units: string;
  version: string;
};

export type Hourly = {
  summary: string;
  icon: string;
  data: Currently[];
};

export type Minutely = {
  summary: string;
  icon: string;
  data: MinutelyDatum[];
};

export type MinutelyDatum = {
  time: number;
  precipIntensity: number;
  precipProbability: number;
  precipIntensityError: number;
  precipType: string;
};

export type IndexLoaderData = {
  weather: WeatherResponse | undefined;
  city: string | undefined;
  coords: {
    x: number;
    y: number;
    lat: number;
    lon: number;
  };
  error: string | undefined;
};
