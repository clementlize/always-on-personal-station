import { Coordinates, WeatherCondition } from "./OWMGeneralModels";

export interface WeatherCurrentResponse {

    // UNIX, UTC
    dt: number;  // Current time
    id: number;
    name: string;
    coord: Coordinates;

    weather: WeatherCondition[];
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level: number;
        grnd_level: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    rain: {
        "1h": number;
    };
    clouds: {
        all: number;
    }

    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
}