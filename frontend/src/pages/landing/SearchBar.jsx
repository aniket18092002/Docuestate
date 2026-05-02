import {
  Box,
  Paper,
  Button,
  MenuItem,
  Select,
  FormControl,
  Popover,
  List,
  ListItemButton,
  Typography,
  Divider,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  // ================= STATE =================
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);
  const [ranges, setRanges] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    type: "",
  });

  const [minRent, setMinRent] = useState(null);
  const [maxRent, setMaxRent] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState("min");

  const navigate = useNavigate();

  // ================= LOAD DATA =================
  useEffect(() => {
    loadMasters();
  }, []);

  const loadMasters = async () => {
    const [loc, type, range] = await Promise.all([
      axios.get("http://localhost:5000/api/location-masters"),
      axios.get("http://localhost:5000/api/property-types"),
      axios.get("http://localhost:5000/api/properties/rent-ranges"),
    ]);

    setLocations(loc.data);
    setTypes(type.data);
    setRanges(range.data);
  };

  // ================= AUTOCOMPLETE =================
  const fetchSuggestions = async (value) => {
    if (!value) return setSuggestions([]);
    const res = await axios.get(
      `http://localhost:5000/api/properties/search-suggestions?q=${value}`
    );
    setSuggestions(res.data);
  };

  // ================= PRICE OPTIONS =================
  const minOptions = [...new Set(ranges.map((r) => r.min))].sort((a, b) => a - b);

  const maxOptions = ranges
    .filter((r) => !minRent || r.max >= minRent)
    .map((r) => r.max)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => a - b);

  // ================= SEARCH =================
  const handleSearch = () => {
    const query = new URLSearchParams({
      keyword: filters.keyword || "",
      location: filters.location || "",
      type: filters.type || "",
      min: minRent || "",
      max: maxRent || "",
    }).toString();

    navigate(`/property-search-data-show-detail?${query}`);
  };

  // ================= UI =================
  return (
    <Box sx={{ py: 3 }}>
      <Paper
        elevation={6}
        sx={{
          mx: "auto",
          maxWidth: 1200,
          height: 72,
          display: "flex",
          alignItems: "center",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        {/* 🔍 KEYWORD AUTOCOMPLETE */}
        <Autocomplete
          freeSolo
          options={suggestions}
          getOptionLabel={(o) => o.title || ""}
          onInputChange={(e, value) => {
            setFilters({ ...filters, keyword: value });
            fetchSuggestions(value);
          }}
          onChange={(e, value) => {
            if (value?.title) {
              navigate(`/properties?keyword=${value.title}`);
            }
          }}
          sx={{ flex: 1 }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Enter location "
              variant="standard"
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
              }}
              sx={{ px: 3 }}
            />
          )}
        />

        <Divider orientation="vertical" flexItem />

        {/*  LOCATION */}
        <FormControl sx={{ minWidth: 160 }}>
          <Select
            value={filters.location}
            displayEmpty
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            sx={{ height: 72, px: 2, bgcolor: "#4b83b6", color: "#fff" }}
          >
            <MenuItem value="">Location</MenuItem>
            {locations.map((l) => (
              <MenuItem key={l._id} value={l._id}>
                {l.location_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/*  HOME TYPE */}
        <FormControl sx={{ minWidth: 160 }}>
          <Select
            value={filters.type}
            displayEmpty
            onChange={(e) =>
              setFilters({ ...filters, type: e.target.value })
            }
            sx={{ height: 72, px: 2, bgcolor: "#4b83b6", color: "#fff" }}
          >
            <MenuItem value="">Home Type</MenuItem>
            {types.map((t) => (
              <MenuItem key={t._id} value={t._id}>
                {t.propertyType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* PRICE */}
        <Button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ height: 72, px: 4, bgcolor: "#4b83b6", color: "#fff" }}
        >
          {minRent && maxRent ? `£${minRent} - £${maxRent}` : "Price"}
        </Button>

        {/*  SEARCH */}
        <Button
          onClick={handleSearch}
          sx={{ height: 72, px: 5, bgcolor: "#0b1d3a", color: "#fff" }}
        >
          SEARCH
        </Button>
      </Paper>

      {/* PRICE POPOVER */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box sx={{ width: 240, p: 1 }}>
          <Box sx={{ display: "flex", mb: 1 }}>
            <Button
              fullWidth
              variant={activeTab === "min" ? "contained" : "outlined"}
              onClick={() => setActiveTab("min")}
            >
              Min Price
            </Button>
            <Button
              fullWidth
              variant={activeTab === "max" ? "contained" : "outlined"}
              onClick={() => setActiveTab("max")}
              disabled={!minRent}
            >
              Max Price
            </Button>
          </Box>

          <List dense>
            {(activeTab === "min" ? minOptions : maxOptions).map((val) => (
              <ListItemButton
                key={val}
                onClick={() => {
                  if (activeTab === "min") {
                    setMinRent(val);
                    setActiveTab("max");
                  } else {
                    setMaxRent(val);
                    setAnchorEl(null);
                  }
                }}
              >
                <Typography>£{val}</Typography>
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Popover>
    </Box>
  );
}
