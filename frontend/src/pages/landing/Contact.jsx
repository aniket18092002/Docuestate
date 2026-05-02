import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

export default function Contact() {
  return (
    <Box sx={{ py: 8, backgroundColor: "#f7f9fc", minHeight: "70vh" }}>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          {/* HEADING */}
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            mb={1}
          >
            Contact Us
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={4}
          >
            Have questions about buying, selling or renting a property?
            <br />
            We’re here to help.
          </Typography>

          {/* FORM */}
          <Box>
            <TextField
              fullWidth
              label="Full Name"
              placeholder="Enter your name"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email Address"
              placeholder="Enter your email"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Message"
              placeholder="Write your message here..."
              multiline
              rows={4}
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                bgcolor: "#1e88e5",
                fontWeight: 600,
                py: 1.2,
                "&:hover": {
                  bgcolor: "#1565c0",
                },
              }}
            >
              Send Message
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
