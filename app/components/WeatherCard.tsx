import { Card, Spinner } from "flowbite-react";
import { Suspense } from "react";
import type { DailyDatum } from "~/types/weather";
import { getMoonphaseIconUrl, getWeatherIconUrl } from "~/utils";

type CardProps = {
  day: DailyDatum;
  city: string | undefined;
};

const formatTime = (time: number) => {
  const date = new Date(time * 1000);
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return { time: `${hours}:${minutes < 10 ? "0" + minutes : minutes}`, dayOfWeek };
};

export const WeatherCard = ({ day, city }: CardProps) => {
  const {
    icon,
    sunriseTime,
    sunsetTime,
    windSpeed,
    summary,
    temperatureMax,
    temperatureMin,
    humidity,
    moonPhase,
  } = day;
  return (
    <Suspense fallback={<Spinner />}>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-2">
            {city && <h2 className="text-lg font-bold">{city}</h2>}
            <h2 className="text-lg font-medium">{formatTime(sunriseTime).dayOfWeek}</h2>
          </div>
          <img src={getWeatherIconUrl(icon)} alt={summary} className="w-36 h-36" />
        </div>
        <div className="flex items-center justify-start gap-4">
          <p className="text-3xl font-bold">{temperatureMax}&deg;F</p>
          {"/"}
          <p className="text-3xl">{temperatureMin}&deg;F</p>
          {/* <p className="text-gray-500">{summary}</p> */}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-gray-500">Humidity</p>
            <p className="text-lg font-medium">{(humidity * 100).toPrecision(2)}%</p>
          </div>
          <div>
            <p className="text-gray-500">Wind Speed</p>
            <p className="text-lg font-medium">{windSpeed} m/s</p>
          </div>
          <div>
            <p className="text-gray-500">Sunrise</p>
            <p className="text-lg font-medium">{formatTime(sunriseTime).time}</p>
          </div>
          <div>
            <p className="text-gray-500">Sunset</p>
            <p className="text-lg font-medium">{formatTime(sunsetTime).time}</p>
          </div>
          <div>
            <img
              className="w-10 h-10"
              src={getMoonphaseIconUrl(moonPhase)}
              alt={moonPhase.toString()}
            />
          </div>
        </div>
      </Card>
    </Suspense>
  );
};
