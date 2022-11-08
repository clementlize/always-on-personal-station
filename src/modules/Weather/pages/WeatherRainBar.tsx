import { Box, Typography } from "@mui/material";
import axios from "axios";
import interpolate from "color-interpolate";
import moment from "moment";
import { useEffect, useState } from "react";
import { getWeatherBaseUrl } from "../helpers/WeatherHelper";
import { OpenWeatherMapOneCallResponse, WeatherMinutely, WeatherOneCallPart } from "../model/OpenWeatherMapModel";
import { City } from "../model/WeatherExtendedSettings";

interface WeatherRainBarProps {
    city: City;
    appId: string;
}

// Based on this article https://www.baranidesign.com/faq-articles/2020/1/19/rain-rate-intensity-classification
const HEAVIEST_RAIN_MM_PER_MINUTE = .130;
const RAIN_COLOR_0 = "#ffffff00";
const RAIN_COLOR_0_1 = "#a7b9fdc7";
const RAIN_COLOR_1 = "#2c45b3";

const WeatherRainBar: React.FC<WeatherRainBarProps> = (props) => {

    const { city, appId } = props;

    /**
     * Usage: show the rain in the next hour
     * Refresh interval: 5 minutes
     */
    const [weatherMinutely, setWeatherMinutely] = useState<WeatherMinutely[]>();

    const fetchWeatherMinutely = () => {

        const apiURL = `${getWeatherBaseUrl(city, appId)}&exclude=`
            + `${WeatherOneCallPart.CURRENT},`
            + `${WeatherOneCallPart.HOURLY},`
            + `${WeatherOneCallPart.DAILY},`
            + WeatherOneCallPart.ALERTS;

        axios.get(apiURL)
            .then((response) => {
                const weatherResponse = response.data as OpenWeatherMapOneCallResponse;
                if (weatherResponse.minutely) {
                    setWeatherMinutely(weatherResponse.minutely);
                }
            });
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

    /**
     * Get a coefficient (0 to 1) of how heavy the rain is.
     * @param weatherMinute 
     * @returns 
     */
    const getWeatherRainMinuteCoefficient = (weatherMinute: WeatherMinutely): number => {

        if (!weatherMinute.precipitation) {
            return 0;
        }

        if (weatherMinute.precipitation > HEAVIEST_RAIN_MM_PER_MINUTE) {

            return 1;
        }

        return weatherMinute.precipitation / HEAVIEST_RAIN_MM_PER_MINUTE;
    }

    if (!weatherMinutely) {

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

                {weatherMinutely.map((weatherMinute, index) => {

                    const colorMap = interpolate([RAIN_COLOR_0, RAIN_COLOR_0_1, RAIN_COLOR_1]);

                    return (
                        <Box
                            key={index}
                            height={1}
                            flexGrow={1}
                            bgcolor={colorMap(getWeatherRainMinuteCoefficient(weatherMinute))}
                        >
                        </Box>
                    )
                })}

            </Box>

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

        </Box>
    );
}

export default WeatherRainBar;