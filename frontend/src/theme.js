// frontend/src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8B9D83", // deep sage green
      contrastText: "#F5F1EB", // cream
    },
    secondary: {
      main: "#F5F1EB", // warm cream
      contrastText: "#2C2C2C", // charcoal
    },
    warning: {
      main: "#D4A574", // muted gold
    },
    text: {
      primary: "#2C2C2C", // charcoal
      secondary: "#8B9D83", // sage
    },
    background: {
      default: "#F5F1EB", // cream background
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default theme;
