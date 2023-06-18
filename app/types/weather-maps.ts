export type WeatherMaps = {
  version: string;
  generated: number;
  host: string;
  radar: Radar;
  satellite: Satellite;
};

export type Radar = {
  past: Nowcast[];
  nowcast: Nowcast[];
};

export type Nowcast = {
  time: number;
  path: string;
};

export type Satellite = {
  infrared: Nowcast[];
};
