// // src/components/RestaurantsGrid.jsx
// import { useEffect, useMemo, useState, useCallback } from "react";
// import { Link as RouterLink } from "react-router-dom";
// import RestaurantCard from "./RestaurantCard";
// import EditRestaurant from "./EditRestaurant";
// import SearchIcon from "@mui/icons-material/Search";
// import RestaurantIcon from "@mui/icons-material/Restaurant";

// import {
//   Container,
//   Typography,
//   Box,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   CircularProgress,
//   InputAdornment,
//   Snackbar,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Pagination,
//   Stack,
// } from "@mui/material";



// export default function RestaurantGrid() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editState, setEditState] = useState({ open: false, item: null });

//   // search/filter UI
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCuisine, setSelectedCuisine] = useState("");

//   // Pagination state
//   const [page, setPage] = useState(1);
//   const [itemsPerPage] = useState(9); // 3x3 grid looks good

//   // delete-confirm UI
//   const [confirm, setConfirm] = useState({
//     open: false,
//     id: null,
//     name: "",
//     busy: false,
//   });

//   // toast
//   const [toast, setToast] = useState({
//     open: false,
//     sev: "success",
//     msg: "",
//   });

//   const base = import.meta.env.VITE_API_BASE_URL;
//   const onRequestEdit = useCallback(
//     (payload) => {
//       // payload can be { id, name, rating } or the full item; we'll find the item
//       const item = restaurants.find((r) => r.id === payload.id) ?? payload;
//       setEditState({ open: true, item });
//     },
//     [restaurants]
//   );

//   // when dialog saves, update local list
//   function onEditSaved(updated) {
//     setRestaurants((list) =>
//       list.map((r) => (r.id === updated.id ? updated : r))
//     );
//     setToast({ open: true, sev: "success", msg: "Restaurant updated." });
//   }

//   // fetch list
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(`${base}/restaurants`);
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await res.json();
//         setRestaurants(Array.isArray(data) ? data : []);
//       } catch (e) {
//         console.error("Error fetching restaurants:", e);
//         setToast({
//           open: true,
//           sev: "error",
//           msg: "Failed to load restaurants.",
//         });
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [base]);

//   // cuisines for the filter dropdown
//   const uniqueCuisines = useMemo(
//     () => [...new Set(restaurants.map((r) => r.cuisine))].filter(Boolean),
//     [restaurants]
//   );

//   // filtered list
//   const filteredRestaurants = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();
//     return restaurants.filter((r) => {
//       const matchesSearch =
//         !q ||
//         r.name?.toLowerCase().includes(q) ||
//         r.city?.toLowerCase().includes(q) ||
//         r.cuisine?.toLowerCase().includes(q);

//       const matchesCuisine = !selectedCuisine || r.cuisine === selectedCuisine;
//       return matchesSearch && matchesCuisine;
//     });
//   }, [restaurants, searchTerm, selectedCuisine]);

//   // Paginated restaurants
//   const paginatedRestaurants = useMemo(() => {
//     const startIndex = (page - 1) * itemsPerPage;
//     return filteredRestaurants.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredRestaurants, page, itemsPerPage]);

//   // Total pages
//   const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

//   // Reset to page 1 when search/filter changes
//   useEffect(() => {
//     setPage(1);
//   }, [searchTerm, selectedCuisine]);

//   // Handle page change
//   const handlePageChange = (event, value) => {
//     setPage(value);
//     // Optional: smooth scroll to top of results
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // open confirm dialog from a card
//   const onRequestDelete = useCallback(({ id, name }) => {
//     setConfirm({ open: true, id, name, busy: false });
//   }, []);

//   // do the delete (FastAPI: DELETE /restaurants/:id)
//   const confirmDelete = useCallback(async () => {
//     setConfirm((c) => ({ ...c, busy: true }));
//     try {
//       const res = await fetch(`${base}/restaurants/${confirm.id}`, {
//         method: "DELETE",
//       });
//       if (!(res.status === 204 || res.ok)) {
//         throw new Error(`HTTP ${res.status}`);
//       }
//       // remove from UI list
//       setRestaurants((list) => list.filter((r) => r.id !== confirm.id));
//       setToast({ open: true, sev: "success", msg: "Restaurant deleted." });
//       setConfirm({ open: false, id: null, name: "", busy: false });
//     } catch (e) {
//       setToast({
//         open: true,
//         sev: "error",
//         msg: "Failed to delete restaurant.",
//       });
//       setConfirm((c) => ({ ...c, busy: false }));
//     }
//   }, [base, confirm.id]);

//   if (loading) {
//     return (
//       <Container
//         maxWidth="xl"
//         className="flex justify-center items-center py-20"
//       >
//         <Box className="text-center">
//           <CircularProgress size={60} className="mb-4" />
//           <Typography variant="h6" color="text.secondary">
//             Loading delicious restaurants...
//           </Typography>
//         </Box>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="xl" className="px-4 py-8">
//       {/* Hero */}
//       <Box className="text-center mb-12 py-8">
//         <Typography
//           variant="h1"
//           className="text-3xl lg:text-4xl font-bold mb-4"
//           color="primary"
//         >
//           Discover Amazing Restaurants
//         </Typography>
//       </Box>

//       {/* Search + Filter */}
//       <Box className="mb-8 pb-2 flex flex-col sm:flex-row gap-4">
//         {/* Search ~60% */}
//         <TextField
//           placeholder="Search restaurants, cities, or cuisines..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-[3]"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />

//         {/* Filter ~40% */}
//         <FormControl className="flex-[2]">
//           <InputLabel>Filter by Cuisine</InputLabel>
//           <Select
//             value={selectedCuisine}
//             label="Filter by Cuisine"
//             onChange={(e) => setSelectedCuisine(e.target.value)}
//           >
//             <MenuItem value="">All Cuisines</MenuItem>
//             {uniqueCuisines.map((cuisine) => (
//               <MenuItem key={cuisine} value={cuisine}>
//                 {cuisine}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Count and Pagination Info */}
//       {(searchTerm || selectedCuisine) && (
//         <Typography variant="body1" className="mb-4" color="text.secondary">
//           Found {filteredRestaurants.length} restaurant
//           {filteredRestaurants.length !== 1 ? "s" : ""}
//           {searchTerm && ` matching "${searchTerm}"`}
//           {selectedCuisine && ` in ${selectedCuisine} cuisine`}
//           {totalPages > 1 && ` (Page ${page} of ${totalPages})`}
//         </Typography>
//       )}

//       {/* Grid */}
//       {filteredRestaurants.length === 0 ? (
//         <Box className="text-center py-16">
//           <RestaurantIcon className="text-6xl mb-4 opacity-50" />
//           <Typography variant="h5" className="font-semibold mb-4">
//             {searchTerm || selectedCuisine
//               ? "No restaurants found"
//               : "No restaurants available"}
//           </Typography>
//           <Typography variant="body1" className="mb-6" color="text.secondary">
//             {searchTerm || selectedCuisine
//               ? "Try adjusting your search or filter criteria."
//               : "Be the first to add a restaurant to our directory!"}
//           </Typography>
//           <Button
//             component={RouterLink}
//             to="/add"
//             variant="contained"
//             color="secondary"
//             size="large"
//             className="px-8 py-3"
//           >
//             Add Restaurant
//           </Button>
//         </Box>
//       ) : (
//         <>
//           {/* Restaurant Grid */}
//           <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             {paginatedRestaurants.map((restaurant) => (
//               <RestaurantCard
//                 key={restaurant.id ?? restaurant.name}
//                 {...restaurant}
//                 onRequestDelete={onRequestDelete}
//                 onRequestEdit={({ id, name, rating }) => onRequestEdit({ id, name, rating })}
//               />
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <Stack spacing={2} alignItems="center" className="!mt-5">
//               <Pagination
//                 count={totalPages}
//                 page={page}
//                 onChange={handlePageChange}
//                 color="primary"
//                 size="large"
//                 showFirstButton
//                 showLastButton
//                 sx={{
//                   '& .MuiPaginationItem-root': {
//                     fontSize: '1rem',
//                     minWidth: 40,
//                     height: 40,
//                   },
//                 }}
//               />
//               <Typography variant="body2" color="text.secondary">
//                 Showing {((page - 1) * itemsPerPage) + 1} to{' '}
//                 {Math.min(page * itemsPerPage, filteredRestaurants.length)} of{' '}
//                 {filteredRestaurants.length} restaurants
//               </Typography>
//             </Stack>
//           )}
//         </>
//       )}

//       {/* Confirm Delete Dialog */}
//       <Dialog
//         open={confirm.open}
//         onClose={
//           confirm.busy
//             ? undefined
//             : () => setConfirm({ open: false, id: null, name: "", busy: false })
//         }
//         maxWidth="xs"
//         fullWidth
//       >
//         <DialogTitle color="error.main">Delete Restaurant</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to permanently delete{" "}
//             <strong>{confirm.name || "this restaurant"}</strong>? This action
//             cannot be undone.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() =>
//               setConfirm({ open: false, id: null, name: "", busy: false })
//             }
//             disabled={confirm.busy}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={confirmDelete}
//             color="error"
//             variant="contained"
//             disabled={confirm.busy}
//             sx={{ fontWeight: 700 }}
//           >
//             {confirm.busy ? "Deleting…" : "Delete"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <EditRestaurant
//         open={editState.open}
//         initial={editState.item}
//         baseUrl={import.meta.env.VITE_API_BASE_URL}
//         onClose={() => setEditState({ open: false, item: null })}
//         onSaved={onEditSaved}
//       />

//       {/* Snackbar */}
//       <Snackbar
//         open={toast.open}
//         autoHideDuration={3000}
//         onClose={() => setToast((t) => ({ ...t, open: false }))}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setToast((t) => ({ ...t, open: false }))}
//           severity={toast.sev}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {toast.msg}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// }

// src/components/RestaurantsGrid.jsx
import { useMemo, useState, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";
import EditRestaurant from "./EditRestaurant";
import SearchIcon from "@mui/icons-material/Search";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  InputAdornment,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Stack,
} from "@mui/material";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function RestaurantGrid() {
  const base = import.meta.env.VITE_API_BASE_URL;
  const queryClient = useQueryClient();

  // --- Search, filter, pagination ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(9); // 3x3 grid looks good

  // --- Edit state ---
  const [editState, setEditState] = useState({ open: false, item: null });

  // --- Delete confirm ---
  const [confirm, setConfirm] = useState({
    open: false,
    id: null,
    name: "",
    busy: false,
  });

  // --- Toasts ---
  const [toast, setToast] = useState({
    open: false,
    sev: "success",
    msg: "",
  });

  // --- Fetch restaurants ---
  const {
    data: restaurants = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await fetch(`${base}/restaurants`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
  });

  // --- Mutations ---
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${base}/restaurants/${id}`, { method: "DELETE" });
      if (!(res.status === 204 || res.ok)) throw new Error(`HTTP ${res.status}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(["restaurants"], (old = []) =>
        old.filter((r) => r.id !== id)
      );
      setToast({ open: true, sev: "success", msg: "Restaurant deleted." });
      setConfirm({ open: false, id: null, name: "", busy: false });
    },
    onError: () => {
      setToast({
        open: true,
        sev: "error",
        msg: "Failed to delete restaurant.",
      });
      setConfirm((c) => ({ ...c, busy: false }));
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, diff }) => {
      const res = await fetch(`${base}/restaurants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(diff),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["restaurants"], (old = []) =>
        old.map((r) => (r.id === updated.id ? updated : r))
      );
      setToast({ open: true, sev: "success", msg: "Restaurant updated." });
    },
    onError: (err) => {
      setToast({
        open: true,
        sev: "error",
        msg: `Failed to update: ${err.message}`,
      });
    },
  });

  // --- Callbacks ---
  const onRequestEdit = useCallback(
    (payload) => {
      const item = restaurants.find((r) => r.id === payload.id) ?? payload;
      setEditState({ open: true, item });
    },
    [restaurants]
  );

  const onEditSaved = (updated) => {
    // Instead of calling API here, just trigger mutation
    const diff = {};
    for (const k of Object.keys(updated)) {
      if (editState.item && updated[k] !== editState.item[k]) diff[k] = updated[k];
    }
    if (Object.keys(diff).length > 0) {
      editMutation.mutate({ id: updated.id, diff });
    }
    setEditState({ open: false, item: null });
  };

  const onRequestDelete = useCallback(({ id, name }) => {
    setConfirm({ open: true, id, name, busy: false });
  }, []);

  const confirmDelete = () => {
    setConfirm((c) => ({ ...c, busy: true }));
    deleteMutation.mutate(confirm.id);
  };

  // --- Derived data ---
  const uniqueCuisines = useMemo(
    () => [...new Set(restaurants.map((r) => r.cuisine))].filter(Boolean),
    [restaurants]
  );

  const filteredRestaurants = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return restaurants.filter((r) => {
      const matchesSearch =
        !q ||
        r.name?.toLowerCase().includes(q) ||
        r.city?.toLowerCase().includes(q) ||
        r.cuisine?.toLowerCase().includes(q);

      const matchesCuisine = !selectedCuisine || r.cuisine === selectedCuisine;
      return matchesSearch && matchesCuisine;
    });
  }, [restaurants, searchTerm, selectedCuisine]);

  const paginatedRestaurants = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredRestaurants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRestaurants, page, itemsPerPage]);

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  // Reset to page 1 when search/filter changes
  useMemo(() => setPage(1), [searchTerm, selectedCuisine]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Render ---
  if (isLoading) {
    return (
      <Container
        maxWidth="xl"
        className="flex justify-center items-center py-20"
      >
        <Box className="text-center">
          <CircularProgress size={60} className="mb-4" />
          <Typography variant="h6" color="text.secondary">
            Loading delicious restaurants...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="xl" className="text-center py-20">
        <Typography variant="h6" color="error">
          Failed to load restaurants.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="px-4 py-8">
      {/* Hero */}
      <Box className="text-center mb-12 py-8">
        <Typography
          variant="h1"
className="text-2xl !sm:text-2xl !md:text-3xl !lg:text-4xl font-bold mb-4"          color="primary"
        >
          Discover Amazing Restaurants
        </Typography>
      </Box>

      {/* Search + Filter */}
      <Box className="mb-8 pb-2 flex flex-col sm:flex-row gap-4">
        <TextField
          placeholder="Search restaurants, cities, or cuisines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-[3]"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl className="flex-[2]">
          <InputLabel>Filter by Cuisine</InputLabel>
          <Select
            value={selectedCuisine}
            label="Filter by Cuisine"
            onChange={(e) => setSelectedCuisine(e.target.value)}
          >
            <MenuItem value="">All Cuisines</MenuItem>
            {uniqueCuisines.map((cuisine) => (
              <MenuItem key={cuisine} value={cuisine}>
                {cuisine}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Count + Pagination Info */}
      {(searchTerm || selectedCuisine) && (
        <Typography variant="body1" className="mb-4" color="text.secondary">
          Found {filteredRestaurants.length} restaurant
          {filteredRestaurants.length !== 1 ? "s" : ""}
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedCuisine && ` in ${selectedCuisine} cuisine`}
          {totalPages > 1 && ` (Page ${page} of ${totalPages})`}
        </Typography>
      )}

      {/* Grid */}
      {filteredRestaurants.length === 0 ? (
        <Box className="text-center py-16">
          <RestaurantIcon className="text-6xl mb-4 opacity-50" />
          <Typography variant="h5" className="font-semibold mb-4">
            {searchTerm || selectedCuisine
              ? "No restaurants found"
              : "No restaurants available"}
          </Typography>
          <Typography variant="body1" className="mb-6" color="text.secondary">
            {searchTerm || selectedCuisine
              ? "Try adjusting your search or filter criteria."
              : "Be the first to add a restaurant to our directory!"}
          </Typography>
          <Button
            component={RouterLink}
            to="/add"
            variant="contained"
            color="secondary"
            size="large"
            className="px-8 py-3"
          >
            Add Restaurant
          </Button>
        </Box>
      ) : (
        <>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id ?? restaurant.name}
                {...restaurant}
                onRequestDelete={onRequestDelete}
                onRequestEdit={({ id, name, rating }) =>
                  onRequestEdit({ id, name, rating })
                }
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Stack spacing={2} alignItems="center" className="!mt-5">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: "1rem",
                    minWidth: 40,
                    height: 40,
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Showing {(page - 1) * itemsPerPage + 1} to{" "}
                {Math.min(page * itemsPerPage, filteredRestaurants.length)} of{" "}
                {filteredRestaurants.length} restaurants
              </Typography>
            </Stack>
          )}
        </>
      )}

      {/* Confirm Delete */}
      <Dialog
        open={confirm.open}
        onClose={
          confirm.busy
            ? undefined
            : () => setConfirm({ open: false, id: null, name: "", busy: false })
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle color="error.main">Delete Restaurant</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete{" "}
            <strong>{confirm.name || "this restaurant"}</strong>? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirm({ open: false, id: null, name: "", busy: false })
            }
            disabled={confirm.busy}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={confirm.busy}
            sx={{ fontWeight: 700 }}
          >
            {confirm.busy ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <EditRestaurant
        open={editState.open}
        initial={editState.item}
        baseUrl={base}
        onClose={() => setEditState({ open: false, item: null })}
        onSaved={onEditSaved}
      />

      {/* Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.sev}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
