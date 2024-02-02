import { Box, Link, Typography } from "@mui/material";

interface SettingsHelpProps { }

const SettingsHelp: React.FC<SettingsHelpProps> = () => {

    return (

        <Box
            display="flex"
            flexDirection="column"
        >

            <Typography variant="h5" sx={{ marginY: 2 }}>
                Common problems
            </Typography>

            <Box>
                <Typography variant="h6">
                    Safari (iPad): cannot turn on fullscreen mode
                </Typography>
                <Typography>
                    Follow the steps of the first answer to &nbsp;
                    <Link href="https://apple.stackexchange.com/questions/364775/ipad-1st-generation-using-as-full-screen-browser-kiosk-mode">
                        this question
                    </Link>
                    . The meta tag is already added.
                </Typography>
            </Box>
        </Box>
    );
}

export default SettingsHelp;