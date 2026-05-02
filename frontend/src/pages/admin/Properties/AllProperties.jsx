import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

import { updatePropertyStatus } from "../../../services/propertyService";

/* ================= STATUS TABS ================= */

const STATUS_TABS = [
  { label: "All", value: "ALL" },
  
];

export default function PropertiesIndex() {
  const navigate = useNavigate();

  /* ================= STATE ================= */

  const [properties, setProperties] = useState([]);
  const [tab, setTab] = useState("ALL");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(null);

  /* ================= USER ================= */

  const user = JSON.parse(localStorage.getItem("user"));
  const isOwner = user?.role === "owner";
  const ownerId = user?.id;

  /* ================= FETCH ================= */

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      let res;

      if (isOwner && ownerId) {
        res = await axios.get(
          `http://localhost:5000/api/properties/owner/${ownerId}`
        );
      } else {
        res = await axios.get("http://localhost:5000/api/properties");
      }

      setProperties(res.data);
    } catch (error) {
      console.error("Failed to load properties", error);
    }
  };

  /* ================= HELPERS ================= */

  const normalize = (v) => v?.toString().toLowerCase();

  /* ================= FILTER + SEARCH ================= */

  let processed = properties.filter((p) => {
    // Status filter
    if (tab !== "ALL" && normalize(p.status) !== normalize(tab)) {
      return false;
    }

    // Search
    if (search) {
      const keyword = normalize(search);

      return (
        normalize(p.title).includes(keyword) ||
        normalize(p.postcode).includes(keyword) ||
        normalize(p.owner?.fullName).includes(keyword)
      );
    }

    return true;
  });

  /* ================= SORT ================= */

  processed.sort((a, b) => {
    switch (sortBy) {
      case "rent_low":
        return (a.rent || 0) - (b.rent || 0);

      case "rent_high":
        return (b.rent || 0) - (a.rent || 0);

      case "date_asc":
        return new Date(a.createdAt) - new Date(b.createdAt);

      case "date_desc":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  /* ================= MENU ================= */

  const closeMenu = () => {
    setAnchorEl(null);
    setSelected(null);
  };

  /* ================= UI ================= */

  return (
    <Box>
      {/* HEADER */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Property Management
        </Typography>
        <Typography variant="caption">Home / Properties</Typography>
      </Paper>

      {/* CREATE BUTTON */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={() => navigate("/app/properties/create")}
        >
          Create New Property
        </Button>
      </Box>

      {/* SEARCH + SORT */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {/* <TextField
          label="Search property..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}

        <TextField
          select
          size="small"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          label="Sort By"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="date_desc">Newest First</MenuItem>
          <MenuItem value="date_asc">Oldest First</MenuItem>
          <MenuItem value="rent_low">Rent: Low → High</MenuItem>
          <MenuItem value="rent_high">Rent: High → Low</MenuItem>
        </TextField>
      </Box>

      {/* TABS */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {STATUS_TABS.map((t) => {
            const count =
              t.value === "ALL"
                ? properties.length
                : properties.filter(
                    (p) =>
                      normalize(p.status) === normalize(t.value)
                  ).length;

            return (
              <Tab
                key={t.value}
                value={t.value}
                label={`${t.label} (${count})`}
              />
            );
          })}
        </Tabs>
      </Paper>

      {/* TABLE */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Listing ID</TableCell>
                <TableCell>Title</TableCell>
                {!isOwner && <TableCell>Owner</TableCell>}
                <TableCell>Type</TableCell>
                <TableCell>Area</TableCell>
                <TableCell>Postcode</TableCell>
                <TableCell>Rent</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {processed.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.listingId}</TableCell>
                  <TableCell>{row.title}</TableCell>

                  {!isOwner && (
                    <TableCell>{row.owner?.fullName || "-"}</TableCell>
                  )}

                  <TableCell>{row.propertyType?.propertyType || "-"}</TableCell>
                  <TableCell>{row.area?.location_name || "-"}</TableCell>
                  <TableCell>{row.postcode}</TableCell>
                  <TableCell>£ {row.rent}</TableCell>

                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      color={
                        row.status === "Active"
                          ? "success"
                          : row.status === "Pending"
                          ? "warning"
                          : row.status === "Rejected"
                          ? "error"
                          : "default"
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setSelected(row);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {processed.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No properties found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem
          onClick={() => {
            navigate(`/app/properties/${selected?._id}/view`);
            closeMenu();
          }}
        >
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View
        </MenuItem>

        {selected?.status === "Pending" && (
          <>
            <MenuItem
              onClick={() => {
                navigate(
                  `/app/data/property-listed-add/${selected?._id}/display`
                );
                closeMenu();
              }}
            >
              <ChangeCircleIcon fontSize="small" sx={{ mr: 1 }} />
              Activate
            </MenuItem>

            <MenuItem
              onClick={async () => {
                await updatePropertyStatus(selected._id, "Rejected");
                loadProperties();
                closeMenu();
              }}
            >
              <ChangeCircleIcon fontSize="small" sx={{ mr: 1 }} />
              Reject
            </MenuItem>

            <MenuItem
              onClick={() => {
                navigate(`/app/properties/${selected?._id}/edit`);
                closeMenu();
              }}
            >
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
}