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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../services/userService";

export default function CreateUser() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        role: "",
        fullName: "",
        email: "",
        phone: "",
        city: "",
        postcode: "",
        kyc: "Not Verified",
        password: "",
        confirmPassword: "",

        //  student fields
        collegeName: "",
        universityName: "",
        studentId: "",
        studentVerified: false,
    });

    /* ================= HANDLER ================= */

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    /* ================= SUBMIT ================= */

    const handleSubmit = async () => {
        if (form.password !== form.confirmPassword) {
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
            password: form.password,
            status: "Pending",
        };

        // KYC only for owner / tenant / student
        if (["owner", "tenant", "student"].includes(form.role)) {
            payload.kyc = form.kyc;
        }

        //  student fields
        if (form.role === "student") {
            payload.collegeName = form.collegeName;
            payload.universityName = form.universityName;
            payload.studentId = form.studentId;
            payload.studentVerified = form.studentVerified;
        }

        await createUser(payload);
        navigate("/app/web-users-list");
    };

    /* ================= UI ================= */

    return (
        <Box>
            {/* HEADER */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                    Create New User
                </Typography>
                <Typography variant="caption">
                    Home / User Management / Create
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
                    {/* ROLE */}
                    <TextField
                        select
                        label="Account Type"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        required
                    >
                        {/* <MenuItem value="admin">Admin</MenuItem> */}
                        <MenuItem value="tenant">Tenant</MenuItem>
                        <MenuItem value="owner">Owner</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                    </TextField>

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

                    {/*  KYC ONLY FOR OWNER / TENANT / STUDENT */}
                    {["owner", "tenant", "student"].includes(form.role) && (
                        <TextField
                            select
                            label="KYC Status"
                            name="kyc"
                            value={form.kyc}
                            onChange={handleChange}
                        >
                            <MenuItem value="Not Verified">Not Verified</MenuItem>
                            <MenuItem value="Verified">Verified</MenuItem>
                        </TextField>
                    )}

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </Box>

                {/*  STUDENT SECTION */}
                {form.role === "student" && (
                    <>
                        <Divider sx={{ my: 3 }}>Student Verification</Divider>

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
                                label="Student ID Number"
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
                            label="I confirm that I am a verified student"
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
                    <Button variant="outlined" onClick={() => navigate("/app/web-users-list")}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Create User
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
