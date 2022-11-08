import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Controls from "./app/controls/Controls";
import { ContentModuleType, ModuleRefs, USERDATA_LOCALSTORAGE_NAME } from "./app/model/ContentModule";
import { UserData } from "./app/model/UserData";
import { getUserDataFromLocalStorage } from "./app/utils/AppUtils";
import { defaultTheme } from "./config/theme";
import Modules from "./modules/Modules";

const App = () => {

    const [userData, setUserData] = useState<UserData>(getUserDataFromLocalStorage());
    const moduleRefs: ModuleRefs = {
        [ContentModuleType.CLOCK_AND_TIME]: useRef<HTMLDivElement>(null),
        [ContentModuleType.WEATHER_NOW]: useRef<HTMLDivElement>(null),
        [ContentModuleType.WEATHER_FORECAST]: useRef<HTMLDivElement>(null),
    }

    /**
     * Saving the user data in localStorage at each modification
     */
    useEffect(() => {
        if (userData) {
            localStorage.setItem(USERDATA_LOCALSTORAGE_NAME, JSON.stringify(userData));
        }
    }, [userData]);

    /**
     * When the page is loaded or when the list of modules is refreshed, 
     * go to the first module
     */
    useEffect(() => {
        moduleRefs[userData.modules[0].type].current?.scrollIntoView({ behavior: "smooth" });
    }, [userData]);

    return (

        <ThemeProvider theme={defaultTheme}>

            <CssBaseline />

            {/* Everything that makes the app work, that isn't content */}
            <Controls
                userData={userData}
                setUserData={(newData: UserData) => setUserData(newData)}
                moduleRefs={moduleRefs}
            />

            <Modules
                userData={userData}
                moduleRefs={moduleRefs}
            />

        </ThemeProvider>
    );
}

export default App;
