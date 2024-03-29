import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { getWeatherIconUrl } from "~/utils";

type CurrentWeatherProps = {
  temperature: string | undefined;
  icon: string | undefined;
  city: string | undefined;
} & HTMLAttributes<HTMLDivElement>;

export const CurrentWeather = ({ temperature, icon, city, ...rest }: CurrentWeatherProps) => {
  if (!temperature || !icon || !city) return null;
  const styles = twMerge(
    "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 items-center justify-between p-2 h-9 w-48",
    rest.className
  );

  return (
    <div {...rest} className={styles}>
      <h2 className="text-sm font-semibold">{city}</h2>
      <div className="flex items-center gap-2">
        <img src={getWeatherIconUrl(icon)} alt="overcast clouds" className="w-10 h-10" />
        <div className="font-medium text-sm">{temperature}</div>
      </div>
    </div>
  );
};
