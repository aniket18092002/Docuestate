import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  getLocationMasters,
  createLocationMaster,
  updateLocationMaster,
  updateLocationMasterStatus,
} from "../../../services/locationMasterService";

export default function LocationMasterIndex() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  /* MENU */
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(null);

  /* MODAL */
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  /* FORM */
  const [form, setForm] = useState({
    location_name: "",
    description: "",
    status: "Active",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getLocationMasters();
    setData(res);
  };

  /* ================= HANDLERS ================= */

  const openCreateModal = () => {
    setIsEdit(false);
    setForm({ location_name: "", description: "", status: "Active" });
    setOpenModal(true);
  };

  const openEditModal = () => {
    setIsEdit(true);
    setForm({
      location_name: selected.location_name,
      description: selected.description,
      status: selected.status,
    });
    setOpenModal(true);
    setAnchorEl(null);
  };

  const handleSave = async () => {
    if (!form.location_name.trim()) {
      alert("Location Name is required");
      return;
    }

    if (isEdit) {
      await updateLocationMaster(selected._id, form);
    } else {
      await createLocationMaster(form);
    }

    setOpenModal(false);
    load();
  };

  const toggleStatus = async () => {
    const newStatus = selected.status === "Active" ? "Inactive" : "Active";
    await updateLocationMasterStatus(selected._id, newStatus);
    setAnchorEl(null);
    load();
  };

  /* ================= FILTER ================= */
  const filtered = data.filter((i) =>
    i.location_name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <Box>
      {/* HEADER */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Location Masters</Typography>
        <Typography variant="caption">Home / Location Master</Typography>
      </Paper>

      {/* CARD */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Location Masters</Typography>
          <Button variant="contained" onClick={openCreateModal}>
            Add Location Master
          </Button>
        </Box>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        {/* TABLE */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Location Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((row, i) => (
                <TableRow key={row._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{row.location_name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === "Active" ? "success" : "error"}
                      size="small"
                    />
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

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ACTION MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={openEditModal}>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem onClick={toggleStatus}>
          <ListItemText>
            {selected?.status === "Active" ? "Deactivate" : "Activate"}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* MODAL */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEdit ? "Edit Location Master" : "Add Location Master"}
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Location Name"
            value={form.location_name}
            onChange={(e) =>
              setForm({ ...form, location_name: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              label="Status"
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
