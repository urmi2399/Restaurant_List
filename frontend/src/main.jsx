import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import theme from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#8B9D83", // sage green
//       contrastText: "#F5F1EB", // cream text
//     },
//     secondary: {
//       main: "#F5F1EB", // cream
//       contrastText: "#2C2C2C", // charcoal text
//     },
//     text: {
//       primary: "#2C2C2C", // charcoal
//       secondary: "#8B9D83", // sage
//     },
//     background: {
//       default: "#F5F1EB", // cream page background
//       paper: "#FFFFFF",
//     },
//     warning: {
//       main: "#D4A574", // gold accent
//     },
//   },
//   typography: {
//     fontFamily: "Inter, sans-serif",
//   },
// })

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
