import { Box, Typography } from "@mui/material";
import React from "react";

interface ErrorProps {
    pageName: string;
}

const ModuleError: React.FC<ErrorProps> = (props) => {

    const { pageName } = props;

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={1}
        >
            <Typography
                variant="h2"
            >
                Oh crap!
            </Typography>

            <Typography
                marginTop={2}
            >
                {`Could not load "${pageName}".`}
            </Typography>

            <Typography>
                Have you checked the module settings and the credentials?
            </Typography>

            <Typography
                marginTop={2}
                variant="caption"
            >
                Developer? Check the console for more details on the error.
            </Typography>
        </Box>
    );
}

export default ModuleError;