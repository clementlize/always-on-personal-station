import MyLocationIcon from '@mui/icons-material/MyLocation';
import { Box, Checkbox, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from 'react';
import { TemperatureType, WeatherExtendedSettings, WindType } from "../model/WeatherExtendedSettings";

interface WeatherSettingsProps {
    moduleSettings: WeatherExtendedSettings | undefined;
    setModuleSettings: (newSettings: WeatherExtendedSettings) => void;
}

const WeatherSettings: React.FC<WeatherSettingsProps> = (props) => {

    const { moduleSettings, setModuleSettings } = props;

    const weatherSettings = {
        city: moduleSettings?.city ?? { name: "", lat: 0, lon: 0 },
        chart: moduleSettings?.chart ?? { temperature: TemperatureType.FEELS_LIKE }
    }

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
                    ...weatherSettings,
                    city: {
                        ...weatherSettings.city,
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
            flexDirection="column"
        >
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
                    value={weatherSettings.city.name ?? ""}
                    onChange={(e) => setModuleSettings({
                        ...weatherSettings,
                        city: {
                            ...weatherSettings.city,
                            name: e.target.value,
                        }
                    })}
                />

                <TextField
                    sx={{ marginLeft: 2 }}
                    label="Latitude"
                    type="number"
                    value={weatherSettings.city.lat ?? ""}
                    onChange={(e) => setModuleSettings({
                        ...weatherSettings,
                        city: {
                            ...weatherSettings.city,
                            lat: parseFloat(e.target.value),
                        }
                    })}
                />

                <TextField
                    sx={{ marginLeft: 2 }}
                    label="Longitude"
                    type="number"
                    value={weatherSettings.city.lon ?? ""}
                    onChange={(e) => setModuleSettings({
                        ...weatherSettings,
                        city: {
                            ...weatherSettings.city,
                            lon: parseFloat(e.target.value)
                        }
                    })}
                />
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                marginTop={2}
            >
                <Typography variant="h6">Chart</Typography>

                <Box
                    display="flex"
                    flexDirection="column"
                    marginLeft={2}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                    >
                        <Typography>Temperature type:</Typography>
                        <Select
                            value={weatherSettings.chart.temperature}
                            sx={{ marginLeft: 2 }}
                            onChange={(e) => setModuleSettings({
                                ...weatherSettings,
                                chart: {
                                    ...weatherSettings.chart,
                                    temperature: e.target.value as TemperatureType,
                                }
                            })}
                        >
                            <MenuItem value={TemperatureType.TEMPERATURE}>Temperature</MenuItem>
                            <MenuItem value={TemperatureType.FEELS_LIKE}>Feels like</MenuItem>
                        </Select>
                    </Box>

                    <Box
                        display="flex"
                        alignItems="center"
                        marginTop={1}
                    >
                        <Typography>Show wind:</Typography>
                        <Checkbox
                            checked={Boolean(weatherSettings.chart.wind)}
                            onChange={(e) => setModuleSettings({
                                ...weatherSettings,
                                chart: {
                                    ...weatherSettings.chart,
                                    wind: e.target.checked ? WindType.GUST : undefined,
                                }
                            })}
                            sx={{ marginLeft: 1 }}
                        />
                        {Boolean(weatherSettings.chart.wind) &&
                            <>
                                <Typography sx={{ marginLeft: 2 }}>Wind type:</Typography>
                                <Select
                                    value={weatherSettings.chart.wind}
                                    sx={{ marginLeft: 2 }}
                                    onChange={(e) => setModuleSettings({
                                        ...weatherSettings,
                                        chart: {
                                            ...weatherSettings.chart,
                                            wind: e.target.value as WindType,
                                        }
                                    })}
                                >
                                    <MenuItem value={WindType.SPEED}>Speed</MenuItem>
                                    <MenuItem value={WindType.GUST}>Gust</MenuItem>
                                </Select>
                            </>
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default WeatherSettings;