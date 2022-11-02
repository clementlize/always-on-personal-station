import { City } from "../../Modules";

export const getWeatherBaseUrl = (city: City) => {

    return "https://api.openweathermap.org/data/2.5/onecall?"
        + `appid=${process.env.REACT_APP_OPENWEATHERMAP_APPID}&`
        + `lat=${city.lat}&`
        + `lon=${city.lon}&`
        + `lang=en&`
        + `units=metric`;
} 