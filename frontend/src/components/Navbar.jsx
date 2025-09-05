import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Link as RouterLink } from "react-router-dom"

export default function Navbar() {
  return (
    // Top Navigation bar container
    <AppBar position="static" color="primary"> 
  {/* with inibuilt padding anad margin */}
      <Toolbar className="flex justify-between">
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.contrastText" }}>
          🍽️ Restaurant Discovery
        </Typography>
        <div className="space-x-2">
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/add">
            Add Restaurant
          </Button>
          
        </div>
      </Toolbar>
    </AppBar>
  )
}
