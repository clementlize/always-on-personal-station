import MyLocationIcon from '@mui/icons-material/MyLocation';
import { Box, Card, CardActions, CardContent, Typography, useTheme } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Loading from "../../../app/landing/Loading";
import MissingInfo from "../../../app/landing/MissingInfo";
import ModuleError from '../../../app/landing/ModuleError';
import { ContentModuleType, MODULE_NAMES } from "../../../app/model/ContentModule";
import { CARD_BACKGROUND_COLORMAP } from "../../../style/AppStyle";
import { getWeatherBaseUrl, getWeatherUrlParams } from "../helpers/WeatherHelper";
import { OpenWeatherMapOneCallResponse, WeatherOneCallDaily, WeatherOneCallPart } from '../model/OWMOneCallModels';
import { City, WeatherExtendedSettings } from "../model/WeatherExtendedSettings";

interface WeatherForecastProps {
    moduleSettings: WeatherExtendedSettings | undefined;
    credentials: { [key: string]: string } | undefined;
}

const WeatherForecast: React.FC<WeatherForecastProps> = (props) => {

    const { moduleSettings, credentials } = props;

    const theme = useTheme();

    /**
     * Usage: show the forecast for the next 8 days
     * Refresh interval: 3 hours
     */
    const [weatherDaily, setWeatherDaily] = useState<WeatherOneCallDaily[] | null | undefined>(undefined);

    const fetchWeatherDaily = (city: City, appId: string) => {

        const params = getWeatherUrlParams(city, appId);
        params.append("exclude", `${WeatherOneCallPart.CURRENT},`
            + `${WeatherOneCallPart.MINUTELY},`
            + `${WeatherOneCallPart.HOURLY},`
            + WeatherOneCallPart.ALERTS
        );
        const apiURL = `${getWeatherBaseUrl()}/3.0/onecall?${params.toString()}`;

        axios.get(apiURL)
            .then((response) => {
                const weatherResponse = response.data as OpenWeatherMapOneCallResponse;
                if (weatherResponse.daily) {
                    setWeatherDaily(weatherResponse.daily);
                }
            })
            .catch((error) => {
                console.error(error);
                setWeatherDaily(null);
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
        fetchWeatherDaily(moduleSettings.city, credentials.openweathermap_app_id);

        // Set the intervals
        const intervalDaily = setInterval(() => fetchWeatherDaily(moduleSettings.city!, credentials.openweathermap_app_id), 1000 * 60 * 60 * 3);  // 3 hours

        return () => { clearInterval(intervalDaily) }
    }, [moduleSettings, credentials]);

    const getDayTemperatures = (weatherDay: WeatherOneCallDaily): string => {

        if (weatherDay.temp.min && weatherDay.temp.max) {
            return `${Math.round(weatherDay.temp.min)}°C - ${Math.round(weatherDay.temp.max)}°C`;
        }
        else if (weatherDay.temp) {
            return `${Math.round(weatherDay.temp.day)}°C`;
        }
        else {
            return "";
        }
    }

    // TODO: one method for now and forecast
    const getWeatherImage = (weatherDay: WeatherOneCallDaily) => {
        if (weatherDay.weather && weatherDay.weather.length > 0) {
            return (
                <img
                    src={`./weather_icons/${weatherDay.weather[0].icon}.png`}
                    width="130rem"
                    height="fit-content"
                    alt={weatherDay.weather[0].description}
                />
            );
        }
    }

    // TODO: one method for now and forecast
    const getWeatherDescription = (weatherDay: WeatherOneCallDaily): string => {
        if (weatherDay.weather && weatherDay.weather.length > 0) {
            const desc: string = weatherDay.weather[0].description;
            return desc.charAt(0).toUpperCase() + desc.slice(1);
        }
        else {
            return "";
        }
    }

    const renderWeatherForecastCard = (
        weatherDay: WeatherOneCallDaily,
        index: number,
        line: number,
    ) => {

        if (line === 0 && index >= 4) {
            return (<Box key={index} />);
        }

        if (line === 1 && (index < 4 || index >= 8)) {
            return (<Box key={index} />);
        }

        const colorCoefficient = index / 8;
        const isToday = moment().isSame(moment.unix(weatherDay.dt), "day");

        return (

            <Card
                key={index}
                style={{
                    margin: theme.spacing(2, 3),
                    backgroundColor: CARD_BACKGROUND_COLORMAP(colorCoefficient),
                    border: isToday ? "1px solid white" : "",
                }}
            >

                <CardContent style={{ height: "100%" }}>

                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        height={1}
                    >

                        <Typography variant="h6" textAlign="center">
                            {moment.unix(weatherDay.dt).format("ddd, MMM Do")}
                        </Typography>

                        <Box
                            marginY={1.7}
                            marginX={4}
                            flexGrow={1}
                            display="flex"
                            alignItems="center"
                        >
                            {getWeatherImage(weatherDay)}
                        </Box>

                        <Typography variant="h6">
                            {getDayTemperatures(weatherDay)}
                        </Typography>

                        <Typography marginTop={.5}>
                            {getWeatherDescription(weatherDay)}
                        </Typography>

                    </Box>

                </CardContent>

                <CardActions>

                </CardActions>

            </Card>
        );
    }

    if (
        !moduleSettings?.city?.name
        || !moduleSettings.city.lat
        || !moduleSettings.city.lon
        || !credentials?.openweathermap_app_id
    ) {
        return (<MissingInfo pageName={MODULE_NAMES[ContentModuleType.WEATHER_FORECAST]} />);
    }

    if (weatherDaily === undefined) {
        return (<Loading pageName="Weather forecast" />)
    }

    if (weatherDaily === null) {
        return (<ModuleError pageName="Weather forecast" />)
    }

    return (

        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={1}
            height={1}
        >
            <Box
                display="flex"
                flexDirection="column"
                maxHeight={.9}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    marginLeft={3}
                    marginBottom={2}
                >
                    <MyLocationIcon fontSize="large" />

                    <Typography variant="h4" marginLeft={2}>
                        {moduleSettings.city.name}
                    </Typography>
                </Box>

                <Box display="flex">
                    {weatherDaily.map((weatherDay, index) => {
                        return renderWeatherForecastCard(weatherDay, index, 0)
                    })}
                </Box>

                <Box display="flex">
                    {weatherDaily.map((weatherDay, index) => {
                        return renderWeatherForecastCard(weatherDay, index, 1)
                    })}
                </Box>

            </Box>
        </Box >
    );
}

export default WeatherForecast;