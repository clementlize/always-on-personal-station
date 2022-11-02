import { ContentModule, ContentModuleType, CONTENT_MODULES_LOCALSTORAGE_NAME } from "../model/ContentModule";

/**
* Get the modules array from localStorage if available. 
*/
export const getModulesFromLocalStorage = (): ContentModule[] => {

    const saved = localStorage.getItem(CONTENT_MODULES_LOCALSTORAGE_NAME);

    if (saved) {
        return JSON.parse(saved) as ContentModule[];
    }
    else {
        return getDefaultModules();
    }
}

const getDefaultModules = (): ContentModule[] => {
    return [{ type: ContentModuleType.CLOCK_AND_TIME }];
}

export const getEnabledModules = (modules: ContentModule[]): ContentModule[] => {
    return modules.filter((module) => !module.disabled);
}