import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
  },
});

export default theme;