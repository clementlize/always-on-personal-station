import { Box, Typography } from "@mui/material";
import axios from "axios";
import interpolate from "color-interpolate";
import moment from "moment";
import { useEffect, useState } from "react";
import { getWeatherBaseUrl, getWeatherRainMinuteCoefficient, getWeatherUrlParams } from "../helpers/WeatherHelper";
import { OpenWeatherMapOneCallResponse, WeatherOneCallMinutely, WeatherOneCallPart } from "../model/OWMOneCallModels";
import { City } from "../model/WeatherExtendedSettings";

interface WeatherRainBarProps {
    city: City;
    appId: string;
}

// Based on this article http://pluiesextremes.meteo.fr/france-metropole/Intensite-de-precipitations.html
const RAIN_COLOR_NONE = "#ffffff00";
const RAIN_COLOR_MIDDLE = "#a7b9fdc7";
const RAIN_COLOR_HEAVY = "#2c45b3";

const WeatherRainBar: React.FC<WeatherRainBarProps> = (props) => {

    const { city, appId } = props;

    /**
     * Usage: show the rain in the next hour
     * Refresh interval: 5 minutes
     */
    const [weatherMinutely, setWeatherMinutely] = useState<WeatherOneCallMinutely[] | undefined | null>(undefined);

    const fetchWeatherMinutely = () => {

        const params = getWeatherUrlParams(city, appId);
        params.append("exclude", `${WeatherOneCallPart.CURRENT},`
            + `${WeatherOneCallPart.HOURLY},`
            + `${WeatherOneCallPart.DAILY},`
            + WeatherOneCallPart.ALERTS
        );
        const apiURL = `${getWeatherBaseUrl()}/3.0/onecall?${params.toString()}`

        axios.get(apiURL)
            .then((response) => {
                const weatherResponse = response.data as OpenWeatherMapOneCallResponse;
                if (weatherResponse.minutely) {
                    setWeatherMinutely(weatherResponse.minutely);
                }
            })
            .catch((error) => {
                console.log(error.response.status);
                if (error.response.status === 401) {
                    setWeatherMinutely(null);  // Maybe missing the oneCall API subscription plan?
                }
            });;
    }

    /**
     * Refresh the data
     */
    useEffect(() => {

        // First, fetch all the data
        fetchWeatherMinutely();

        // Set the intervals
        const intervalMinutely = setInterval(() => fetchWeatherMinutely(), 1000 * 60 * 5);  // 5 minutes

        return () => { clearInterval(intervalMinutely) }
    }, []);

    if (weatherMinutely === undefined) {
        // TODO: ghost loading
        return (<Box />);
    }

    return (

        <Box
            width={1}
            display="flex"
            flexDirection="column"
        >

            <Box
                width={1}
                height="3em"
                border="1px solid #878787"
                borderRadius={2}
                display="flex"
                overflow="hidden"
            >

                {weatherMinutely

                    ? weatherMinutely.map((weatherMinute, index) => {

                        const colorMap = interpolate([RAIN_COLOR_NONE, RAIN_COLOR_MIDDLE, RAIN_COLOR_HEAVY]);

                        return (
                            <Box
                                key={index}
                                height={1}
                                flexGrow={1}
                                bgcolor={colorMap(getWeatherRainMinuteCoefficient(weatherMinute.precipitation))}
                            >
                            </Box>
                        )
                    })

                    : <Typography variant="caption">
                        You may need to subscribe to the oneCall API 3.0 to display this. <a href="https://openweathermap.org/api/one-call-3" target="_blank">Learn more.</a>
                    </Typography>
                }

            </Box>

            {weatherMinutely &&
                <Box
                    width={1}
                    display="flex"
                    justifyContent="space-between"
                    marginTop={1}
                >

                    <Typography>
                        {moment.unix(weatherMinutely[0].dt).format("HH:mm")}
                    </Typography>

                    <Typography>+15 min</Typography>
                    <Typography>+30 min</Typography>
                    <Typography>+45 min</Typography>
                    <Typography>+60 min</Typography>

                </Box>
            }
        </Box>
    );
}

export default WeatherRainBar;