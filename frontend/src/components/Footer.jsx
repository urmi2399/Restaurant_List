import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Footer() {
  return (
    <AppBar position="static" color="primary" sx={{ mt: 4 }} elevation={0}>
      <Toolbar className="flex justify-between">
        <Typography variant="body2" color="primary.contrastText">
          © {new Date().getFullYear()} Restaurant App
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
