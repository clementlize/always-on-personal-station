import { WeatherCondition } from "./OWMGeneralModels";

/**
 * See https://openweathermap.org/api/one-call-api
 */
export interface OpenWeatherMapOneCallResponse {

    lat: number;
    long: number;

    timezone: string;
    timezone_offset: string; // UNIX, UTC

    minutely?: WeatherOneCallMinutely[];
    hourly?: WeatherOneCallHourly[];
    daily?: WeatherOneCallDaily[];
}

export enum WeatherOneCallPart {
    CURRENT = "current",
    MINUTELY = "minutely",
    HOURLY = "hourly",
    DAILY = "daily",
    ALERTS = "alerts",
}

export interface WeatherOneCallMinutely {
    dt: number;  //  Time of the forecasted data, Unix, UTC
    precipitation: number;  // Precipitation volume, mm
}

export interface WeatherOneCallHourly {

    dt: number;  //  Time of the forecasted data, Unix, UTC

    temp: number;
    feels_like: number;

    pressure: number;
    humidity: number;
    dew_point: number;

    uvi: number;
    clouds: number;
    visibility: number;

    wind_speed: number;
    wind_gust: number;
    wind_deg: number;

    pop: number;  // Probability of precipitation, from 0 to 1

    rain: {
        "1h": number;  // In mm/hr
    }
    snow: {
        "1h": number;  // In mm/hr
    }

    weather: WeatherCondition[];
}

export interface WeatherOneCallDaily {

    dt: number;

    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;

    summary: string;

    temp: {
        morn: number;
        day: number;
        eve: number;
        night: number;
        min: number;
        max: number;
    }
    feels_like: {
        morn: number;
        day: number;
        eve: number;
        night: number;
    }

    pressure: number;
    humidity: number;
    dew_point: number;

    wind_speed: number;
    wind_gust: number;
    wind_deg: number;

    clouds: number;
    uvi: number;

    pop: number;  // Probability of precipitation, from 0 to 1
    rain: number;  // In mm/hr
    snow: number;  // In mm/hr

    weather: WeatherCondition[];
}