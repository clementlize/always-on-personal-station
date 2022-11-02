
/**
 * See https://openweathermap.org/api/one-call-api
 */
export interface OpenWeatherMapOneCallResponse {

    lat: number;
    long: number;

    timezone: string;
    timezone_offset: string; // UNIX, UTC

    current?: WeatherCurrent;
    minutely?: WeatherMinutely[];
    hourly?: WeatherHourly[];
    daily?: WeatherDaily[];
}

export enum WeatherOneCallPart {

    CURRENT = "current",
    MINUTELY = "minutely",
    HOURLY = "hourly",
    DAILY = "daily",
    ALERTS = "alerts",
}

export interface Coordinates {

    lon: number;
    lat: number;
}

export interface WeatherCurrent {

    // UNIX, UTC
    dt: number;  // Current time
    sunrise: number;
    sunset: number;

    temp: number;
    feels_like: number;
    temp_min?: number;
    temp_max?: number;
    pressure: number;  // hPa
    humidity: number;  // %
    dew_point: number; // Atmospheric temperature (varying according to pressure and humidity) below which water droplets begin to condense and dew can form

    uvi: number;  // Current UV index
    clouds: number;  // Cloudiness, %

    visibility: number; // Average visibility, metres

    wind_speed: number;
    wind_gust?: number;
    wind_deg: number;

    weather: WeatherCondition[];
}

export interface WeatherMinutely {

    dt: number;  //  Time of the forecasted data, Unix, UTC
    precipitation: number;  // Precipitation volume, mm
}

export interface WeatherHourly {

    // UNIX, UTC
    dt: number;  // Current time

    temp: number;
    feels_like: number;
    pressure: number;  // hPa
    humidity: number;  // %
    dew_point: number; // Atmospheric temperature (varying according to pressure and humidity) below which water droplets begin to condense and dew can form

    uvi: number;  // Current UV index
    clouds: number;  // Cloudiness, %

    visibility: number; // Average visibility, metres

    wind_speed: number;
    wind_gust?: number;
    wind_deg: number;

    weather: WeatherCondition[];
    pop: number;  // Probability of precitipation
}

export interface WeatherDaily {

    // UNIX, UTC
    dt: number;  // Current time
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;

    /**
     * Moon phase. 0 and 1 are 'new moon', 0.25 is 'first quarter moon', 0.5 is 'full moon' and 0.75 is 'last quarter moon'.
     * The periods in between are called 'waxing crescent', 'waxing gibous', 'waning gibous', and 'waning crescent', respectively.
     */
    moon_phase: number;

    temp: WeatherDailyTemp;
    feels_like: WeatherDailyFeelsLike;
    pressure: number;  // hPa
    humidity: number;  // %
    dew_point: number; // Atmospheric temperature (varying according to pressure and humidity) below which water droplets begin to condense and dew can form

    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;

    weather: WeatherCondition[];

    clouds: number;  // Cloudiness, %
    pop: number;  // Probability of precipitation
    rain?: number;  // Precipitation volume, in mm
    snow?: number;  // Snow volume, in mm
    uvi: number;  // Current UV index
}

export interface WeatherDailyTemp {

    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
}

export interface WeatherDailyFeelsLike {

    day: number;
    night: number;
    eve: number;
    morn: number;
}

/**
 * See https://openweathermap.org/weather-conditions
 */
export interface WeatherCondition {
    id: number,
    main: string;
    description: string;
    icon: string;
}