import { useMatches } from "@remix-run/react";
import { MOON_ICON_URL, WEATHER_ICON_URL } from "./constants";
import { useMemo } from "react";

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export const useMatchesData = <T = unknown>(id: string): T | undefined => {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
};

export const getWeatherIconUrl = (iconName: string) => {
  if (iconName === "clear-day") return `${WEATHER_ICON_URL}clear-day.svg`;
  if (iconName === "clear-night") return `${WEATHER_ICON_URL}clear-night.svg`;
  if (iconName === "rain") return `${WEATHER_ICON_URL}rain.svg`;
  if (iconName === "snow") return `${WEATHER_ICON_URL}snow.svg`;
  if (iconName === "sleet") return `${WEATHER_ICON_URL}sleet.svg`;
  if (iconName === "wind") return `${WEATHER_ICON_URL}wind.svg`;
  if (iconName === "fog") return `${WEATHER_ICON_URL}fog.svg`;
  if (iconName === "cloudy") return `${WEATHER_ICON_URL}cloudy.svg`;
  if (iconName === "partly-cloudy-day") return `${WEATHER_ICON_URL}partly-cloudy-day.svg`;
  if (iconName === "partly-cloudy-night") return `${WEATHER_ICON_URL}partly-cloudy-night.svg`;

  return "";
};

export const getMoonphaseIconUrl = (moonphase: number, url: string = MOON_ICON_URL) => {
  if (moonphase >= 0.875 && moonphase < 1) return `${url}moon-waning-crescent.svg`;
  if (moonphase >= 0.75) return `${url}moon-last-quarter.svg`;
  if (moonphase >= 0.625) return `${url}moon-waning-gibbous.svg`;
  if (moonphase >= 0.5) return `${url}moon-full.svg`;
  if (moonphase >= 0.375) return `${url}moon-waxing-gibbous.svg`;
  if (moonphase >= 0.25) return `${url}moon-waxing-crescent.svg`;
  if (moonphase >= 0.125) return `${url}moon-first-quarter.svg`;
  return `${url}moon-new.svg`;
};

export const latLonToXY = (lat: number, lon: number, zoom: number) => {
  const R = 6378137; // Earth's radius in meters
  const tileSize = 512; // size of a tile in pixels
  const initialResolution = (2 * Math.PI * R) / tileSize;
  const originShift = (2 * Math.PI * R) / 2.0;
  const lon0 = 0; // central meridian

  let x = ((lon - lon0) * originShift) / 180.0;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360.0)) / (Math.PI / 180.0);
  y = (y * originShift) / 180.0;

  const res = initialResolution / Math.pow(2, zoom);
  x = Math.floor((x + originShift) / res / tileSize);
  y = Math.floor((originShift - y) / res / tileSize);

  return { x, y };
};
