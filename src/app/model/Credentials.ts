export enum Credentials {
    OPENWEATHERMAP_APP_ID = "openweathermap_app_id",
}

export const CREDENTIALS_NAMES: { [moduleType in Credentials]: string } = {
    [Credentials.OPENWEATHERMAP_APP_ID]: "OpenWeatherMap App ID",
}