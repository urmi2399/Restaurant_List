import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  MenuItem,
  InputAdornment,
  Stack,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CUISINES } from "../../src/constants/cuisines";
import { PRICE } from "../../src/constants/price";


const schema = z.object({
  name: z.string().min(2).max(120),
  cuisine: z.string().min(1),
  city: z.string().min(2).max(80),
  price: z.enum(PRICE),
  rating: z.number().min(0).max(5),
  image_url: z.string().url().optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),
});

export default function EditRestaurant({
  open,
  onClose,
  initial,
  onSaved,    
  baseUrl,
}) {
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      cuisine: "",
      city: "",
      price: "$",
      rating: 0,
      image_url: "",
      description: "",
    },
  });

  // Pre-fill the form when dialog opens
  useEffect(() => {
    if (open && initial) {
      reset({
        name: initial.name ?? "",
        cuisine: initial.cuisine ?? "",
        city: initial.city ?? "",
        price: initial.price ?? "$",
        rating: Number(initial.rating ?? 0),
        image_url: initial.image_url ?? "",
        description: initial.description ?? "",
      });
    }
  }, [open, initial, reset]);

  const queryClient = useQueryClient();

  // --- Mutation: PATCH /restaurants/:id
  const patchMutation = useMutation({
    mutationFn: async ({ id, diff }) => {
      const res = await fetch(`${baseUrl}/restaurants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(diff),
      });

      if (res.status === 204) {
        return { id, ...diff };
      }
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          msg = j?.detail ? JSON.stringify(j.detail) : msg;
        } catch {
          msg = (await res.text()) || msg;
        }
        throw new Error(msg);
      }
      return res.json();
    },
    onSuccess: (updated) => {
      // Update list cache: ["restaurants"]
      queryClient.setQueryData(["restaurants"], (old = []) =>
        Array.isArray(old)
          ? old.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
          : old
      );

      // Update detail cache: ["restaurant", id] (if you use this key elsewhere)
      queryClient.setQueryData(["restaurant", updated.id], (old) =>
        old ? { ...old, ...updated } : updated
      );

      // Keep parent compatibility if it expects onSaved
      onSaved?.(updated);

      // Close dialog
      onClose?.();
    },
    onError: (e) => {
      console.error("Update failed", e);
      alert(`Failed to save changes: ${e.message || e}`);
    },
  });

  async function onSubmit(values) {
    if (!initial) return;

    const norm = {
      ...values,
      rating:
        typeof values.rating === "number"
          ? values.rating
          : Number(values.rating || 0),
      name: values.name?.trim() ?? "",
      cuisine: values.cuisine?.trim() ?? "",
      city: values.city?.trim() ?? "",
      price: values.price,
      image_url: values.image_url?.trim?.() || null,
      description: values.description?.trim?.() || null,
    };

    const baseInitial = {
      ...initial,
      rating: Number(initial.rating || 0),
      image_url: initial.image_url || null,
      description: initial.description || null,
    };

    const diff = {};
    for (const k of Object.keys(norm)) if (norm[k] !== baseInitial[k]) diff[k] = norm[k];

    if (Object.keys(diff).length === 0) {
      onClose?.();
      return;
    }

    patchMutation.mutate({ id: initial.id, diff });
  }

  const img = watch("image_url");
  const liveName = watch("name");
  const liveCuisine = watch("cuisine");
  const liveCity = watch("city");
  const livePrice = watch("price");
  const liveRating = Number(watch("rating") || 0);

  const isBusy = isSubmitting || patchMutation.isPending;

  return (
    <Dialog
      open={open}
      onClose={isBusy ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Edit Restaurant</DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        <Stack spacing={2.5}>
          {/* Basic info */}
          <Typography variant="overline" color="text.secondary">
            Basic information
          </Typography>

          <TextField
            label="Name"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <Controller
            name="cuisine"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Cuisine"
                fullWidth
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
            )}
          />

          <TextField
            label="City"
            fullWidth
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

          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Price"
                fullWidth
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
            )}
          />

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
                  value={Number(field.value) || 0}
                  onChange={(_, v) => field.onChange(v ?? 0)}
                />
              )}
            />
            {errors.rating && (
              <Typography variant="caption" color="error">
                {errors.rating.message}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* SECTION: Media */}
          <Typography variant="overline" color="text.secondary">
            Media
          </Typography>

          <TextField
            label="Image URL"
            fullWidth
            {...register("image_url")}
            error={!!errors.image_url}
            helperText={
              errors.image_url?.message || "Use Unsplash free-licensed photos."
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={4}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          {/* Live Preview */}
          <Box
            sx={{
              mt: 1,
              border: (t) => `1px solid ${t.palette.divider}`,
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            {img ? (
              <Box
                component="img"
                src={img}
                alt="Preview"
                onError={(e) => (e.currentTarget.style.display = "none")}
                sx={{ width: "100%", height: 200, objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.6,
                }}
              >
                <Typography variant="body2">Image preview</Typography>
              </Box>
            )}

            <Box sx={{ p: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {liveName || "Restaurant"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {liveCuisine || "Cuisine"} • {liveCity || "City"} •{" "}
                {livePrice || "$"}
              </Typography>
              <Box
                sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Rating size="small" readOnly precision={0.1} value={liveRating} />
                <Typography variant="caption" color="text.secondary">
                  {liveRating.toFixed(1)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isBusy}>
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={isBusy}
          variant="contained"
          color="warning"
        >
          {isBusy ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
