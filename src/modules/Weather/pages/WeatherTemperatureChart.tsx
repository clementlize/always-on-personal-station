import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { getWeatherBaseUrl, getWeatherUrlParams } from "../helpers/WeatherHelper";
import { OpenWeatherMapOneCallResponse, WeatherOneCallHourly, WeatherOneCallPart } from "../model/OWMOneCallModels";
import { City } from "../model/WeatherExtendedSettings";
import { WeatherTemperatureChartPoint } from "../model/WeatherTemperatureChartModel";

interface WeatherTemperatureChartProps {
    city: City;
    appId: string;
}

// TODO: add rain to this chart
const WeatherTemperatureChart: React.FC<WeatherTemperatureChartProps> = (props) => {

    const { city, appId } = props;

    const theme = useTheme();

    const [dataPoints, setDataPoints] = useState<WeatherTemperatureChartPoint[]>();
    const [minTemp, setMinTemp] = useState<number>();
    const [maxTemp, setMaxTemp] = useState<number>();

    /**
         * Usage: show the temperature for the next 24hrs
         * Refresh interval: 1 hour
         */
    const [weatherHourly, setWeatherHourly] = useState<WeatherOneCallHourly[] | null | undefined>(undefined);

    const fetchWeatherHourly = () => {

        const params = getWeatherUrlParams(city, appId);
        params.append("exclude", `${WeatherOneCallPart.CURRENT},`
            + `${WeatherOneCallPart.MINUTELY},`
            + `${WeatherOneCallPart.DAILY},`
            + WeatherOneCallPart.ALERTS
        );
        const apiURL = `${getWeatherBaseUrl()}/3.0/onecall?${params.toString()}`

        axios.get(apiURL)
            .then((response) => {
                const weatherResponse = response.data as OpenWeatherMapOneCallResponse;
                if (weatherResponse.hourly) {
                    setWeatherHourly(weatherResponse.hourly);
                }
            })
            .catch((error) => {
                console.log(error.response.status);
                if (error.response.status === 401) {
                    setWeatherHourly(null);  // Maybe missing the oneCall API subscription plan?
                }
            });;
    }

    /**
    * Refresh the data
    */
    useEffect(() => {

        // First, fetch all the data
        fetchWeatherHourly();

        // Set the intervals
        const intervalHourly = setInterval(() => { fetchWeatherHourly() }, 1000 * 60 * 60 * 1);  // 1 hour

        return () => { clearInterval(intervalHourly) }
    }, []);

    /**
     * Set the points to display on the graph, and the min & max temperatures
     */
    useEffect(() => {

        if (!weatherHourly) {
            return;
        }

        const dataPoints: WeatherTemperatureChartPoint[] = [];
        let min: number = Infinity;
        let max: number = -Infinity;

        weatherHourly.forEach((weatherHour, index) => {

            if (index > 23) {
                return;
            }

            const temperatureRounded = Math.round(weatherHour.feels_like ?? weatherHour.temp)

            if (temperatureRounded < min) {
                min = temperatureRounded;
            }
            if (temperatureRounded > max) {
                max = temperatureRounded;
            }

            dataPoints.push({
                time: `${moment.unix(weatherHour.dt).format("HH")}h`,
                temperature: temperatureRounded,
            });
        });

        setDataPoints(dataPoints);

        if (min !== -Infinity && max !== Infinity) {
            setMinTemp(min);
            setMaxTemp(max);
        }

    }, [weatherHourly]);

    if (weatherHourly !== null && (!dataPoints || _.isNil(minTemp) || _.isNil(maxTemp))) {
        // TODO: ghost loading
        console.log("Loading temperature chart");
        return (<Box />);
    }

    return (

        <Box width={1} marginBottom={4}>

            {weatherHourly

                ? <ResponsiveContainer width="100%" aspect={7.0 / 1.0}>

                    <LineChart
                        data={dataPoints}
                    >
                        <XAxis
                            dataKey="time"
                            domain={['auto', 'auto']}
                            tickMargin={10}
                            tick={{
                                stroke: theme.palette.text.primary,
                                strokeWidth: .3,
                            }}
                        />

                        <YAxis
                            width={50}
                            type="number"
                            domain={[minTemp!, maxTemp!]}
                            yAxisId="left"
                            tickCount={10}
                            interval="preserveStartEnd"
                            allowDecimals={false}
                            unit="°C"
                            tick={{
                                stroke: theme.palette.text.primary,
                                strokeWidth: .3,
                            }}
                            tickMargin={8}
                        />

                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="temperature"
                            stroke={theme.palette.secondary.main}
                            strokeWidth={2}
                            dot={false}
                        />

                        <CartesianGrid stroke="#4d4d4d" strokeDasharray="5 5" />

                    </LineChart>

                </ResponsiveContainer>

                : <Typography variant="caption">
                    You might need to subscribe to the oneCall API 3.0 to display this. <a href="https://openweathermap.org/api/one-call-3" target="_blank">Learn more.</a>
                </Typography>
            }
        </Box>
    );
}

export default WeatherTemperatureChart;