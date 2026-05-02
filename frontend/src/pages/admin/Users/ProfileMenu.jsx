import {
    Avatar,
    Box,
    Typography,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProfileMenu() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.clear();   // remove token + user
        navigate("/login");
    };

    return (
        <>
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
            >
                <MenuItem onClick={() => navigate("/app/profile")}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
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
        </>
    );
}
