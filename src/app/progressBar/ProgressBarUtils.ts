import { DEFAULT_DISPLAY_TIME } from "../Defaults";
import { ContentModule, ContentModuleType } from "../model/ContentModule";
import { getEnabledModules } from "../utils/AppUtils";

export const getTotalTime = (modules: ContentModule[]): number => {

    return getEnabledModules(modules).reduce((total, module) => {
        return total + (module.display_time ?? DEFAULT_DISPLAY_TIME);
    }, 0);
}

export const getModuleFromTimeProgress = (modules: ContentModule[], timeProgress: number): ContentModuleType => {

    let moduleTimesSum = 0;
    for (const module of getEnabledModules(modules)) {

        const moduleDisplayTime = module.display_time ?? DEFAULT_DISPLAY_TIME;
        if (moduleTimesSum + moduleDisplayTime > timeProgress) {
            return module.type;
        }
        else {
            moduleTimesSum += moduleDisplayTime;
        }
    }

    // We went to the end of the loop, might be the first one.
    return getEnabledModules(modules)[0]?.type ?? ContentModuleType.CLOCK_AND_TIME;
}