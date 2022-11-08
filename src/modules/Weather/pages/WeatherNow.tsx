import AcUnitIcon from '@mui/icons-material/AcUnit';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import NavigationIcon from '@mui/icons-material/Navigation';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WindPowerIcon from '@mui/icons-material/WindPower';
import { Alert, Box, Typography, useTheme } from "@mui/material";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import Loading from '../../../app/landing/Loading';
import MissingInfo from '../../../app/landing/MissingInfo';
import { ContentModuleType, MODULE_NAMES } from '../../../app/model/ContentModule';
import { Credentials } from '../../../app/model/Credentials';
import { getWeatherBaseUrl } from '../helpers/WeatherHelper';
import { OpenWeatherMapOneCallResponse, WeatherCurrent, WeatherOneCallPart } from "../model/OpenWeatherMapModel";
import { City, WeatherExtendedSettings } from '../model/WeatherExtendedSettings';
import WeatherRainBar from "./WeatherRainBar";
import WeatherTemperatureChart from './WeatherTemperatureChart';

interface WeatherNowProps {
    moduleSettings: WeatherExtendedSettings | undefined;
    credentials: { [key: string]: string } | undefined;
}

const WeatherNow: React.FC<WeatherNowProps> = (props) => {

    const { moduleSettings, credentials } = props;

    const theme = useTheme();

    /**
     * Usage: show the current temperature, weather, wind, etc
     * Refresh interval: 1 hour
     */
    const [weatherCurrent, setWeatherCurrent] = useState<WeatherCurrent>();

    const fetchWeatherCurrent = (city: City, appId: string) => {

        const apiURL = `${getWeatherBaseUrl(city, appId)}&exclude=`
            + `${WeatherOneCallPart.MINUTELY},`
            + `${WeatherOneCallPart.HOURLY},`
            + `${WeatherOneCallPart.DAILY},`
            + WeatherOneCallPart.ALERTS;

        axios.get(apiURL)
            .then((response) => {

                const weatherResponse = response.data as OpenWeatherMapOneCallResponse;

                if (weatherResponse.current) {

                    setWeatherCurrent(weatherResponse.current);
                }
            });
    }

    /**
     * Refresh the data
     */
    useEffect(() => {

        if (
            !moduleSettings?.city?.name
            || !moduleSettings.city.lat
            || !moduleSettings.city.lon
            || !credentials?.openweathermap_app_id
        ) {
            return;
        }

        // First, fetch all the data
        fetchWeatherCurrent(moduleSettings.city, credentials![Credentials.OPENWEATHERMAP_APP_ID]);

        // Set the interval
        const intervalCurrent = setInterval(() => {
            fetchWeatherCurrent(moduleSettings.city!, credentials![Credentials.OPENWEATHERMAP_APP_ID])
        }, 1000 * 60 * 60 * 1);  // 1 hour

        return () => { clearInterval(intervalCurrent) }

    }, [moduleSettings, credentials]);

    const getTemperatureText = (weatherCurrent: WeatherCurrent): string => {

        if (weatherCurrent.temp_min && weatherCurrent.temp_max) {

            return `${Math.round(weatherCurrent.temp_min)}°C - ${Math.round(weatherCurrent.temp_max)}°C`;
        }
        else if (weatherCurrent.temp) {

            return `${Math.round(weatherCurrent.temp)}°C`;
        }
        else {

            return "";
        }
    }

    // TODO: one method for now and forecast
    const getWeatherDescription = (weatherCurrent: WeatherCurrent): string => {

        if (weatherCurrent.weather && weatherCurrent.weather.length > 0) {

            const desc: string = weatherCurrent.weather[0].description;

            return desc.charAt(0).toUpperCase() + desc.slice(1);
        }
        else {

            return "";
        }
    }

    // TODO: one method for now and forecast
    const getWeatherImage = (weatherCurrent: WeatherCurrent) => {

        if (weatherCurrent.weather && weatherCurrent.weather.length > 0) {

            return (

                <img
                    src={`./weather_icons/${weatherCurrent.weather[0].icon}.png`}
                    height="100%"
                    width="fit-content"
                    alt={weatherCurrent.weather[0].description}
                />
            );
        }
    }

    const getWindTextAndIcon = (weatherCurrent: WeatherCurrent) => {

        const windSpeed: number = Math.round(weatherCurrent.wind_speed * 3.6);
        const windGust: number | undefined = weatherCurrent.wind_gust ? Math.round(weatherCurrent.wind_gust * 3.6) : undefined;

        return (

            <Box display="flex" marginTop={2} alignItems="center">

                <NavigationIcon
                    fontSize="large"
                    style={{
                        transition: "all 0.2s ease-in-out",
                        transform: `rotate(${weatherCurrent.wind_deg + 180}deg)`,
                        marginTop: theme.spacing(-1),
                    }}
                />

                <Typography variant="h4" marginLeft={2} marginRight={5}>
                    {`${windSpeed} km/h`}
                </Typography>

                {
                    windGust
                    && (windGust >= (windSpeed + 15))  // Only show if there's a difference of at least 15 km/h
                    &&

                    <Alert
                        variant="filled"
                        severity="error"
                        iconMapping={{
                            error: <WindPowerIcon fontSize="medium" />,
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h4">
                            {`${windGust} km/h`}
                        </Typography>
                    </Alert>
                }

            </Box>
        );
    }

    const getTempFeelsLikeCard = (weatherCurrent: WeatherCurrent) => {

        // Difference between the 2 (negative or positive)
        const tempDifference = weatherCurrent.feels_like - weatherCurrent.temp;

        if (
            weatherCurrent.feels_like === undefined
            // If the difference is less than 3°C, don't show the "feels like"
            || Math.abs(tempDifference) < 3
        ) {

            return;
        }

        return (

            <Box marginTop={2} marginBottom={1} display="flex">

                <Alert
                    variant="filled"
                    severity={tempDifference < 0 ? "info" : "warning"}
                    iconMapping={{
                        info: <AcUnitIcon fontSize="medium" />,
                        warning: <WbSunnyIcon fontSize="medium" />,
                    }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: theme.spacing(0, 2),
                        width: "fit-content",
                        flex: "none",
                    }}
                >
                    <Typography variant="body1">
                        {`${Math.round(weatherCurrent.feels_like)}°C`}
                    </Typography>
                </Alert>
            </Box>
        );
    }

    if (
        !moduleSettings?.city?.name
        || !moduleSettings.city.lat
        || !moduleSettings.city.lon
        || !credentials?.openweathermap_app_id
    ) {
        return (<MissingInfo pageName={MODULE_NAMES[ContentModuleType.WEATHER_NOW]} />);
    }

    if (!weatherCurrent) {
        return (<Loading pageName={MODULE_NAMES[ContentModuleType.WEATHER_NOW]} />);
    }

    return (

        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={1}
        >

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width={.83}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    width={1}
                    marginBottom={2}
                >

                    <Box
                        display="flex"
                        flexDirection="column"
                        marginBottom={5}
                    >

                        <Box
                            display="flex"
                            alignItems="center"
                        >
                            <MyLocationIcon fontSize="large" />

                            <Typography variant="h4" marginLeft={2}>
                                {moduleSettings.city.name}
                            </Typography>
                        </Box>

                        <Box marginTop={4} display="flex">
                            <Typography variant="h3" > {getTemperatureText(weatherCurrent)} </Typography>
                            <Typography variant="h3" marginX={2}> - </Typography>
                            <Typography variant="h3" marginTop={0}> {getWeatherDescription(weatherCurrent)} </Typography>
                        </Box>

                        <Box>
                            {getTempFeelsLikeCard(weatherCurrent)}
                        </Box>

                        <Box>
                            {getWindTextAndIcon(weatherCurrent)}
                        </Box>

                    </Box>

                    {getWeatherImage(weatherCurrent)}

                </Box>

                <WeatherTemperatureChart
                    city={moduleSettings.city}
                    appId={credentials.openweathermap_app_id}
                />
                <WeatherRainBar
                    city={moduleSettings.city}
                    appId={credentials.openweathermap_app_id}
                />
            </Box>

        </Box>
    );
}

export default WeatherNow;