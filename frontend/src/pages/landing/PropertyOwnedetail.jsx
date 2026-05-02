import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PropertyDetail() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);

  //  Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const isStudent = user?.role === "student";

  useEffect(() => {
    loadProperty();
  }, []);

  const loadProperty = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/properties/${propertyId}`
      );
      setProperty(res.data);
    } catch (err) {
      console.error("Failed to load property", err);
    }
  };

  if (!property) return null;

  // Featured Image
  const featuredImage = property.attachments?.find(
    (att) => att._id === property.featured_image
  );

  //  Discount Logic
  const discountedRent = isStudent
    ? Math.round(property.rent - property.rent * 0.1)
    : property.rent;

  return (
    <Box sx={{ bgcolor: "#f7fafc", py: 6 }}>
      <Container maxWidth="lg">

        {/* ================= IMAGE SECTION ================= */}
        {featuredImage && (
          <Box mb={4}>
            <img
              src={`http://localhost:5000${featuredImage.file}`}
              alt={property.title}
              style={{
                width: "100%",
                height: "420px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          </Box>
        )}

        <Grid container spacing={4}>

          {/* ================= LEFT : PROPERTY INFO ================= */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight={700}>
                {property.title}
              </Typography>

              <Typography color="text.secondary" mt={1}>
                {property.area?.location_name || property.area} • {property.postcode}
              </Typography>

              {/*  RENT DISPLAY */}
              <Box mt={2}>
                <Typography variant="h5" fontWeight={700} color="primary">
                  £ {discountedRent} / month
                </Typography>

                {isStudent && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                      }}
                    >
                      £ {property.rent} / month
                    </Typography>

                    <Chip
                      label="🎉 10% Student Discount Applied"
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Detail label="Bedrooms" value={property.bedrooms} />
                <Detail label="Bathrooms" value={property.bathrooms} />
                <Detail label="Furnishing" value={property.furnishing} />
                <Detail label="Lease Type" value={property.leaseType} />
                <Detail label="EPC Rating" value={property.epcRating} />
                <Detail
                  label="Available From"
                  value={
                    property.availableFrom
                      ? new Date(property.availableFrom).toLocaleDateString()
                      : "-"
                  }
                />
              </Grid>
            </Paper>
          </Grid>

          {/* ================= RIGHT : OWNER INFO ================= */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                Owner Details
              </Typography>

              <Typography fontWeight={600} mt={1}>
                {property.owner?.fullName}
              </Typography>

              {property.owner?.email && (
                <Typography sx={{ mt: 1 }}>
                  📧{" "}
                  <a
                    href={`mailto:${property.owner.email}`}
                    style={{ color: "#1976d2", textDecoration: "none" }}
                  >
                    {property.owner.email}
                  </a>
                </Typography>
              )}

              {property.owner?.phone ? (
                <Typography sx={{ mt: 1 }}>
                  📞{" "}
                  <a
                    href={`tel:${property.owner.phone}`}
                    style={{ color: "#1976d2", textDecoration: "none" }}
                  >
                    {property.owner.phone}
                  </a>
                </Typography>
              ) : (
                <Typography sx={{ mt: 1 }} color="text.secondary">
                  📞 N/A
                </Typography>
              )}
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}

/* ================= SMALL COMPONENT ================= */

function Detail({ label, value }) {
  return (
    <Grid item xs={6}>
      <Typography fontSize={13} color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={600}>
        {value || "-"}
      </Typography>
    </Grid>
  );
}
