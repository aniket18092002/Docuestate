import { Box, Container, Grid, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
export default function WhyChooseUsSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const navigate = useNavigate();
  const loadSettings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/settings");
      setData(res.data?.whyChooseUs);
    } catch (err) {
      console.error("Failed to load Why Choose Us", err);
    }
  };

  if (!data) return null; // or loader

  return (
    <Box sx={{ py: 12 }}>
      <Container maxWidth="xl">
        <Grid container spacing={10} alignItems="center">
          {/* LEFT – IMAGES */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
              }}
            >
              {(data.images || []).slice(0, 4).map((img, i) => (
                <motion.img
                  key={i}
                  src={`http://localhost:5000${img}`}
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                />
              ))}
            </Box>
          </Grid>

          {/* RIGHT – CONTENT */}
          <Grid item xs={12} md={6}>
            <Typography color="#4b83b6" fontWeight={600}>
              About Us
            </Typography>

            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: "#2b6f84", mb: 3 }}
            >
              {data.title}
            </Typography>

            <Typography sx={{ color: "#5f7d8a", mb: 4, fontSize: 18 }}>
              {data.description}
            </Typography>

            {(data.points || []).map((text, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                <Typography>{text}</Typography>
              </Box>
            ))}

            <Button
              variant="contained"
              sx={{ mt: 3, px: 4 }}
              onClick={() => navigate("/about")}
            >
              Learn More
            </Button>

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
