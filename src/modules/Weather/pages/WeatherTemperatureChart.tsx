import { Box } from "@mui/material";
import { useTheme } from "@mui/system";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { City } from "../../Modules";
import { getWeatherBaseUrl } from "../helpers/WeatherHelper";
import { OpenWeatherMapOneCallResponse, WeatherHourly, WeatherOneCallPart } from "../model/OpenWeatherMapModel";
import { WeatherTemperatureChartPoint } from "../model/WeatherTemperatureChartModel";

interface WeatherTemperatureChartProps {
    city: City;
}

const WeatherTemperatureChart: React.FC<WeatherTemperatureChartProps> = (props) => {

    const { city } = props;

    const theme = useTheme();

    const [dataPoints, setDataPoints] = React.useState<WeatherTemperatureChartPoint[]>();
    const [minTemp, setMinTemp] = React.useState<number>();
    const [maxTemp, setMaxTemp] = React.useState<number>();

    /**
         * Usage: show the temperature for the next 24hrs
         * Refresh interval: 1 hour
         */
    const [weatherHourly, setWeatherHourly] = useState<WeatherHourly[]>();

    const fetchWeatherHourly = () => {

        const apiURL = `${getWeatherBaseUrl(city)}&exclude=`
            + `${WeatherOneCallPart.CURRENT},`
            + `${WeatherOneCallPart.DAILY},`
            + `${WeatherOneCallPart.MINUTELY},`
            + WeatherOneCallPart.ALERTS;

        axios.get(apiURL)
            .then((response) => {

                const weatherResponse = response.data as OpenWeatherMapOneCallResponse;

                if (weatherResponse.hourly) {

                    setWeatherHourly(weatherResponse.hourly);
                }
            });
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

    if (!dataPoints || !minTemp || !maxTemp) {

        // TODO: ghost loading
        return (<Box />);
    }

    return (

        <Box width={1} marginBottom={4}>

            <ResponsiveContainer width="100%" aspect={7.0 / 1.0}>

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
                        domain={[minTemp, maxTemp]}
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

        </Box>
    );
}

export default WeatherTemperatureChart;