import { ContentModule, ContentModuleType, USERDATA_LOCALSTORAGE_NAME } from "../model/ContentModule";
import { Credentials } from "../model/Credentials";
import { UserData } from "../model/UserData";
import generateId from "./generateId";

/**
* Get the modules array from localStorage if available. 
*/
export const getUserDataFromLocalStorage = (): UserData => {

    const saved = localStorage.getItem(USERDATA_LOCALSTORAGE_NAME);

    if (saved) {
        return JSON.parse(saved) as UserData;
    }
    else {
        return getDefaultUserData();
    }
}

export const getDefaultUserData = (): UserData => {
    return {
        modules: [{
            type: ContentModuleType.CLOCK_AND_TIME,
            ref: generateId(),
        }]
    };
}

export const getEnabledModules = (modules: ContentModule[]): ContentModule[] => {
    return modules.filter((module) => !module.disabled);
}

export const getRequiredCredentialsList = (modules: ContentModule[]): Credentials[] => {

    const requiredCredentials: Credentials[] = [];

    modules.forEach((module) => {

        if (module.disabled) {
            return;
        }

        switch (module.type) {

            case ContentModuleType.WEATHER_NOW:
            case ContentModuleType.WEATHER_FORECAST:
                if (!requiredCredentials.includes(Credentials.OPENWEATHERMAP_APP_ID)) {
                    requiredCredentials.push(Credentials.OPENWEATHERMAP_APP_ID);
                }
                return;

            default: return;
        }
    });

    return requiredCredentials;
}