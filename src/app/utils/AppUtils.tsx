import { Box, Link, Typography } from "@mui/material";
import { ContentModule, ContentModuleType, USERDATA_LOCALSTORAGE_NAME } from "../model/ContentModule";
import { CredentialName } from "../model/Credentials";
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

export const getRequiredCredentialsList = (modules: ContentModule[]): { name: CredentialName, specificChildren?: JSX.Element }[] => {

    const requiredCredentials: ReturnType<typeof getRequiredCredentialsList> = [];

    modules.forEach((module) => {

        if (module.disabled) {
            return;
        }

        switch (module.type) {

            case ContentModuleType.WEATHER_NOW:
            case ContentModuleType.WEATHER_FORECAST:
                if (!requiredCredentials.find((credentialItem) => credentialItem.name === CredentialName.OPENWEATHERMAP_APP_ID)) {
                    requiredCredentials.push({
                        name: CredentialName.OPENWEATHERMAP_APP_ID,
                        specificChildren: (
                            <Box
                                display="flex"
                                flexDirection="column"
                            >
                                <Typography><span style={{ textDecoration: "underline" }}>Important</span>:&nbsp;you need to subscribe
                                    to OpenWeatherMap <span style={{ fontWeight: "bold" }}>OneCall API 3.0</span> for your token to work on this app.
                                </Typography>
                                <Typography sx={{ marginTop: .5 }}>
                                    The free subscription includes enough calls to make the app work properly 24-7.
                                    However, you will need to register a credit card on their website. To avoid unwanted fees, I strongly recommend you to setup a 1,000 calls per day limit.
                                    You can also use a dedicated virtual credit card with limited funds.
                                </Typography>
                                <Typography sx={{ marginTop: .5 }}>
                                    Visit <Link href="https://openweathermap.org/price#onecall">https://openweathermap.org/price#onecall</Link> and follow the steps to get started.
                                </Typography>
                            </Box>
                        )
                    });
                }
                return;

            default: return;
        }
    });

    return requiredCredentials;
}