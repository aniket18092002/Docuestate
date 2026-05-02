import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <Box sx={{ py: 10, bgcolor: "#f7fafc" }}>
        <Container maxWidth="xl">
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{ color: "#2b6f84", mb: 2 }}
          >
            About DocuEstate
          </Typography>

          <Typography sx={{ maxWidth: 700, fontSize: 18, color: "#5f7d8a" }}>
            We are redefining real estate by connecting people with their dream
            properties through trust, transparency, and technology.
          </Typography>
        </Container>
      </Box>

      {/* MISSION */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} mb={2}>
              Our Mission
            </Typography>
            <Typography fontSize={17} color="text.secondary">
              At DocuEstate, our mission is to simplify property discovery,
              buying, renting, and selling by delivering verified listings,
              expert guidance, and seamless digital experiences.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box component="img"
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
              sx={{ width: "100%", borderRadius: 4 }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* VALUES */}
      <Box sx={{ bgcolor: "#f7fafc", py: 10 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight={700} mb={6} textAlign="center">
            Our Core Values
          </Typography>

          <Grid container spacing={4}>
            {[
              "Verified Properties",
              "Client-First Approach",
              "Transparency & Trust",
              "Expert Consultants",
            ].map((value) => (
              <Grid item xs={12} md={3} key={value}>
                <Card sx={{ textAlign: "center", p: 3 }}>
                  <CheckCircleIcon color="primary" fontSize="large" />
                  <CardContent>
                    <Typography fontWeight={600}>{value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* TEAM */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight={700} mb={6} textAlign="center">
          Meet Our Experts
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={3} key={i}>
              <Card sx={{ textAlign: "center", p: 4 }}>
                <Avatar
                  sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                />
                <Typography fontWeight={700}>Real Estate Expert</Typography>
                <Typography variant="body2" color="text.secondary">
                  Property Consultant
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
