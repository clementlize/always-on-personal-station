export interface ContentModule {
    type: ContentModuleType;
    disabled?: boolean;
    display_time?: number;  // Seconds 
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


export const CONTENT_MODULES_LOCALSTORAGE_NAME = "content_modules";

export type ModuleRefs = { [moduleType in ContentModuleType]: React.RefObject<HTMLDivElement> };