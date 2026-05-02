import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../../services/userService";

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        postcode: "",
        role: "",
        kyc: "Not Verified",
        password: "",
    });

    /* ================= FETCH USER ================= */
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const data = await getUserById(id);
            setForm({
                fullName: data.fullName || "",
                email: data.email || "",
                phone: data.phone || "",
                city: data.city || "",
                postcode: data.postcode || "",
                role: data.role || "",
                kyc: data.kyc || "Not Verified",
                password: "",
            });
        } catch (error) {
            console.error("Failed to load user", error);
        }
    };

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await updateUser(id, {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                city: form.city,
                postcode: form.postcode,
                role: form.role,
                kyc: form.kyc,
                password: form.password || undefined,
            });

            navigate("/app/web-users-list");
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update user");
        }
    };

    /* ================= UI ================= */
    return (
        <Box>
            {/* HEADER */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                    Website Users
                </Typography>
                <Typography variant="caption">
                    Home / User Management / Update
                </Typography>
            </Paper>

            {/* FORM */}
            <Paper sx={{ p: 4 }}>
                <Typography variant="h6" mb={3}>
                    Edit User
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

                    {/* KYC */}
                    <FormControl>
                        <FormLabel>KYC Status</FormLabel>
                        <RadioGroup
                            row
                            name="kyc"
                            value={form.kyc}
                            onChange={handleChange}
                        >
                            <FormControlLabel
                                value="Not Verified"
                                control={<Radio />}
                                label="Not Verified"
                            />
                            <FormControlLabel
                                value="Verified"
                                control={<Radio />}
                                label="Verified"
                            />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        label="Password (leave blank to keep same)"
                        name="password"
                        type="password"
                        value={form.password}
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
                        Update User
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
