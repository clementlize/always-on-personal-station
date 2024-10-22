import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { ContentModuleType } from "../model/ContentModule";
import { UserData } from "../model/UserData";

interface OpenWeatherMapMigrationAlertProps {
    userData: UserData;
    setUserData: (data: UserData) => void;
    setLockScroll: (lock: boolean) => void;
}

const OpenWeatherMapMigrationAlert: React.FC<OpenWeatherMapMigrationAlertProps> = (props) => {

    const { userData, setUserData, setLockScroll } = props;

    const [needsToDisplayAlert, setNeedsToDisplayAlert] = useState<boolean>(false);

    const setOwmFlagToStorage = useCallback((currentData: UserData) => {
        setUserData({
            ...currentData,
            deployment_utils: {
                ...currentData.deployment_utils,
                has_updated_to_version_1_1_0: true,
            }
        });
        setLockScroll(false);
    }, [setUserData, setLockScroll]);

    // Either lock scroll and display alert, or
    useEffect(() => {

        if (userData.deployment_utils?.has_updated_to_version_1_1_0) {
            setNeedsToDisplayAlert(false);
            setLockScroll(false);
        }
        else {

            if (
                userData.modules.find((module) => module.type === ContentModuleType.WEATHER_NOW)
                || userData.modules.find((module) => module.type === ContentModuleType.WEATHER_FORECAST)
            ) {
                setNeedsToDisplayAlert(true);
                setLockScroll(true);
            }
            else {
                setOwmFlagToStorage(userData);
            }
        }
    }, [userData, setOwmFlagToStorage, setLockScroll]);

    if (!needsToDisplayAlert) {
        return null;
    }

    return (
        <Dialog
            onClose={(event, reason) => {
                if (reason === "backdropClick") {
                    return;
                }
                setOwmFlagToStorage(userData)
            }}
            open={Boolean(needsToDisplayAlert)}
        >
            <DialogTitle>
                Important notice
            </DialogTitle>

            <DialogContent>
                <Box
                    display="flex"
                    flexDirection="column"
                >
                    <Typography>
                        In June 2024, the service used by the app to get the weather data (OpenWeatherMap OneCall API 2.5) has been shut down.
                    </Typography>
                    <Typography sx={{ marginTop: .5 }}>
                        Therefore, the app will now use a new service (OpenWeatherMap OneCall API 3.0).
                    </Typography>
                    <Typography sx={{ marginTop: 1 }}>
                        <span style={{ textDecoration: "underline" }}>Important</span>: this new service requires a subscription (a free plan is available) available on their website.
                    </Typography>
                    <Typography sx={{ marginTop: .5 }}>
                        Please go to Settings {">"} Credentials to learn more on how to subscribe freely and keep using the weather modules.
                    </Typography>
                    <Typography sx={{ marginTop: 1.5 }}>
                        Thank you for using the app!
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => setOwmFlagToStorage(userData)}>Understood</Button>
            </DialogActions>
        </Dialog>
    );
}

export default OpenWeatherMapMigrationAlert;