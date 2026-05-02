import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    createProperty,
    getPropertyById,
    updateProperty,
} from "../../../services/propertyService";
import { getActiveOwners } from "../../../services/userService";
import { getPropertyTypes } from "../../../services/propertyTypeService";
import { getLocationMasters } from "../../../services/locationMasterService";
import { deletePropertyAttachment } from "../../../services/propertyService";
export default function CreateEditProperty() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const loggedUser = JSON.parse(localStorage.getItem("user"));
    const role = loggedUser?.role;

    /* ================= FORM ================= */

    const [form, setForm] = useState({
        title: "",
        owner: "",
        propertyType: "",
        area: "",
        postcode: "",
        rent: "",
        deposit: "",
        bedrooms: "",
        bathrooms: "",
        furnishing: "",
        availableFrom: "",
        leaseType: "",
        epcRating: "",
        status: "Pending",
        property_listed: "0",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    /* ================= ATTACHMENTS ================= */

    const [attachments, setAttachments] = useState([
        { file: null, remarks: "", preview: "" },
    ]);

    const handleFileChange = (index, file) => {
        if (!file) return;

        const updated = [...attachments];

        updated[index] = {
            ...updated[index],
            file,
            preview: URL.createObjectURL(file),
            url: "", // replace old image
        };

        setAttachments(updated);
    };


    const handleRemarkChange = (index, value) => {
        const updated = [...attachments];
        updated[index].remarks = value;
        setAttachments(updated);
    };

    const addAttachment = () => {
        setAttachments([
            ...attachments,
            { file: null, remarks: "", preview: "" },
        ]);
    };

    const removeAttachment = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };



    const handleDeleteAttachment = async (index) => {
        const att = attachments[index];

        if (att._id) {
            if (!window.confirm("Delete this image?")) return;

            try {
                await deletePropertyAttachment(id, att._id);
            } catch (err) {
                alert("Failed to delete image");
                return;
            }
        }

        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };


    /* ================= MASTER DATA ================= */

    const [owners, setOwners] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        loadPropertyTypes();
        loadLocations();

        if (role === "admin") {
            loadOwners();
        } else {
            setForm((p) => ({ ...p, owner: loggedUser?.id }));
        }

        if (isEdit) loadProperty();
    }, []);

    const loadPropertyTypes = async () => {
        setPropertyTypes(await getPropertyTypes());
    };

    const loadLocations = async () => {
        const data = await getLocationMasters();
        setLocations(data.filter((l) => l.status === "Active"));
    };

    const loadOwners = async () => {
        setOwners(await getActiveOwners());
    };

    const loadProperty = async () => {
        const data = await getPropertyById(id);

        setForm({
            ...data,
            owner: data.owner?._id || "",
            propertyType: data.propertyType?._id || "",
            area: data.area?._id || data.area || "",
        });

        // SET OLD ATTACHMENTS
        if (data.attachments && data.attachments.length > 0) {
            setAttachments(
                data.attachments.map((att) => ({
                    _id: att._id,
                    file: null,
                    remarks: att.remarks || "",
                    preview: "",
                    url: `http://localhost:5000${att.file.startsWith("uploads") ? att.file : "" + att.file}`,
                }))
            );
        }
    };


    /* ================= SUBMIT ================= */

    const handleSubmit = async () => {
        if (!form.owner || !form.propertyType || !form.rent) {
            alert("Required fields missing");
            return;
        }

        const formData = new FormData();
        Object.keys(form).forEach((k) => formData.append(k, form[k]));

        attachments.forEach((att) => {
            if (att.file) {
                formData.append("attachments", att.file);
                formData.append("remarks[]", att.remarks || "");
            }
        });

        try {
            isEdit
                ? await updateProperty(id, formData)
                : await createProperty(formData);
            navigate("/app/all-properties");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save property");
        }
    };

    /* ================= UI ================= */

    return (
        <Box>
            {/* HEADER */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6">
                    {isEdit ? "Edit Property" : "Create New Property"}
                </Typography>
            </Paper>

            {/* FORM */}
            <Paper sx={{ p: 4 }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                    />

                    {/* OWNER FIELD */}
                    {role === "admin" ? (
                        <TextField
                            select
                            label="Owner"
                            name="owner"
                            value={form.owner}
                            onChange={handleChange}
                            required
                        >
                            {owners.length === 0 && (
                                <MenuItem disabled>No active owners</MenuItem>
                            )}
                            {owners.map((owner) => (
                                <MenuItem key={owner._id} value={owner._id}>
                                    {owner.fullName} ({owner.email})
                                </MenuItem>
                            ))}
                        </TextField>
                    ) : (
                        <TextField
                            label="Owner"
                            value={loggedUser?.fullName || ""}
                            disabled
                        />
                    )}

                    <TextField
                        select
                        label="Type"
                        name="propertyType"
                        value={form.propertyType}
                        onChange={handleChange}
                    >
                        {propertyTypes.map((type) => (
                            <MenuItem key={type._id} value={type._id}>
                                {type.propertyType}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Area"
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="">Select Area</MenuItem>

                        {locations.map((loc) => (
                            <MenuItem key={loc._id} value={loc._id}>
                                {loc.location_name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Postcode"
                        name="postcode"
                        value={form.postcode}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Rent (£ pcm)"
                        name="rent"
                        value={form.rent}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Deposit (£)"
                        name="deposit"
                        value={form.deposit}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Bedrooms"
                        name="bedrooms"
                        value={form.bedrooms}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Bathrooms"
                        name="bathrooms"
                        value={form.bathrooms}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Furnishing"
                        name="furnishing"
                        value={form.furnishing}
                        onChange={handleChange}
                    />


                    <TextField
                        type="date"
                        label="Available From"
                        name="availableFrom"
                        value={form.availableFrom}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Lease Type"
                        name="leaseType"
                        value={form.leaseType}
                        onChange={handleChange}
                    />
                    <TextField
                        label="EPC Rating"
                        name="epcRating"
                        value={form.epcRating}
                        onChange={handleChange}
                    />

                    {role === "admin" && (
                        <TextField
                            select
                            label="Status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            {/* <MenuItem value="Live">Live</MenuItem> */}
                            <MenuItem value="Inactive">Inactive</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </TextField>
                    )}
                </Box>
                <Typography fontWeight={600} mb={2}>
                    Attachment List
                </Typography>
                {attachments.map((att, i) => (
                    <Paper
                        key={i}
                        variant="outlined"
                        sx={{ p: 2, mb: 2 }}
                    >
                        <Grid container spacing={2} alignItems="center">

                            {/* LEFT : IMAGE + FILE */}
                            <Grid item xs={12} md={3}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    fullWidth
                                >
                                    Choose File
                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleFileChange(i, e.target.files[0])
                                        }
                                    />
                                </Button>

                                {(att.preview || att.url) && (
                                    <Box mt={1} textAlign="center">
                                        <img
                                            src={att.preview ? att.preview : att.url}
                                            alt="preview"
                                            style={{
                                                width: "100%",
                                                maxHeight: "140px",
                                                objectFit: "cover",
                                                borderRadius: "6px",
                                                border: "1px solid #ddd",
                                            }}
                                        />
                                    </Box>
                                )}

                            </Grid>

                            {/* MIDDLE : REMARKS */}
                            <Grid item xs={12} md={7}>
                                <TextField
                                    label="Remarks"
                                    fullWidth
                                    value={att.remarks}
                                    onChange={(e) =>
                                        handleRemarkChange(i, e.target.value)
                                    }
                                />
                            </Grid>

                            {/* RIGHT : ACTIONS */}
                            <Grid item xs={12} md={2} textAlign="center">
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={addAttachment}
                                    sx={{ mb: 1 }}
                                    fullWidth
                                >
                                    +
                                </Button>

                                {attachments.length > 1 && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDeleteAttachment(i)}
                                        fullWidth
                                    >
                                        <DeleteIcon />
                                    </Button>
                                )}
                            </Grid>

                        </Grid>
                    </Paper>
                ))}

                <Box mt={3} textAlign="right">
                    <Button variant="contained" onClick={handleSubmit}>
                        {isEdit ? "Update Property" : "Create Property"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}