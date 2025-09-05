import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/Navbar";
import RestaurantsGrid from "./components/RestaurantGrid";
import AddRestaurant from "./pages/AddRestaurant";
import RestaurantDetail from "./pages/RestaurantDetail";
import Footer from "./components/Footer";
import theme from "./theme.js"; 

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-[#F5F1EB] px-2 pb-2 pt-2">
          <Routes>
            <Route path="/" element={<RestaurantsGrid />} />
            <Route path="/add" element={<AddRestaurant />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
           
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
