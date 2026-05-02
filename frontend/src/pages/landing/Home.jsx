import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import WhyChooseUsSection from "./WhyChooseUsSection";
import FeaturePropertySection from "./FeaturePropertySection";
import useSettings from "../../hooks/useSettings";
import SearchBar from "../landing/SearchBar";

export default function Home() {
  const settings = useSettings();
  return (
    <>
      {/* HERO SECTION */}
      <Box sx={{ bgcolor: "#fff", py: 6 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              alignItems: "center",
              gap: 6,
            }}
          >
            {/* LEFT CONTENT */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#2b6f84",
                  mb: 2,
                }}
              >
                Find Your <br /> Perfect Home
              </Typography>

              <Typography
                sx={{
                  color: "#4b8aa0",
                  fontSize: 18,
                  mb: 4,
                }}
              >
                We are helping your <br /> ideal need
              </Typography>


              {/* SEARCH BAR */}
              
               <SearchBar />
           
            </Box>

            {/* RIGHT IMAGE */}
            <Box
              component="img"
              src={
                settings?.homeBanner
                  ? `http://localhost:5000${settings.homeBanner}`
                  : "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
              }
              alt="Building"
              sx={{
                width: "100%",
                height: { xs: 280, md: 420 },
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          </Box>
        </Container>
        <WhyChooseUsSection />
        <FeaturePropertySection />
      </Box>
    </>
  );
}
