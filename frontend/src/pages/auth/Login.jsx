import {
  Box,
  Container,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


/* ================= TAB PANEL ================= */

function TabPanel({ value, index, children }) {
  return value === index ? <Box sx={{ mt: 3 }}>{children}</Box> : null;
}

/* ================= MAIN PAGE ================= */

export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7fafc", py: 10 }}>
      <Container maxWidth="sm">
        <Snackbar
          open={showStudentPopup}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" variant="filled">
            Student Offer! Get <b>10% discount</b> on every property!
          </Alert>
        </Snackbar>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            mb={3}
            color="#2b6f84"
          >
            Login to DocuEstate
          </Typography>

          {/* ===== TABS ===== */}
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            centered
            variant="fullWidth"
          >
            <Tab label="Property Owner" />
            <Tab label="Admin" />
            <Tab label="Student" />
          </Tabs>

          {/* ===== OWNER LOGIN ===== */}
          <TabPanel value={tab} index={0}>
            <LoginForm expectedRole="owner" />
          </TabPanel>

          {/* ===== ADMIN LOGIN ===== */}
          <TabPanel value={tab} index={1}>
            <LoginForm expectedRole="admin" isAdmin />
          </TabPanel>
          {/* ===== STUDENT LOGIN ===== */}
          <TabPanel value={tab} index={2}>
            <LoginForm
              expectedRole="student"
              isStudent
              setShowStudentPopup={setShowStudentPopup}
            />
          </TabPanel>

          <Typography textAlign="center" mt={3}>
            Don’t have an account?{" "}
            <Link
              to="/signup"
              style={{ color: "#2b6f84", fontWeight: 600 }}
            >
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

/* ================= LOGIN FORM ================= */

function LoginForm({ 
  expectedRole, 
  isAdmin = false, 
  isStudent = false,
  setShowStudentPopup // NEW
}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password }
      );

      const { token, user } = res.data;

      if (user.status !== "Active") {
        alert("Your account is not active. Please contact admin.");
        return;
      }

      // ROLE CHECK
      if (user.role !== expectedRole) {
        alert("You are not allowed to login here");
        return;
      }

      //  SAVE AUTH (MATCH SERVICES)
      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("login_time", Date.now());

      //  REDIRECT
      //  REDIRECT
      if (user.role === "admin") {
        navigate("/app/dashboard");
      } else if (user.role === "owner") {
        navigate("/app/all-properties");
      } else if (user.role === "student") {
        setShowStudentPopup(true);
        setTimeout(() => {
          setShowStudentPopup(false);
          navigate("/properties"); // better route
        }, 1500);
      } else {
        navigate("/propertydetails");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography mb={2} fontWeight={600}>
        {isAdmin
          ? "Admin"
          : isStudent
            ? "Student"
            : "Owner"} Login
      </Typography>

      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </>
  );
}
