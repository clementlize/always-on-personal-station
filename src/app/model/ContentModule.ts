export interface ContentModule {

    type: ContentModuleType;
    ref: string;

    disabled?: boolean;
    display_time?: number;  // Seconds

    // When used, set these fields to the correct types.
    // For example: in the Weather scope, settings will have the WeatherSettings type (use the key "as")
    extended_settings?: any;
    credentials?: any;
}

export enum ContentModuleType {
    CLOCK_AND_TIME = "clock_and_time",
    WEATHER_NOW = "weather_now",
    WEATHER_FORECAST = "weather_forecast",
}

export const MODULE_NAMES: { [moduleType in ContentModuleType]: string } = {
    [ContentModuleType.CLOCK_AND_TIME]: "Clock and Time",
    [ContentModuleType.WEATHER_NOW]: "Weather Now",
    [ContentModuleType.WEATHER_FORECAST]: "Weather Forecast",
}


export const USERDATA_LOCALSTORAGE_NAME = "user_data";

export type ModuleRefs = { [moduleType in ContentModuleType]: React.RefObject<HTMLDivElement> };