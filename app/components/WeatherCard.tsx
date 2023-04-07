import { Card } from "flowbite-react";
import { getIconUrl } from "~/utils";

type CardProps = {
  temperature: number;
  icon: string;
  city: string | undefined;
  description: string;
  humidity: number;
  windSpeed: number;
  sunrise: number;
  sunset: number;
};

const formatTime = (time: number) => {
  const date = new Date(time * 1000);
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return { time: `${hours}:${minutes < 10 ? "0" + minutes : minutes}`, dayOfWeek };
};

export const WeatherCard = ({
  temperature,
  icon,
  city,
  description,
  humidity,
  windSpeed,
  sunrise,
  sunset,
}: CardProps) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-2">
          {city && <h2 className="text-lg font-bold">{city}</h2>}
          <h2 className="text-lg font-medium">{formatTime(sunrise).dayOfWeek}</h2>
        </div>
        <img src={getIconUrl(icon)} alt={description} className="w-10 h-10" />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">{temperature}&deg;F</p>
        <p className="text-gray-500">{description}</p>
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
          <p className="text-lg font-medium">{formatTime(sunrise).time}</p>
        </div>
        <div>
          <p className="text-gray-500">Sunset</p>
          <p className="text-lg font-medium">{formatTime(sunset).time}</p>
        </div>
      </div>
    </Card>
  );
};
