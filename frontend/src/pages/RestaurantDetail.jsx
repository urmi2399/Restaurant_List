import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function RestaurantDetail({id: propId }) {
   const { id: routeId } = useParams();
  const id = propId ?? routeId;

  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/restaurants/${id}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setRestaurant)
      .catch((err) => {
        console.error("Error fetching restaurant:", err);
        navigate("/"); // fallback if not found
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <Container maxWidth="lg" className="flex justify-center items-center py-20">
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container maxWidth="lg" className="py-12 text-center">
        <Typography variant="h5" className="mb-4">
          Restaurant not found
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        className="mb-6"
        color="primary"
      >
        Back to Restaurants
      </Button>

      <Card className="overflow-hidden shadow-xl rounded-3xl">
        <CardMedia
          component="img"
          height="400"
          image={
            restaurant.image_url ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200"
          }
          alt={restaurant.name}
          className="h-96 object-cover"
        />

        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="flex-1">
              <Typography variant="h3" className="font-bold mb-4" color="primary">
                {restaurant.name}
              </Typography>

              <div className="flex flex-wrap gap-4 mb-6">
                <Chip icon={<RestaurantMenuIcon />} label={restaurant.cuisine} color="primary" size="medium" />
                <Chip icon={<LocationOnIcon />} label={restaurant.city} variant="outlined" size="medium" />
                <Chip icon={<AttachMoneyIcon />} label={restaurant.price || "$"} color="secondary" size="medium" />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Rating
                  value={Number(restaurant.rating) || 0}
                  precision={0.1}
                  readOnly
                  size="large"
                />
                <Typography variant="h6" color="text.secondary">
                  {Number(restaurant.rating || 0).toFixed(1)} / 5.0
                </Typography>
              </div>
            </div>
          </div>

          <Typography variant="h5" className="font-semibold mb-4" color="primary">
            About This Restaurant
          </Typography>

          <Typography variant="body1" className="text-lg leading-relaxed mb-8">
            {restaurant.description || "No description available for this restaurant yet."}
          </Typography>

          <Box className="flex flex-col sm:flex-row gap-4">
            <Button variant="contained" color="secondary" size="large" className="flex-1 py-3">
              View Menu & Order
            </Button>
            <Button variant="outlined" color="primary" size="large" className="flex-1 py-3">
              Make Reservation
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
