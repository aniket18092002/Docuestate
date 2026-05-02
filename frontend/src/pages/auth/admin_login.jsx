import * as React from "react";
import {
  Button,
  CssBaseline,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Avatar,
  TextField,
  Link,
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isSessionValid } from "../../utils/auth";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showStudentPopup, setShowStudentPopup] = React.useState(false);

  useEffect(() => {
    if (isSessionValid()) {
      navigate("/properties");
    }
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");


    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/users/simple-login",
        { email, password }
      );

      // Save auth data
      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("login_time", Date.now());
      // 🎓 STUDENT DISCOUNT POPUP
      if (res.data.user.role === "student") {
        setShowStudentPopup(true);

        // Show popup for 5 seconds then redirect
        setTimeout(() => {
          setShowStudentPopup(false);
          navigate("/properties");
        }, 2000);
      } else {
        // Normal users → direct redirect
        navigate("/properties");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      {/* STUDENT POPUP */}
      <Snackbar
        open={showStudentPopup}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
           Student Offer! Get <b>10% discount</b> on every property!
        </Alert>
      </Snackbar>

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
          />

          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Remember me"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>

            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
