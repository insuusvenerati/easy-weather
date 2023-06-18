import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "~/routes/_landing";

export const WeatherRadarMap = () => {
  const { coords } = useTypedLoaderData<typeof loader>();
  const { lat, lon } = coords ?? {};

  return (
    <iframe
      title="Weather Radar Map"
      src={`https://www.rainviewer.com/map.html?loc=${lat},${lon},13&oFa=0&oC=1&oU=0&oCS=1&oF=0&oAP=0&c=7&o=90&lm=1&layer=radar&sm=1&sn=1&hu=0`}
      width="100%"
      className="h-[500px] border-0"
      allowFullScreen
    ></iframe>
  );
};
