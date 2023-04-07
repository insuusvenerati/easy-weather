export const getIconUrl = (iconName: string) => {
  const baseUrl =
    "https://cdn.jsdelivr.net/gh/manifestinteractive/weather-underground-icons@latest/dist/icons/white/svg/";
  switch (iconName) {
    case "clear-day":
      return `${baseUrl}clear.svg`;
    case "clear-night":
      return `${baseUrl}nt_clear.svg`;
    case "rain":
      return `${baseUrl}rain.svg`;
    case "snow":
      return `${baseUrl}snow.svg`;
    case "sleet":
      return `${baseUrl}sleet.svg`;
    case "wind":
      return `${baseUrl}wind.svg`;
    case "fog":
      return `${baseUrl}fog.svg`;
    case "cloudy":
      return `${baseUrl}cloudy.svg`;
    case "partly-cloudy-day":
      return `${baseUrl}partlycloudy.svg`;
    case "partly-cloudy-night":
      return `${baseUrl}nt_partlycloudy.svg`;
    default:
      return "";
  }
};
