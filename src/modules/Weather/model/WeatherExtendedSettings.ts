export interface City {
    name: string;
    lat: number;
    lon: number;
}

export enum WindType {
    SPEED = "speed",
    GUST = "gust",
}

export enum TemperatureType {
    TEMPERATURE = "temperature",
    FEELS_LIKE = "feels_like",
}

export interface ChartSettings {
    temperature: TemperatureType;
    wind?: WindType;
}

export interface WeatherExtendedSettings {
    city: City;
    chart: ChartSettings;
}