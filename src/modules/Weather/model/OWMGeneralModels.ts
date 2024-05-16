/**
 * See https://openweathermap.org/weather-conditions
 */
export interface WeatherCondition {
    id: number,
    main: string;
    description: string;
    icon: string;
}

export interface Coordinates {
    lon: number;
    lat: number;
}