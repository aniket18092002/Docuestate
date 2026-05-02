import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";// adjust path if needed
import useSettings from "../hooks/useSettings";

export default function Navbar() {
  const settings = useSettings();
  return (
    <AppBar
      elevation={0}
      position="static"
      sx={{
        bgcolor: "#fff",
        color: "#2b6f84",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT : LOGO + NAME */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="DocuEstate Logo"
            sx={{
              width: 100,
              height: 100,
              objectFit: "contain",
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >

            {/* DocuEstate */}
            {settings?.siteName || "DocuEstate test"}
          </Typography>
        </Box>

        {/* RIGHT : NAV LINKS */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>

          <Button component={Link} to="/about" color="inherit">
            About Us
          </Button>

          <Button component={Link} to="/propertydetails" color="inherit">
            Properties
          </Button>

          <Button component={Link} to="/contact" color="inherit">
            Contact
          </Button>

          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
