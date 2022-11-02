import { Box } from "@mui/material";
import { useState } from "react";
import { getEnabledModules } from "../app/controls/ControlsUtils";
import { ContentModule, ContentModuleType, ModuleRefs } from "../app/model/ContentModule";
import ClockAndTime from "./ClockAndTime/pages/ClockAndTime";
import WeatherForecast from "./Weather/pages/WeatherForecast";
import WeatherNow from "./Weather/pages/WeatherNow";

interface ModuleProps {
    modules: ContentModule[];
    moduleRefs: ModuleRefs;
}

const Module: React.FC<ModuleProps> = (props) => {

    const { modules, moduleRefs } = props;

    /**
    * The city name and coordinates
    */
    const defaultCity: City = {
        name: "Strasbourg",
        lat: 48.58,
        lon: 7.75,
    }
    const [city,] = useState<City>(defaultCity);

    return (

        <>

            {getEnabledModules(modules).map((module, index) => {

                switch (module.type) {

                    case ContentModuleType.CLOCK_AND_TIME: return (
                        <Box key={index} height={1} ref={moduleRefs[ContentModuleType.CLOCK_AND_TIME]}>
                            <ClockAndTime />
                        </Box>
                    );

                    case ContentModuleType.WEATHER_NOW: return (
                        <Box key={index} height={1} ref={moduleRefs[ContentModuleType.WEATHER_NOW]}>
                            <WeatherNow city={city} />
                        </Box>
                    );

                    case ContentModuleType.WEATHER_FORECAST: return (
                        <Box key={index} height={1} ref={moduleRefs[ContentModuleType.WEATHER_FORECAST]}>
                            <WeatherForecast city={city} />
                        </Box>
                    );

                    default: return null;
                }
            })}

        </>

    );
}

export default Module;

// TODO: move
export interface City {
    name: string;
    lat: number;
    lon: number;
}