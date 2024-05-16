import { City } from "../model/WeatherExtendedSettings";

export const getWeatherBaseUrl = () => {
    return "https://api.openweathermap.org/data";
}

export const getWeatherUrlParams = (city: City, appId: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append("appid", appId);
    searchParams.append("lat", city.lat.toString());
    searchParams.append("lon", city.lon.toString());
    searchParams.append("lang", "en");
    searchParams.append("units", "metric");
    return searchParams;
}