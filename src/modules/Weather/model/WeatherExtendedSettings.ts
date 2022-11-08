export interface City {
    name: string;
    lat: number;
    lon: number;
}

export interface WeatherExtendedSettings {
    city?: City;
}