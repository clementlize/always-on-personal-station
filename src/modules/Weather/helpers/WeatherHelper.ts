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

export const HEAVIEST_RAIN_MM_PER_MINUTE = 7; // mm per hour

/**
 * Get a coefficient (0 to 1) of how heavy the rain is.
 * @param precipitation
 * @returns 
 */
export const getWeatherRainMinuteCoefficient = (precipitation: number): number => {
    if (!precipitation) {
        return 0;
    }
    if (precipitation > HEAVIEST_RAIN_MM_PER_MINUTE) {
        return 1;
    }
    return precipitation / HEAVIEST_RAIN_MM_PER_MINUTE;
}