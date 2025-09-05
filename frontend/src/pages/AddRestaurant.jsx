import { useMemo } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Rating,
  Snackbar,
  Alert,
  InputAdornment,
  Box,
  Divider,
  Stack,
  Grid,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CUISINES } from "../../src/constants/cuisines";
import { PRICE } from "../../src/constants/price";



// Validation schema
const schema = z.object({
  name: z.string().min(2, "Please enter a name (min 2 chars).").max(120),
  cuisine: z.enum(CUISINES, {
    errorMap: () => ({ message: "Choose a cuisine." }),
  }),
  city: z.string().min(2, "Please enter a city.").max(80),
  price: z.enum(PRICE, {
    errorMap: () => ({ message: "Choose a price tier." }),
  }),
  rating: z
    .number({
      required_error: "Please give a rating",
      invalid_type_error: "Please give a rating",
    })
    .min(0, "Rating must be at least 0")
    .max(5, "Rating must be at most 5"),
  image_url: z.string().url("Must be a valid URL"),
  description: z.string().max(500, "Max 500 characters").optional(),
});

export default function AddRestaurant() {
  const base = import.meta.env.VITE_API_BASE_URL;
  const queryClient = useQueryClient();
  const [toast, setToast] = useState({ open: false, msg: "", sev: "success" });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      cuisine: undefined,
      image_url: "",
      city: "",
      rating: undefined,
      description: "",
      price: "$",
    },
  });

  const imageUrl = watch("image_url");
  const preview = useMemo(
    () => (imageUrl && imageUrl.trim() ? imageUrl.trim() : null),
    [imageUrl]
  );

  // Mutation: POST /restaurants
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${base}/restaurants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
      return res.json();
    },
    onSuccess: (created) => {
      queryClient.setQueryData(["restaurants"], (old = []) =>
        Array.isArray(old) ? [created, ...old] : [created]
      );
      setToast({ open: true, msg: "Restaurant added!", sev: "success" });
      reset();
    },
    onError: (e) => {
      setToast({
        open: true,
        msg: e.message || "Failed to add restaurant",
        sev: "error",
      });
    },
  });

  const isPending = createMutation.isPending;

  async function onSubmit(values) {
    const payload = {
      ...values,
      image_url: values.image_url?.trim() || undefined,
      description: values.description?.trim() || undefined,
    };
    // Triggers the POST; success/error handled in mutation callbacks
    await createMutation.mutateAsync(payload);
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Add Restaurant
      </Typography>

      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            {/*  Basic info */}
            <Typography variant="h6"  sx={{ color: "text.secondary" }}>
              Basic Information
            </Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                fullWidth
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">🍽️</InputAdornment>
                  ),
                }}
              />

              <TextField
                select
                label="Cuisine"
                fullWidth
                {...register("cuisine")}
                error={!!errors.cuisine}
                helperText={errors.cuisine?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RestaurantMenuIcon />
                    </InputAdornment>
                  ),
                }}
              >
                {CUISINES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    label="City"
                    {...register("city")}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    select
                    label="Price"
                    {...register("price")}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PriceChangeIcon />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {PRICE.map((p) => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Rating (0–5)
                  </Typography>
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <Rating
                        precision={0.1}
                        value={field.value ?? null} // null = empty
                        onChange={(_, v) => field.onChange(v)}
                      />
                    )}
                  />
                  {errors.rating && (
                    <Typography variant="caption" color="error">
                      {errors.rating.message}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/*  Media */}
            <Typography variant="h6"  sx={{ color: "text.secondary" }}>
              Media
            </Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Image URL"
                fullWidth
                placeholder="https://images.unsplash.com/photo-…"
                {...register("image_url")}
                error={!!errors.image_url}
                helperText={
                  errors.image_url?.message ||
                  "Use Unsplash free-licensed restaurant photos."
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Box
                sx={{
                  border: (theme) => `1px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  bgcolor: "background.default",
                  p: 1.5,
                }}
              >
                {preview ? (
                  <Box
                    component="img"
                    src={preview}
                    alt="Preview"
                    sx={{
                      width: "100%",
                      height: 240,
                      objectFit: "cover",
                      borderRadius: 1.5,
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 6 }}
                  >
                    Paste an image URL to preview it here.
                  </Typography>
                )}
              </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/*  Description */}
            <Typography variant="overline" sx={{ color: "text.secondary" }}>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={4}
              placeholder="Short summary (2–3 lines)…"
              sx={{ mt: 1 }}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            {/* Actions */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 3, justifyContent: "flex-end" }}
            >
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={() => reset()}
                sx={{ borderRadius: 999 }}
              >
                Clear
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="warning"
                disabled={!isValid || isPending}
                sx={{ borderRadius: 999, fontWeight: 700 }}
              >
                {isPending ? "Saving…" : "Add Restaurant"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.sev}
          variant="filled"
          onClose={() => setToast((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
