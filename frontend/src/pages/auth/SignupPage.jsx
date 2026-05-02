import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    role: "",
    fullName: "",
    email: "",
    phone: "",
    city: "",
    postcode: "",
    password: "",

    // student fields
    collegeName: "",
    universityName: "",
    studentId: "",
    confirmStudent: false,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  //  Submit form
  const handleSubmit = async () => {
    try {
      const payload = {
        role: formData.role,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        postcode: formData.postcode,
        password: formData.password,

        // include student fields only if student
        ...(formData.role === "student" && {
          collegeName: formData.collegeName,
          universityName: formData.universityName,
          studentId: formData.studentId,
        }),
      };

      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        payload
      );

      alert("🎉 Registration successful");
      console.log("Response:", res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7fafc", py: 10 }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            mb={3}
            color="#2b6f84"
          >
            Create Account
          </Typography>

          {/* ACCOUNT TYPE */}
          <TextField
            fullWidth
            select
            label="Account Type"
            name="role"
            value={formData.role}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="tenant">Tenant</MenuItem>
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </TextField>

          {/* COMMON FIELDS */}
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {/* CITY & POSTCODE */}
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          {/* STUDENT FIELDS */}
          {formData.role === "student" && (
            <>
              <Divider sx={{ my: 2 }}>Student Verification</Divider>

              <TextField
                fullWidth
                label="College Name"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="University Name"
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Student ID Number"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="confirmStudent"
                    checked={formData.confirmStudent}
                    onChange={handleChange}
                  />
                }
                label="I confirm that I am a verified student"
                sx={{ mb: 2 }}
              />
            </>
          )}

          {/* SUBMIT */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: "#4b83b6",
              py: 1.2,
              "&:hover": { bgcolor: "#3a6fa0" },
            }}
          >
            Sign Up
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/login"
            sx={{
              borderColor: "#2b6f84",
              color: "#2b6f84",
              fontWeight: 600,
            }}
          >
            Admin Login
          </Button>

          <Typography textAlign="center" mt={3}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2b6f84", fontWeight: 600 }}>
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
