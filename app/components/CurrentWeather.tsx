import { getIconUrl } from "~/utils";

type CurrentWeatherProps = {
  temperature: number | undefined;
  icon: string | undefined;
  city: string | undefined;
};

export const CurrentWeather = ({ temperature, icon, city }: CurrentWeatherProps) => {
  if (!temperature || !icon || !city) return null;

  return (
    <div className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 items-center justify-between p-2 h-9 w-48">
      <h2 className="text-sm font-semibold">{city}</h2>
      <div className="flex items-center gap-2">
        <img src={getIconUrl(icon)} alt="overcast clouds" className="w-10 h-10" />
        <div className="font-medium text-sm">{temperature}°F</div>
      </div>
    </div>
  );
};
