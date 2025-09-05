import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from "@mui/material";

export default function DeleteRestaurant({
  open,
  name = "this restaurant",
  onCancel,
  onConfirm,
  busy = false,
}) {
  return (
    <Dialog open={open} onClose={busy ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle color="error.main">Delete Restaurant</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to permanently delete <strong>{name}</strong>?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={busy}
          sx={{ fontWeight: 700 }}
        >
          {busy ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
