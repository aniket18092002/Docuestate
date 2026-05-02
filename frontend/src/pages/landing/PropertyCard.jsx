import { Card, CardMedia, CardContent, Typography, Chip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PropertyCard({
  title,
  price,
  originalPrice,
  image,
  propertyId,
  isStudent,
}) {
  const navigate = useNavigate();

  return (
    <Card sx={{ cursor: "pointer" }} onClick={() => navigate(`/property-owner-detail/${propertyId}`)}>
      <CardMedia component="img" height="200" image={image} />

      <CardContent>
        <Typography variant="h6">{title}</Typography>

        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <Typography variant="h6" color="primary">
            {price}
          </Typography>

          {isStudent && originalPrice && (
            <Typography
              variant="body2"
              sx={{ textDecoration: "line-through", color: "gray" }}
            >
              {originalPrice}
            </Typography>
          )}
        </Box>

        {isStudent && (
          <Chip
            label="🎉 10% OFF Student Discount"
            color="success"
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>
    </Card>
  );
}
