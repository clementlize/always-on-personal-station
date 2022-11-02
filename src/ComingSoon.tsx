import { Box, CssBaseline, Link, ThemeProvider, Typography } from "@mui/material";
import { defaultTheme } from "./config/theme";

const ComingSoon: React.FC = () => {

    return (

        <ThemeProvider theme={defaultTheme}>

            <CssBaseline />

            <Box
                width="100vw"
                height="100vh"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap={2}
            >

                <Typography variant="h2">
                    Coming soon
                </Typography>

                <Link href="https://github.com/clementlize/always-on-personal-station">
                    <Typography variant="h4">
                        See project on Github.
                    </Typography>
                </Link>
            </Box>

        </ThemeProvider>
    );
}

export default ComingSoon;