import { Box, TextField } from "@mui/material";
import { WeatherExtendedSettings } from "../model/WeatherExtendedSettings";

interface WeatherSettingsProps {
    moduleSettings: WeatherExtendedSettings | undefined;
    setModuleSettings: (newSettings: WeatherExtendedSettings) => void;
}

const WeatherSettings: React.FC<WeatherSettingsProps> = (props) => {

    const { moduleSettings, setModuleSettings } = props;

    const city = moduleSettings?.city ?? { name: "", lat: 0, lon: 0 };

    return (

        <Box
            display="flex"
            alignItems="center"
        >

            <TextField
                label="City"
                value={moduleSettings?.city?.name ?? ""}
                onChange={(e) => setModuleSettings({ ...moduleSettings, city: { name: e.target.value, lat: city.lat, lon: city.lon } })}
            />

            <TextField
                sx={{ marginLeft: 2 }}
                label="Latitude"
                type="number"
                value={moduleSettings?.city?.lat ?? ""}
                onChange={(e) => setModuleSettings({ ...moduleSettings, city: { name: city.name, lat: parseFloat(e.target.value), lon: city.lon } })}
            />

            <TextField
                sx={{ marginLeft: 2 }}
                label="Longitude"
                type="number"
                value={moduleSettings?.city?.lon ?? ""}
                onChange={(e) => setModuleSettings({ ...moduleSettings, city: { name: city.name, lat: city.lat, lon: parseFloat(e.target.value) } })}
            />

        </Box>
    )
}

export default WeatherSettings;