import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Radio,
    Button,
    TextField,
    Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateFeaturedImage } from "../../../services/propertyService";

import {
    getPropertyById,
    setLandingImage,
} from "../../../services/propertyService";

export default function ListedPropertyAdd() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getPropertyById(id);
        setProperty(data);
        setAttachments(data.attachments || []);
    };

    const handleSave = async () => {
        if (!selectedImage) {
            alert("Please select one image for landing page");
            return;
        }

        try {
            await updateFeaturedImage(id, selectedImage); // SAVE ATTACHMENT ID
            navigate("/app/all-properties");
        } catch (err) {
            alert("Failed to save landing image");
        }
    };


    if (!property) return null;

    return (
        <Box>
            {/* ================= HEADER ================= */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                    Publish Property (Landing Page Setup)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Review property details and select landing image
                </Typography>
            </Paper>

            {/* ================= BASIC DETAILS (READ ONLY) ================= */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography fontWeight={600} mb={2}>
                    Property Details
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField label="Title" value={property.title} fullWidth disabled />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Owner"
                            value={property.owner?.fullName || ""}
                            fullWidth
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Property Type"
                            value={property.propertyType?.propertyType || ""}
                            fullWidth
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField label="Area" value={property.area} fullWidth disabled />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField label="Postcode" value={property.postcode} fullWidth disabled />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField label="Rent (£ pcm)" value={property.rent} fullWidth disabled />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField label="Bedrooms" value={property.bedrooms} fullWidth disabled />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField label="Bathrooms" value={property.bathrooms} fullWidth disabled />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField label="Furnishing" value={property.furnishing} fullWidth disabled />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField label="Lease Type" value={property.leaseType} fullWidth disabled />
                    </Grid>
                </Grid>
            </Paper>

            {/* ================= ATTACHMENTS ================= */}
            <Paper sx={{ p: 3 }}>
                <Typography fontWeight={600} mb={1}>
                    Select Landing Page Image
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Choose exactly one image that will appear on the website landing page
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    {attachments.length === 0 && (
                        <Typography>No attachments found</Typography>
                    )}

                    {attachments.map((att) => (
                        <Grid item xs={12} md={4} key={att._id}>
                            <Card
                                sx={{
                                    border:
                                        selectedImage === att._id
                                            ? "2px solid #1976d2"
                                            : "1px solid #ddd",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={`http://localhost:5000${att.file}`}
                                    alt="Property"
                                />
                                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                                    <Radio
                                        checked={selectedImage === att._id}
                                        onChange={() => setSelectedImage(att._id)}
                                    />
                                    <Typography>Select as landing image</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* ================= ACTIONS ================= */}
                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave}>
                        Save & Publish
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
