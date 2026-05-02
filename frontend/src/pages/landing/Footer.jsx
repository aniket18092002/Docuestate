import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Footer() {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    loadFooter();
  }, []);

  const loadFooter = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/settings");
      setFooter(res.data?.footerWeb);
    } catch (err) {
      console.error("Footer load failed", err);
    }
  };

  if (!footer) return null;

  return (
    <Box sx={{ bgcolor: "#0b1d3a", color: "#fff", mt: 10 }}>
      <Container maxWidth="xl">
        <Grid container spacing={6} py={8}>

          {/* BRAND */}
          <Grid item xs={12} md={3}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              DocuEstate
            </Typography>
            <Typography fontSize={14} sx={{ opacity: 0.8 }}>
              {footer.description}
            </Typography>
          </Grid>

          {/* PROPERTIES */}
          <Grid item xs={12} md={3}>
            <Typography fontWeight={600} mb={2}>
              Properties
            </Typography>
            {footer.properties.map((item, i) => (
              <FooterLink key={i} text={item} />
            ))}
          </Grid>

          {/* CITIES */}
          <Grid item xs={12} md={3}>
            <Typography fontWeight={600} mb={2}>
              Properties in Cities
            </Typography>
            {footer.cities.map((city, i) => (
              <FooterLink key={i} text={city} />
            ))}
          </Grid>

          {/* SUBSCRIBE */}
          <Grid item xs={12} md={3}>
            <Typography fontWeight={600} mb={2}>
              Subscribe
            </Typography>
            <Typography fontSize={14} sx={{ opacity: 0.8 }} mb={2}>
              Get the latest property updates.
            </Typography>

            <TextField
              size="small"
              placeholder="Your email"
              sx={{ bgcolor: "#fff", borderRadius: 1, mb: 2, width: "100%" }}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ bgcolor: "#4b83b6" }}
            >
              Subscribe
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        {/* BOTTOM */}
        <Box
          sx={{
            py: 3,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
          }}
        >
          <Typography fontSize={13} sx={{ opacity: 0.8 }}>
            {footer.copyright}
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            <FooterLink text="About Us" />
            <FooterLink text="Careers" />
            <FooterLink text="Privacy Policy" />
            <FooterLink text="Terms & Conditions" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function FooterLink({ text }) {
  return (
    <Typography
      fontSize={14}
      sx={{
        mb: 1,
        cursor: "pointer",
        opacity: 0.8,
        "&:hover": { opacity: 1, textDecoration: "underline" },
      }}
    >
      {text}
    </Typography>
  );
}
