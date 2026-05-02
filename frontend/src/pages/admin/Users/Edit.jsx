import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../../services/userService";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "",
    fullName: "",
    email: "",
    phone: "",
    city: "",
    postcode: "",
    status: "",
    kyc: "",
    password: "",
    confirmPassword: "",

    //  student
    collegeName: "",
    universityName: "",
    studentId: "",
    studentVerified: false,
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const data = await getUserById(id);

    setForm({
      role: data.role || "",
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      city: data.city || "",
      postcode: data.postcode || "",
      status: data.status || "Pending",
      kyc: data.kyc || "Not Verified",
      password: "",
      confirmPassword: "",

      collegeName: data.collegeName || "",
      universityName: data.universityName || "",
      studentId: data.studentId || "",
      studentVerified: data.studentVerified || false,
    });
  };

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    if (form.password && form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      role: form.role,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      city: form.city,
      postcode: form.postcode,
      status: form.status,
    };

    //  KYC only for owner / tenant / student
    if (["owner", "tenant", "student"].includes(form.role)) {
      payload.kyc = form.kyc;
    }

    if (form.password) payload.password = form.password;

    // 🎓 student fields
    if (form.role === "student") {
      payload.collegeName = form.collegeName;
      payload.universityName = form.universityName;
      payload.studentId = form.studentId;
      payload.studentVerified = form.studentVerified;
    }

    await updateUser(id, payload);
    navigate("/app/users");
  };

  /* ================= UI ================= */

  return (
    <Box>
      {/* HEADER */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Update User
        </Typography>
        <Typography variant="caption">
          Home / User Management / Update
        </Typography>
      </Paper>

      {/* FORM */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" mb={3}>
          User Details
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          <TextField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          {/*  ALWAYS VISIBLE */}
          <TextField
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
          />

          <TextField
            label="Postcode"
            name="postcode"
            value={form.postcode}
            onChange={handleChange}
          />

          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </TextField>

          {/* KYC ONLY FOR OWNER / TENANT / STUDENT */}
          {["owner", "tenant", "student"].includes(form.role) && (
            <TextField
              select
              label="KYC"
              name="kyc"
              value={form.kyc}
              onChange={handleChange}
            >
              <MenuItem value="Not Verified">Not Verified</MenuItem>
              <MenuItem value="Verified">Verified</MenuItem>
            </TextField>
          )}

          <TextField
            label="New Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <TextField
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="tenant">Tenant</MenuItem>
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </TextField>
        </Box>

        {/* STUDENT SECTION */}
        {form.role === "student" && (
          <>
            <Divider sx={{ my: 3 }}>Student Information</Divider>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                label="College Name"
                name="collegeName"
                value={form.collegeName}
                onChange={handleChange}
              />

              <TextField
                label="University Name"
                name="universityName"
                value={form.universityName}
                onChange={handleChange}
              />

              <TextField
                label="Student ID"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  name="studentVerified"
                  checked={form.studentVerified}
                  onChange={handleChange}
                />
              }
              label="Student Verified"
              sx={{ mt: 2 }}
            />
          </>
        )}

        {/* ACTIONS */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button variant="outlined" onClick={() => navigate("/app/users")}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Update User
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
