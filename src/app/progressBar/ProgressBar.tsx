import { Box, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { DEFAULT_DISPLAY_TIME } from "../Defaults";
import { ContentModule, ContentModuleType, ModuleRefs } from "../model/ContentModule";
import { getEnabledModules } from "../utils/AppUtils";
import { getModuleFromTimeProgress, getTotalTime } from "./ProgressBarUtils";

interface ProgressBarsProps {
    modules: ContentModule[];
    moduleRefs: ModuleRefs;
    lockScroll: boolean;
}

const ProgressBars: React.FC<ProgressBarsProps> = (props) => {

    const { modules, moduleRefs, lockScroll } = props;
    const [timeProgress, setTimeProgress] = useState<number>(0);
    const [displayedModule, setDisplayedModule] = useState<ContentModuleType>(modules[0].type);

    /**
     * When the modules are refreshed, reset the progress to 0
     */
    useEffect(() => {
        setTimeProgress(0);
    }, [modules]);

    /**
     * Set timeProgress and refresh every second
     */
    useEffect(() => {

        if (lockScroll) {
            return;
        }

        const interval = setInterval(() => {
            incrementTimeProgress(getTotalTime(modules));
        }, 1000);

        return () => clearInterval(interval);

    }, [lockScroll, modules]);

    const incrementTimeProgress = (totalTime: number) => {

        setTimeProgress(progress => {

            // Example: 1 screen of 10s. If we're at 9 (totalTime -1) it means that next one is 10, so go back to 0
            if (progress >= (totalTime - 1)) {
                return 0
            }
            else {
                return progress + 1;
            }
        });
    }

    /**
     * At each clock tick, we decide which view we'll scroll to
     */
    useEffect(() => {
        const moduleToDisplay: ContentModuleType = getModuleFromTimeProgress(modules, timeProgress);
        if (moduleToDisplay !== displayedModule) {
            moduleRefs[moduleToDisplay].current?.scrollIntoView({ behavior: "smooth" });
            setDisplayedModule(moduleToDisplay);
        }
    }, [timeProgress, modules]);

    const getPercentage1 = (progress: number): number => {
        return Math.round((progress + 1) * 100 / getTotalTime(modules));
    }

    const getPercentage2 = (progress: number): number => {

        const moduleToDisplay: ContentModuleType = getModuleFromTimeProgress(modules, progress);

        let timeOfPreviousModules = 0;
        for (const module of modules) {
            if (module.type === moduleToDisplay) {
                break;
            }
            timeOfPreviousModules += module.display_time ?? DEFAULT_DISPLAY_TIME;
        }

        const maxTimeForThisScreen = timeOfPreviousModules + (modules.find(m => m.type === moduleToDisplay)?.display_time ?? DEFAULT_DISPLAY_TIME);

        const progressZeroed = progress - timeOfPreviousModules;
        const maxTimeZeroed = maxTimeForThisScreen - timeOfPreviousModules;

        return Math.round((progressZeroed + 1) * 100 / maxTimeZeroed);
    }

    return (

        <Box
            position="fixed"
            top={0}
            width={1}
            display="flex"
            flexDirection="column"
        >

            <LinearProgress
                variant="determinate"
                value={getPercentage1(timeProgress)}
                color="secondary"
                style={{
                    backgroundColor: "transparent",
                }}
            />

            {getEnabledModules(modules).length > 1 &&
                <LinearProgress
                    variant="determinate"
                    value={getPercentage2(timeProgress)}
                    color="secondary"
                    style={{
                        backgroundColor: "transparent",
                    }}
                />
            }

        </Box>
    );
}

export default ProgressBars;