import { Box, Card, CardActions, CardContent, Typography, useTheme } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { CARD_BACKGROUND_COLORMAP } from "../../../style/AppStyle";
import Loading from "../../Loading/Loading";
import { City } from "../../Modules";
import { getWeatherBaseUrl } from "../helpers/WeatherHelper";
import { OpenWeatherMapOneCallResponse, WeatherDaily, WeatherOneCallPart } from "../model/OpenWeatherMapModel";

interface WeatherForecastProps {
    city: City;
}

const WeatherForecast: React.FC<WeatherForecastProps> = (props) => {

    const { city } = props;

    const theme = useTheme();

    /**
     * Usage: show the forecast for the next 8 days
     * Refresh interval: 3 hours
     */
    const [weatherDaily, setWeatherDaily] = useState<WeatherDaily[]>();

    const fetchWeatherDaily = () => {

        const apiURL = `${getWeatherBaseUrl(city)}&exclude=`
            + `${WeatherOneCallPart.CURRENT},`
            + `${WeatherOneCallPart.MINUTELY},`
            + `${WeatherOneCallPart.HOURLY},`
            + WeatherOneCallPart.ALERTS;

        axios.get(apiURL)
            .then((response) => {

                const weatherResponse = response.data as OpenWeatherMapOneCallResponse;

                if (weatherResponse.daily) {

                    setWeatherDaily(weatherResponse.daily);
                }
            });
    }

    /**
     * Refresh the data
     */
    useEffect(() => {

        // First, fetch all the data
        fetchWeatherDaily();

        // Set the intervals
        const intervalDaily = setInterval(() => fetchWeatherDaily(), 1000 * 60 * 60 * 3);  // 3 hours

        return () => { clearInterval(intervalDaily) }
    }, []);

    const getDayTemperatures = (weatherDay: WeatherDaily): string => {

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
    const getWeatherImage = (weatherDay: WeatherDaily) => {

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
    const getWeatherDescription = (weatherDay: WeatherDaily): string => {

        if (weatherDay.weather && weatherDay.weather.length > 0) {

            const desc: string = weatherDay.weather[0].description;

            return desc.charAt(0).toUpperCase() + desc.slice(1);
        }
        else {

            return "";
        }
    }

    const renderWeatherForecastCard = (
        weatherDay: WeatherDaily,
        index: number,
        line: number,
    ) => {

        if (line === 0 && index >= 4) {

            return (<Box />);
        }

        if (line === 1 && (index < 4 || index >= 8)) {

            return (<Box />);
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

    if (!weatherDaily) {

        return (<Loading pageName="Weather forecast" />)
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

                <Box display="flex">
                    {weatherDaily.map((weatherDaily, index) => {

                        return renderWeatherForecastCard(weatherDaily, index, 0)
                    })}
                </Box>

                <Box display="flex">
                    {weatherDaily.map((weatherDaily, index) => {

                        return renderWeatherForecastCard(weatherDaily, index, 1)
                    })}
                </Box>

            </Box>
        </Box >
    );
}

export default WeatherForecast;