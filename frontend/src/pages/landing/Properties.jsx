import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProperties } from "../../services/propertyService";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  // USER ROLE CHECK
  const user = JSON.parse(localStorage.getItem("user"));
  const isStudent = user?.role === "student";

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const data = await getAllProperties();
    setProperties(data.filter((p) => p.featured_image));
  };

  //  PRICE CALCULATION
  const getDiscountedPrice = (rent) => {
    if (!isStudent) return rent;
    return Math.round(rent - rent * 0.1); // 10% OFF
  };

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} mb={5}>
          Featured Properties
        </Typography>

        {/*  ALWAYS 3 COLUMNS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
          }}
        >
          {properties.map((property) => {
            const featuredImage = property.attachments?.find(
              (a) => a._id === property.featured_image
            );
            if (!featuredImage) return null;

            const discountedRent = getDiscountedPrice(property.rent);

            return (
              <Card
                key={property._id}
                sx={{
                  height: 430,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                }}
              >
                {/* IMAGE */}
                <Box sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      height: 200,
                      width: "100%",
                      overflow: "hidden",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      bgcolor: "#f2f2f2",
                    }}
                  >
                    <img
                      src={`http://localhost:5000${featuredImage.file}`}
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
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      bgcolor: "#000",
                      color: "#fff",
                      fontSize: 11,
                    }}
                  />

                  {/*  STUDENT DISCOUNT BADGE */}
                  {isStudent && (
                    <Chip
                      label="🎉 STUDENT 10% OFF"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "success.main",
                        color: "#fff",
                        fontSize: 11,
                      }}
                    />
                  )}
                </Box>

                {/* CONTENT */}
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography fontWeight={600} noWrap>
                    {property.title}
                  </Typography>

                  {/*  PRICE */}
                  {isStudent ? (
                    <>
                      <Typography
                        sx={{
                          textDecoration: "line-through",
                          color: "text.secondary",
                          fontSize: 14,
                        }}
                      >
                        £{property.rent}
                      </Typography>

                      <Typography
                        color="success.main"
                        fontWeight={700}
                        fontSize={18}
                      >
                        £{discountedRent}
                      </Typography>
                    </>
                  ) : (
                    <Typography color="primary" fontWeight={700}>
                      £{property.rent}
                    </Typography>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    mb={2}
                  >
                    {property.area?.location_name}, {property.postcode}
                  </Typography>

                  {/* BUTTON */}
                  <Box mt="auto">
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      onClick={() =>
                        navigate(`/property-owner-detail/${property._id}`)
                      }
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
