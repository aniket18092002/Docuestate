import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SettingsPage() {
  const [form, setForm] = useState({
    siteName: "",
    logo: "",
    homeBanner: "",
    footerWeb: {
      address: "",
      email: "",
      description: "",
      phone: "",
      copyright: "",
      properties: [],
      cities: [],
    },
    whyChooseUs: {
      title: "",
      description: "",
      points: [],
      images: [],
    },
    about: {
      title: "",
      description: "",
    },
  });

  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  //  REQUIRED STATE (MISSING EARLIER)
  const [whyImages, setWhyImages] = useState([null, null, null, null]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const res = await axios.get("http://localhost:5000/api/settings");
    if (res.data) {
      setForm(res.data);

      //  Sync images with preview state
      setWhyImages([null, null, null, null]);
    }
  };

  //  FIXED SAVE FUNCTION
  const saveSettings = async () => {
    try {
      const formData = new FormData();

      // BASIC
      formData.append("siteName", form.siteName);

      // LOGO & BANNER
      if (logoFile) formData.append("logo", logoFile);
      if (bannerFile) formData.append("homeBanner", bannerFile);

      // WHY CHOOSE US
      formData.append("whyTitle", form.whyChooseUs.title);
      formData.append("whyDescription", form.whyChooseUs.description);
      formData.append(
        "whyPoints",
        JSON.stringify(form.whyChooseUs.points)
      );

      whyImages.forEach((img) => {
        if (img) formData.append("whyImages", img);
      });

      // ABOUT
      formData.append("aboutTitle", form.about.title);
      formData.append("aboutDescription", form.about.description);

      // FOOTER
      formData.append("footerWebAddress", form.footerWeb.address);
      formData.append("footerWebEmail", form.footerWeb.email);
      formData.append("footerWebDescription", form.footerWeb.description);
      formData.append("footerWebPhone", form.footerWeb.phone);
      formData.append("footerWebCopyright", form.footerWeb.copyright);
      formData.append(
        "footerWebProperties",
        JSON.stringify(form.footerWeb.properties)
      );
      formData.append(
        "footerWebCities",
        JSON.stringify(form.footerWeb.cities)
      );

      await axios.post("http://localhost:5000/api/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Settings updated successfully");
      loadSettings();
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Website Settings</Typography>
      </Paper>

      {/* BASIC */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          label="Website Name"
          value={form.siteName}
          onChange={(e) =>
            setForm({ ...form, siteName: e.target.value })
          }
        />
      </Paper>

      {/* LOGO + HOME IMAGE */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>App Logo</Typography>
            <Avatar
              src={form.logo ? `http://localhost:5000${form.logo}` : ""}
              sx={{ width: 120, height: 120, mb: 2 }}
              variant="rounded"
            />
            <Button component="label" variant="outlined">
              Upload Logo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
              />
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>Home Banner</Typography>
            {form.homeBanner && (
              <img
                src={`http://localhost:5000${form.homeBanner}`}
                alt="banner"
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
            )}
            <Button component="label" variant="outlined">
              Upload Banner
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files[0])}
              />
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* WHY CHOOSE US */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography fontWeight={600}>Why Choose Us</Typography>

        <TextField
          fullWidth
          label="Title"
          sx={{ mt: 2 }}
          value={form.whyChooseUs.title}
          onChange={(e) =>
            setForm({
              ...form,
              whyChooseUs: {
                ...form.whyChooseUs,
                title: e.target.value,
              },
            })
          }
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          sx={{ mt: 2 }}
          value={form.whyChooseUs.description}
          onChange={(e) =>
            setForm({
              ...form,
              whyChooseUs: {
                ...form.whyChooseUs,
                description: e.target.value,
              },
            })
          }
        />

        {/* BULLET POINTS */}
        <Typography fontWeight={600} mt={3}>
          Bullet Points
        </Typography>

        {form.whyChooseUs.points.map((point, index) => (
          <Box key={index} display="flex" gap={1} mt={1}>
            <TextField
              fullWidth
              value={point}
              onChange={(e) => {
                const updated = [...form.whyChooseUs.points];
                updated[index] = e.target.value;
                setForm({
                  ...form,
                  whyChooseUs: {
                    ...form.whyChooseUs,
                    points: updated,
                  },
                });
              }}
            />
            <IconButton
              color="error"
              onClick={() => {
                const updated = form.whyChooseUs.points.filter(
                  (_, i) => i !== index
                );
                setForm({
                  ...form,
                  whyChooseUs: {
                    ...form.whyChooseUs,
                    points: updated,
                  },
                });
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Button
          startIcon={<AddIcon />}
          sx={{ mt: 1 }}
          onClick={() =>
            setForm({
              ...form,
              whyChooseUs: {
                ...form.whyChooseUs,
                points: [...form.whyChooseUs.points, ""],
              },
            })
          }
        >
          Add Bullet Point
        </Button>

        {/* IMAGES */}
        <Typography fontWeight={600} mt={4}>
          Images (4)
        </Typography>

        <Grid container spacing={2} mt={1}>
          {[0, 1, 2, 3].map((i) => {
            const localFile = whyImages[i];
            const dbImage = form.whyChooseUs?.images?.[i];

            return (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Button
                  fullWidth
                  component="label"
                  variant="outlined"
                  sx={{
                    height: 140,
                    p: 0,
                    overflow: "hidden",
                  }}
                >
                  {/* ✅ PRIORITY:
              1. Local selected image
              2. Saved DB image
              3. Upload placeholder
          */}
                  {localFile ? (
                    <img
                      src={URL.createObjectURL(localFile)}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : dbImage ? (
                    <img
                      src={`http://localhost:5000${dbImage}`}
                      alt="saved"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Typography color="text.secondary">
                      Upload Image
                    </Typography>
                  )}

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const updated = [...whyImages];
                      updated[i] = e.target.files[0];
                      setWhyImages(updated);
                    }}
                  />
                </Button>
              </Grid>
            );
          })}
        </Grid>

      </Paper>

      {/* ABOUT */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography fontWeight={600}>About</Typography>

        <TextField
          fullWidth
          label="Title"
          value={form.about.title}
          onChange={(e) =>
            setForm({
              ...form,
              about: { ...form.about, title: e.target.value },
            })
          }
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          sx={{ mt: 2 }}
          label="Description"
          value={form.about.description}
          onChange={(e) =>
            setForm({
              ...form,
              about: { ...form.about, description: e.target.value },
            })
          }
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography fontWeight={700} mb={2}>
          Footer Settings
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Address"
              value={form.footerWeb.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  footerWeb: {
                    ...form.footerWeb,
                    address: e.target.value,
                  },
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={form.footerWeb.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  footerWeb: {
                    ...form.footerWeb,
                    email: e.target.value,
                  },
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              value={form.footerWeb.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  footerWeb: {
                    ...form.footerWeb,
                    phone: e.target.value,
                  },
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Copyright"
              value={form.footerWeb.copyright}
              onChange={(e) =>
                setForm({
                  ...form,
                  footerWeb: {
                    ...form.footerWeb,
                    copyright: e.target.value,
                  },
                })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Footer Description"
              value={form.footerWeb.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  footerWeb: {
                    ...form.footerWeb,
                    description: e.target.value,
                  },
                })
              }
            />
          </Grid>
        </Grid>

        {/* FOOTER PROPERTIES */}
        <Typography fontWeight={600} mt={4}>
          Footer Properties
        </Typography>

        {form.footerWeb.properties.map((item, i) => (
          <Box key={i} display="flex" gap={1} mt={1}>
            <TextField
              fullWidth
              value={item}
              onChange={(e) => {
                const updated = [...form.footerWeb.properties];
                updated[i] = e.target.value;
                setForm({
                  ...form,
                  footerWeb: {
                    ...form.footerWeb,
                    properties: updated,
                  },
                });
              }}
            />
            <IconButton
              color="error"
              onClick={() =>
                setForm({
                  ...form,
                  footerWeb: {
                    ...form.footerWeb,
                    properties: form.footerWeb.properties.filter((_, x) => x !== i),
                  },
                })
              }
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Button
          startIcon={<AddIcon />}
          sx={{ mt: 1 }}
          onClick={() =>
            setForm({
              ...form,
              footerWeb: {
                ...form.footerWeb,
                properties: [...form.footerWeb.properties, ""],
              },
            })
          }
        >
          Add Property
        </Button>

        {/* FOOTER CITIES */}
        <Typography fontWeight={600} mt={4}>
          Footer Cities
        </Typography>

        {form.footerWeb.cities.map((city, i) => (
          <Box key={i} display="flex" gap={1} mt={1}>
            <TextField
              fullWidth
              value={city}
              onChange={(e) => {
                const updated = [...form.footerWeb.cities];
                updated[i] = e.target.value;
                setForm({
                  ...form,
                  footerWeb: {
                    ...form.footerWeb,
                    cities: updated,
                  },
                });
              }}
            />
            <IconButton
              color="error"
              onClick={() =>
                setForm({
                  ...form,
                  footerWeb: {
                    ...form.footerWeb,
                    cities: form.footerWeb.cities.filter((_, x) => x !== i),
                  },
                })
              }
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Button
          startIcon={<AddIcon />}
          sx={{ mt: 1 }}
          onClick={() =>
            setForm({
              ...form,
              footerWeb: {
                ...form.footerWeb,
                cities: [...form.footerWeb.cities, ""],
              },
            })
          }
        >
          Add City
        </Button>
      </Paper>

      {/* SAVE */}
      <Box textAlign="right">
        <Button variant="contained" onClick={saveSettings}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}
