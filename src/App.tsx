import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Controls from "./app/controls/Controls";
import { getModulesFromLocalStorage } from "./app/controls/ControlsUtils";
import { ContentModule, ContentModuleType, CONTENT_MODULES_LOCALSTORAGE_NAME, ModuleRefs } from "./app/model/ContentModule";
import { defaultTheme } from "./config/theme";
import Modules from "./modules/Modules";

const App = () => {

    const [modules, setModules] = useState<ContentModule[]>(getModulesFromLocalStorage());
    const moduleRefs: ModuleRefs = {
        [ContentModuleType.CLOCK_AND_TIME]: useRef<HTMLDivElement>(null),
        [ContentModuleType.WEATHER_NOW]: useRef<HTMLDivElement>(null),
        [ContentModuleType.WEATHER_FORECAST]: useRef<HTMLDivElement>(null),
    }

    /**
     * Saving the modules in localStorage at each modification
     */
    useEffect(() => {
        if (modules) {
            localStorage.setItem(CONTENT_MODULES_LOCALSTORAGE_NAME, JSON.stringify(modules));
        }
    }, [modules]);

    /**
     * When the page is loaded or when the list of modules is refreshed, 
     * go to the first module
     */
    useEffect(() => {
        moduleRefs[modules[0].type].current?.scrollIntoView({ behavior: "smooth" });
    }, [modules]);

    return (

        <ThemeProvider theme={defaultTheme}>

            <CssBaseline />

            {/* Everything that makes the app work, that isn't content */}
            <Controls
                modules={modules}
                setModules={(newModules: ContentModule[]) => setModules(newModules)}
                moduleRefs={moduleRefs}
            />

            <Modules
                modules={modules}
                moduleRefs={moduleRefs}
            />

        </ThemeProvider>
    );
}

export default App;
