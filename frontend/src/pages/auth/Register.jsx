// src/pages/auth/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import authService from "../../services/auth.service";
import storage from "../../services/storage";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "tenant", // default role; admin/owner handled separately
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) return "Invalid email";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      };

      const res = await authService.register(payload);
      // API returns: { success: true, token, user } (preferred)
      if (res.data?.token) {
        storage.saveToken(res.data.token);
        // optional: fetch profile will happen in AuthContext; redirect to dashboard
        navigate("/"); // or navigate to role-specific dashboard
      } else {
        // If API returns success without token, redirect to login
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Avatar sx={{ mx: "auto", bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography variant="h5" mt={2} mb={1}>
          Create an account
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Register to list properties and manage your dashboard.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Full name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Email address"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              type="email"
            />

            <TextField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      aria-label="toggle password"
                      size="large"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              type="password"
            />

            {/* Optional: Role selection for admins only; hidden for public registration */}
            {/* <TextField select name="role" ... /> */}

            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? "Please wait…" : "Create account"}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                Already have an account?{" "}
                <Button onClick={() => navigate("/login")}>Log in</Button>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
