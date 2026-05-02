import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProperties } from "../../services/propertyService";

export default function PropertyListingsPage() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const data = await getAllProperties();

    // Active + Featured only + limit 3
    const filtered = data
      .filter((p) => p.status === "Active" && p.featured_image)
      .slice(0, 3);

    setProperties(filtered);
  };

  return (
    <Box sx={{ py: 12 }}>
      <Container maxWidth="lg">

        <Typography variant="h3" fontWeight={800} mb={6} align="center">
          Property Listings
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          wrap="nowrap"
        >
          {properties.map((property) => {
            const featuredAttachment = property.attachments?.find(
              (att) => att._id === property.featured_image
            );

            if (!featuredAttachment) return null;

            return (
              <Grid
                item
                key={property._id}
                sx={{
                  display: "flex",
                  maxWidth: 360,
                  width: "100%",
                }}
              >
                <Card
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                  }}
                >
                  {/* IMAGE */}
                  <Box sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        overflow: "hidden",
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                      }}
                    >
                      <img
                        src={`http://localhost:5000${featuredAttachment.file}`}
                        alt={property.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>

                    <Chip
                      label="FEATURED"
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        bgcolor: "#000",
                        color: "#fff",
                        fontSize: 12,
                      }}
                    />
                  </Box>

                  {/* CONTENT */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={700}>
                      £ {property.rent}
                    </Typography>

                    <Typography fontWeight={600}>
                      {property.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={2}
                    >
                      {property.area?.location_name}, {property.postcode}
                    </Typography>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        navigate(`/property-owner-detail/${property._id}`)
                      }
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <Box textAlign="center" mt={6}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/properties")}
          >
            More Properties
          </Button>
        </Box>
      </Container>
    </Box>

  );
}
