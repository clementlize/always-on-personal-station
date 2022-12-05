import { Box, Link, Typography } from "@mui/material";

interface SettingsAboutProps { }

const SettingsAbout: React.FC<SettingsAboutProps> = () => {

    return (

        <Box
            display="flex"
            flexDirection="column"
        >

            <Typography variant="h5" sx={{ marginY: 2 }}>
                Always-on personal station (AoPS)
            </Typography>

            <Typography sx={{ marginBottom: 1 }}>
                Made by <Link href="https://clementlize.com" target="_blank">Clément Lizé</Link>
            </Typography>

            <Link href="https://github.com/clementlize/always-on-personal-station" target="_blank">
                <Typography>
                    See project on Github.
                </Typography>
            </Link>

            <Typography sx={{ marginTop: 2 }}>
                Version 1.0.1
            </Typography>
        </Box>
    );
}

export default SettingsAbout;