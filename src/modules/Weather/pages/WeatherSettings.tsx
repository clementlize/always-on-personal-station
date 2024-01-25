import MyLocationIcon from '@mui/icons-material/MyLocation';
import { Box, IconButton, TextField } from "@mui/material";
import { useState } from 'react';
import { WeatherExtendedSettings } from "../model/WeatherExtendedSettings";

interface WeatherSettingsProps {
    moduleSettings: WeatherExtendedSettings | undefined;
    setModuleSettings: (newSettings: WeatherExtendedSettings) => void;
}

const WeatherSettings: React.FC<WeatherSettingsProps> = (props) => {

    const { moduleSettings, setModuleSettings } = props;

    const city = moduleSettings?.city ?? { name: "", lat: 0, lon: 0 };

    const [geolocationError, setGeolocationError] = useState<boolean>(false);

    const getLocation = () => {

        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by your browser");
            setGeolocationError(true);
        }

        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                setModuleSettings({
                    ...moduleSettings,
                    city: {
                        ...city,
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    }
                });
                setGeolocationError(false);
            },
            // Error callback
            (error) => {
                console.error(error);
                setGeolocationError(true);
            }
        );
    }

    return (

        <Box
            display="flex"
            alignItems="center"
        >

            <IconButton
                onClick={() => getLocation()}
                color={geolocationError ? "error" : undefined}
            >
                <MyLocationIcon fontSize="small" />
            </IconButton>

            <TextField
                sx={{ marginLeft: 2 }}
                label="City"
                value={city.name ?? ""}
                onChange={(e) => setModuleSettings({
                    ...moduleSettings,
                    city: {
                        ...city,
                        name: e.target.value,
                    }
                })}
            />

            <TextField
                sx={{ marginLeft: 2 }}
                label="Latitude"
                type="number"
                value={city.lat ?? ""}
                onChange={(e) => setModuleSettings({
                    ...moduleSettings,
                    city: {
                        ...city,
                        lat: parseFloat(e.target.value),
                    }
                })}
            />

            <TextField
                sx={{ marginLeft: 2 }}
                label="Longitude"
                type="number"
                value={city.lon ?? ""}
                onChange={(e) => setModuleSettings({
                    ...moduleSettings,
                    city: {
                        ...city,
                        lon: parseFloat(e.target.value)
                    }
                })}
            />

        </Box>
    )
}

export default WeatherSettings;