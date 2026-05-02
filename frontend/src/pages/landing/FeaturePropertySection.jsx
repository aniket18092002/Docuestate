import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProperties } from "../../services/propertyService";

export default function FeaturePropertySection() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    const data = await getAllProperties();

    // Only ACTIVE + featured image
    const filtered = data
      .filter((p) => p.status === "Active" && p.featured_image)
      .slice(0, 2);

    setProperties(filtered);
  };

  return (
    <Box sx={{ py: 10, bgcolor: "#f7fafc" }}>
      <Container maxWidth="xl">
        {/* HEADER */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography color="primary" fontWeight={600}>
            Properties
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            Featured Properties
          </Typography>
        </Box>

        {/* PROPERTY CARDS */}
        <Grid container spacing={4} justifyContent="center">
          {properties.map((property) => {
            const featuredAttachment = property.attachments?.find(
              (att) => att._id === property.featured_image
            );

            if (!featuredAttachment) return null;

            return (
              <Grid item xs={12} md={6} key={property._id}>
                <Card
                  sx={{
                    display: "flex",
                    borderRadius: 3,
                    height: 180,          // FIXED CARD HEIGHT
                    overflow: "hidden",
                  }}
                >
                  {/* LEFT CONTENT */}
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      £ {property.rent}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                      {property.title}
                      <br />
                      {property?.location_name}, {property.postcode}
                    </Typography>

                    <Button
                      size="small"
                      variant="contained"
                      onClick={() =>
                        navigate(`/property-owner-detail/${property._id}`)
                      }
                      sx={{ width: "fit-content" }}
                    >
                      View Details
                    </Button>
                  </CardContent>

                  {/* RIGHT IMAGE (FIXED SIZE) */}
                  <Box
                    sx={{
                      position: "relative",
                      width: 260,
                      height: 180,
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    <Chip
                      label="FEATURED"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        bgcolor: "#000",
                        color: "#fff",
                        zIndex: 1,
                      }}
                    />

                    <CardMedia
                      component="img"
                      image={`http://localhost:5000${featuredAttachment.file}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", //  KEY FIX
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* VIEW MORE */}
        <Box textAlign="center" mt={6}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/propertydetails")}
          >
            View More Properties
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
