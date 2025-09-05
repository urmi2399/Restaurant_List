import { useState, useId, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Rating,
  Box,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { ButtonGroup } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export default function RestaurantCard({
  id, // 👈 needed for navigation
  name = "Untitled",
  cuisine = "",
  city = "",
  image_url = "",
  rating = 0,
  description = "No description yet.",
  price = "$",
  onRequestEdit,
  onRequestDelete,
}) {
  const [flipped, setFlipped] = useState(false);
  const idHtml = useId();
  const navigate = useNavigate();

  const toggle = useCallback(() => setFlipped((v) => !v), []);
  const onKey = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle]
  );

  return (
    <div className="[perspective:1200px]">
      {/* inner that rotates */}
      <div
        className={`relative h-[460px] w-full transition-transform duration-500 ease-out
                    [transform-style:preserve-3d] ${
                      flipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
      >
        {/* FRONT */}
        <Card
          elevation={2}
          className="absolute inset-0 overflow-hidden !rounded-[15px] shadow-md hover:shadow-lg transition
                     [backface-visibility:hidden]"
        >
          <Box className="relative">
            <CardMedia
              component="img"
              image={
                image_url ||
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
              }
              alt={name}
              className="h-[200px] w-full object-cover"
              style={{ display: "block" }}
            />
            {/* darker gradient + match radius */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent rounded-t-[15px]" />
            <Typography
              variant="h6"
              className="absolute bottom-3 left-4 font-bold text-white drop-shadow"
              sx={{ fontSize: "2rem" }}
            >
              {name}
            </Typography>
          </Box>

          <CardContent className="flex h-[calc(100%-200px)] flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <Chip
                size="small"
                color="primary"
                icon={<RestaurantMenuIcon />}
                label={cuisine}
                sx={{ color: "primary.contrastText", fontSize: "17px" }}
                className="!p-3"
              />
              <div className="flex items-center gap-1">
                <Typography
                  variant="body2"
                  sx={{ color: "warning.main", fontSize: "20px" }}
                >
                  {price}
                </Typography>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <LocationOnIcon color="primary" />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "17px" }}
                >
                  {city}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <Rating
                  size="medium"
                  precision={0.5}
                  value={Number(rating) || 0}
                  readOnly
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "17px" }}
                >
                  {Number(rating || 0).toFixed(1)}
                </Typography>
              </div>
            </div>

            <div className="mt-auto">
              <Button
                variant="contained"
                color="warning"
                fullWidth
                onClick={toggle}
                onKeyDown={onKey}
                aria-expanded={flipped}
                aria-controls={`card-back-${idHtml}`}
                sx={{ borderRadius: "999px", fontWeight: 600 }}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* BACK */}
        <Card
          id={`card-back-${idHtml}`}
          elevation={2}
          className="absolute inset-0 overflow-hidden !rounded-[15px] p-0 shadow-md
                     [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <CardContent className="flex h-full flex-col gap-5 p-6">
            {/* Title */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  letterSpacing: 0.2,
                }}
              >
                {name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <Box>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      color="primary"
  onClick={() => onRequestEdit?.({ id, name, rating })}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRequestDelete?.({ id, name })}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {/* Meta */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 !mb-3">
                <Chip
                  size="small"
                  icon={<RestaurantMenuIcon fontSize="small" />}
                  label={cuisine}
                  color="primary"
                  sx={{
                    height: 28,
                    fontWeight: 600,
                    color: "primary.contrastText",
                    "& .MuiChip-icon": { color: "primary.contrastText" },
                    px: 1.25,
                  }}
                />
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  • City:
                  <Typography
                    component="span"
                    sx={{ color: "text.primary", ml: 0.5 }}
                  >
                    {city}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  • Price:
                  <Typography
                    component="span"
                    sx={{ color: "text.primary", ml: 0.5 }}
                  >
                    {price}
                  </Typography>
                </Typography>
              </div>

              {/* Divider */}
              <div
                className="rounded-full"
                style={{ height: 1, backgroundColor: "rgba(0,0,0,0.08)" }}
              />

              {/* Description */}
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
                className="line-clamp-6 !mt-5"
              >
                {String(description ?? "")}
              </Typography>
            </div>

            {/* Actions pinned bottom */}
            <div className="!mt-auto !mb-4 grid grid-cols-2 gap-3">
              <Button
                variant="outlined"
                color="primary"
                onClick={toggle}
                sx={{
                  borderRadius: 999,
                  borderColor: "primary.light",
                  color: "primary.main",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
              >
                Back
              </Button>

              <Button
                variant="contained"
                color="warning"
                onClick={() => navigate(`/restaurants/${id}`)}
                sx={{
                  borderRadius: 999,
                  fontWeight: 600,
                  boxShadow: 2,
                  "&:hover": { boxShadow: 3 },
                }}
              >
                More Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* <RestaurantCard
  id={restaurant.id}
  name={restaurant.name}
  cuisine={restaurant.cuisine}
  city={restaurant.city}
  image_url={restaurant.image_url}
  rating={restaurant.rating}
  description={restaurant.description}
  price={restaurant.price}
/> */
