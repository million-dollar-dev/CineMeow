import { createTheme } from "@mui/material";

const theme = {
    typography: {
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    palette: {
        primary: {
            main: "#6366F1",
            light: "#818CF8",
            dark: "#4F46E5",
        },
        secondary: {
            main: "#7F5AF0",
        },
        background: {
            default: "#F8FAFC",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#0F172A",
            secondary: "#64748B",
        },
    },
    shape: {
        borderRadius: 12,
    },
};

export default createTheme(theme);