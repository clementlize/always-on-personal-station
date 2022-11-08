import { Box } from "@mui/material";
import { ContentModuleType, ModuleRefs } from "../app/model/ContentModule";
import { UserData } from "../app/model/UserData";
import { getEnabledModules } from "../app/utils/AppUtils";
import ClockAndTime from "./ClockAndTime/pages/ClockAndTime";
import WeatherForecast from "./Weather/pages/WeatherForecast";
import WeatherNow from "./Weather/pages/WeatherNow";

interface ModuleProps {
    userData: UserData;
    moduleRefs: ModuleRefs;
}

const Module: React.FC<ModuleProps> = (props) => {

    const { userData, moduleRefs } = props;

    return (

        <>

            {getEnabledModules(userData.modules).map((module, index) => {

                switch (module.type) {

                    case ContentModuleType.CLOCK_AND_TIME: return (
                        <Box key={index} height={1} ref={moduleRefs[ContentModuleType.CLOCK_AND_TIME]}>
                            <ClockAndTime />
                        </Box>
                    );

                    case ContentModuleType.WEATHER_NOW: return (
                        <Box key={index} height={1} ref={moduleRefs[ContentModuleType.WEATHER_NOW]}>
                            <WeatherNow moduleSettings={module.extended_settings} credentials={userData.credentials} />
                        </Box>
                    );

                    case ContentModuleType.WEATHER_FORECAST: return (
                        <Box key={index} height={1} ref={moduleRefs[ContentModuleType.WEATHER_FORECAST]}>
                            <WeatherForecast moduleSettings={module.extended_settings} credentials={userData.credentials} />
                        </Box>
                    );

                    default: return null;
                }
            })}

        </>

    );
}

export default Module;