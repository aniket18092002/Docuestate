import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Header({ onToggle }) {
  const navigate = useNavigate();

  // const user = {
  //   name: "Admin",
  //   email: "admin@gmail.com",
  // };

  const user = JSON.parse(localStorage.getItem("user"));

  const [anchorEl, setAnchorEl] = useState(null);
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setAnchorEl(null);     // close menu
    navigate("/login");   // redirect to login
  };
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        zIndex: 1300,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT : TOGGLE + LOGO + NAME */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* TOGGLE BUTTON */}
          <IconButton onClick={onToggle}>
            <MenuIcon />
          </IconButton>

          {/* LOGO + APP NAME */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              minWidth: 280,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="DocuEstate Logo"
              sx={{
                width: 122,
                height: 62,
                objectFit: "contain",
              }}
            />

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "#1976d2",
                }}
              >
                DocuEstate
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                {/* Admin Panel */}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* RIGHT : USER INFO */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <Avatar sx={{ bgcolor: "#1976d2" }}>
            {user?.fullName?.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Typography fontWeight={600}>{user?.fullName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ sx: { minWidth: 180 } }}
        >
          <MenuItem onClick={() => navigate("/app/profile")}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* USER MENU */}

      </Toolbar>
    </AppBar>
  );
}
