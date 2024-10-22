import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingProps {
    pageName: string;
    notFullPage?: boolean;
}

const Loading: React.FC<LoadingProps> = (props) => {

    const { pageName, notFullPage } = props;

    return (

        <Box
            display="flex"
            flexDirection={notFullPage ? "row" : "column"}
            justifyContent="center"
            alignItems="center"
            height={notFullPage ? "fit-content" : 1}
        >

            <Typography
                variant={notFullPage ? "h5" : "h2"}
                marginBottom={notFullPage ? 0 : 2}
            >
                {`"${pageName}" is loading`}
            </Typography>

            <CircularProgress />

        </Box>
    );
}

export default Loading;