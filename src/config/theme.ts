import { createTheme } from "@mui/material";

export const defaultTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#000000",
            paper: "#2E3840"
        },
        primary: {
            main: "#ffffff",
        },
    },
    typography: {
        h4: {
            fontSize: "1.9rem"
        }
    }
});