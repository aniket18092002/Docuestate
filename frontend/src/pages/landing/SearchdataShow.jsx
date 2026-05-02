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
import { useNavigate, useLocation } from "react-router-dom";
import { searchProperties } from "../../services/propertyService";

export default function SearchdataShow() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const isStudent = user?.role === "student";

  useEffect(() => {
    loadProperties();
  }, [location.search]);

  const loadProperties = async () => {
    const data = await searchProperties(location.search);
    setProperties(data.filter((p) => p.featured_image));
  };

  const getDiscountedPrice = (rent) =>
    isStudent ? Math.round(rent - rent * 0.1) : rent;

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} mb={5}>
          Search Results
        </Typography>

        {properties.length === 0 && (
          <Typography align="center" color="text.secondary">
            No properties found
          </Typography>
        )}

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
                sx={{ height: 430, display: "flex", flexDirection: "column" }}
              >
                {/* IMAGE */}
                <Box sx={{ position: "relative" }}>
                  <img
                    src={`http://localhost:5000${featuredImage.file}`}
                    alt={property.title}
                    style={{ width: "100%", height: 200, objectFit: "cover" }}
                  />

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

                  {/* 🎉 STUDENT DISCOUNT */}
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
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={600} noWrap>
                    {property.title}
                  </Typography>

                  {/* PRICE */}
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

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() =>
                      navigate(`/property-owner-detail/${property._id}`)
                    }
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
