import { City } from "../model/WeatherExtendedSettings";

export const getWeatherBaseUrl = (city: City, appId: string) => {

    return "https://api.openweathermap.org/data/2.5/onecall?"
        + `appid=${appId}&`
        + `lat=${city.lat}&`
        + `lon=${city.lon}&`
        + `lang=en&`
        + `units=metric`;
} 