import { Box, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import Clock from "react-clock";
import 'react-clock/dist/Clock.css';
import './ClockAndTime.css';

interface ClockAndTimeProps { }

const ClockAndTime: React.FC<ClockAndTimeProps> = (props) => {

    // The current time
    const [time, setTime] = useState<Date>(new Date());

    /**
     * Set time and refresh every second
     */
    useEffect(() => {

        const interval = setInterval(() => setTime(new Date()), 1000);

        return () => clearInterval(interval);

    }, []);

    const digitalClock = () => {

        const timeMoment = moment(time);

        return (

            <Box
                display="flex"
                flexDirection="column"
                marginTop={-2}
            >

                <Typography
                    fontSize={200}
                    fontFamily="Oswald"
                >
                    {timeMoment.format("HH:mm")}
                </Typography>

                <Typography
                    fontSize={120}
                    fontFamily="Oswald"
                    marginLeft={4}
                    marginTop={-10}
                >
                    {":" + timeMoment.format("ss")}
                </Typography>

            </Box >
        );
    }

    return (

        <Box
            display="flex"
            height={1}
            alignItems="center"
            justifyContent="center"
        >

            <Clock
                value={time}
                size={450}
            />

            <Box
                marginLeft={10}
                display="flex"
                flexDirection="column"
            >

                <Typography variant="h4">
                    {moment(time).format("dddd, MMMM Do YYYY")}
                </Typography>

                {digitalClock()}
            </Box>

        </Box>

    );
}

export default ClockAndTime;