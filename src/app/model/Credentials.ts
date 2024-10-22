export enum CredentialName {
    OPENWEATHERMAP_APP_ID = "openweathermap_app_id",
}

export const CREDENTIALS_FORMATTED_NAMES: { [moduleType in CredentialName]: string } = {
    [CredentialName.OPENWEATHERMAP_APP_ID]: "OpenWeatherMap App ID",
}