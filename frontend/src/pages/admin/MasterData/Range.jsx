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
    TableCell,
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
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
    getRangeMasters,
    createRangeMaster,
    updateRangeMaster,
    updateRangeMasterStatus,
} from "../../../services/RangeMasterService";

export default function RangeMasterIndex() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    // menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [selected, setSelected] = useState(null);

    // modal
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    // form
    const [form, setForm] = useState({
        Range_name: "",
        description: "",
        status: "Active",
    });

    /* ================= LOAD DATA ================= */
    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const res = await getRangeMasters();
        setData(res);
    };

    /* ================= HANDLERS ================= */

    const openCreateModal = () => {
        setIsEdit(false);
        setForm({ Range_name: "", description: "", status: "Active" });
        setOpenModal(true);
    };

    const openEditModal = () => {
        setIsEdit(true);
        setForm({
            Range_name: selected.Range_name,
            description: selected.description,
            status: selected.status,
        });
        setOpenModal(true);
        setAnchorEl(null);
    };

    const handleSave = async () => {
        if (!form.Range_name.trim()) {
            alert("Range Name is required");
            return;
        }

        if (isEdit) {
            await updateRangeMaster(selected._id, form);
        } else {
            await createRangeMaster(form);
        }

        setOpenModal(false);
        load();
    };

    const toggleStatus = async () => {
        const newStatus =
            selected.status === "Active" ? "Inactive" : "Active";

        await updateRangeMasterStatus(selected._id, newStatus);
        setAnchorEl(null);
        load();
    };

    /* ================= FILTER ================= */

    const filtered = data.filter((i) =>
        i.Range_name.toLowerCase().includes(search.toLowerCase())
    );

    /* ================= UI ================= */

    return (
        <Box>
            {/* HEADER */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6">Range Masters</Typography>
                <Typography variant="caption">Home / Range Master</Typography>
            </Paper>

            {/* CONTENT */}
            <Paper sx={{ p: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography variant="h6">Range Master List</Typography>
                    <Button variant="contained" onClick={openCreateModal}>
                        Add Range Master
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
                                <TableCell>Range Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filtered.map((row, index) => (
                                <TableRow key={row._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.Range_name}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.status}
                                            color={
                                                row.status === "Active" ? "success" : "error"
                                            }
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
                        {selected?.status === "Active"
                            ? "Deactivate"
                            : "Activate"}
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
                    {isEdit ? "Edit Range Master" : "Add Range Master"}
                </DialogTitle>

                <DialogContent sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Range Name"
                        value={form.Range_name}
                        onChange={(e) =>
                            setForm({ ...form, Range_name: e.target.value })
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
