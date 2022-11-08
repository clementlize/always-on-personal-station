import { Box, Typography } from "@mui/material";

interface MissingInfoProps {
    pageName: string;
}

const MissingInfo: React.FC<MissingInfoProps> = (props) => {

    const { pageName } = props;

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={1}
            height={1}
        >

            <Box
                maxWidth="70%"
            >

                <Typography variant="h6">
                    {`Missing information to display the page "${pageName}". Please go to the settings page and fill in the missing information.`}
                </Typography>

            </Box>
        </Box>
    );
}

export default MissingInfo;