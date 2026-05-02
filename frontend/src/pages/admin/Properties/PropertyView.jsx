import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function PropertyView() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    loadProperty();
  }, []);
  const navigate = useNavigate();
  const loadProperty = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/properties/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProperty(res.data);
    } catch (error) {
      console.error("Failed to load property", error);
    }
  };

  if (!property) return null;

  // Featured Image
  const featuredImage = property.attachments?.find(
    (att) => att._id === property.featured_image
  );

  return (
    <Box>
      {/* HEADER */}
      {/* <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Property Overview
        </Typography>
        <Typography variant="caption">Home / Properties / View</Typography>
      </Paper> */}

      {/* FEATURED IMAGE */}
      {/* {featuredImage && (
        <Paper sx={{ mb: 3, overflow: "hidden" }}>
          <img
            src={`http://localhost:5000${featuredImage.file}`}
            alt="Featured"
            style={{
              width: "100%",
              height: "350px",
              objectFit: "cover",
            }}
          />
        </Paper>
      )} */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Property Overview
          </Typography>
          <Typography variant="caption">Home / Properties / View</Typography>
        </Box>

        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Paper>
      {/* DETAILS TABLE */}
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableBody>
            <Row label="Listing ID" value={property.listingId || "-"} />
            <Row label="Title" value={property.title} />
            <Row
              label="Owner"
              value={`${property.owner?.fullName || "-"} (${property.owner?.email || ""})`}
            />
            <Row
              label="Property Type"
              value={property.propertyType?.propertyType || "-"}
            />
            <Row
              label="Area"
              value={property.area?.location_name || "-"}
            />
            <Row label="Postcode" value={property.postcode} />
            <Row label="Rent" value={`£${property.rent} pcm`} />
            <Row label="Deposit" value={`£${property.deposit || "-"}`} />
            <Row label="Bedrooms" value={property.bedrooms} />
            <Row label="Bathrooms" value={property.bathrooms} />
            <Row label="Furnishing" value={property.furnishing} />
            <Row
              label="Availability"
              value={
                property.availableFrom
                  ? new Date(property.availableFrom).toLocaleDateString()
                  : "-"
              }
            />
            <Row label="Lease Type" value={property.leaseType} />
            <Row label="EPC Rating" value={property.epcRating} />
            <Row label="Status" value={property.status} />
            <Row
              label="Submitted On"
              value={new Date(property.createdAt).toLocaleDateString()}
            />
            <Row label="Views" value={property.views || 0} />
            <Row label="Saves" value={property.saves || 0} />
          </TableBody>
        </Table>
      </Paper>

      {/* GALLERY */}
      {property.attachments?.length > 0 && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Property Images
          </Typography>

          <Grid container spacing={2}>
            {property.attachments.map((img) => (
              <Grid item xs={12} sm={6} md={3} key={img._id}>
                <img
                  src={`http://localhost:5000${img.file}`}
                  alt="Property"
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border:
                      img._id === property.featured_image
                        ? "3px solid #1976d2"
                        : "1px solid #ddd",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

/* ================= HELPER ROW ================= */

function Row({ label, value }) {
  return (
    <TableRow>
      <TableCell sx={{ width: "30%", fontWeight: 600 }}>
        {label}
      </TableCell>
      <TableCell>{value || "-"}</TableCell>
    </TableRow>
  );
}
