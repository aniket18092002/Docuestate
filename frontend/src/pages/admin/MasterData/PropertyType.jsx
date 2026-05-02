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
    getPropertyTypes,
    createPropertyType,
    updatePropertyType,
    updatePropertyTypeStatus,
} from "../../../services/propertyTypeService";

export default function PropertyTypeIndex() {
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
        propertyType: "",
        description: "",
        status: "Active",
    });

    /* ================= FETCH ================= */
    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const res = await getPropertyTypes();
        setData(res);
    };

    /* ================= HANDLERS ================= */

    const openCreateModal = () => {
        setIsEdit(false);
        setForm({ propertyType: "", description: "", status: "Active" });
        setOpenModal(true);
    };

    const openEditModal = () => {
        setIsEdit(true);
        setForm({
            propertyType: selected.propertyType,
            description: selected.description,
            status: selected.status,
        });
        setOpenModal(true);
        setAnchorEl(null);
    };

    const handleSave = async () => {
        if (!form.propertyType.trim()) return alert("Property Type is required");

        if (isEdit) {
            await updatePropertyType(selected._id, form);
        } else {
            await createPropertyType(form);
        }

        setOpenModal(false);
        load();
    };

    const toggleStatus = async () => {
        const newStatus = selected.status === "Active" ? "Inactive" : "Active";
        await updatePropertyTypeStatus(selected._id, newStatus);
        setAnchorEl(null);
        load();
    };

    /* ================= FILTER ================= */

    const filtered = data.filter((i) =>
        i.propertyType.toLowerCase().includes(search.toLowerCase())
    );

    /* ================= UI ================= */

    return (
        <Box>
            {/* HEADER */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6">Property Types</Typography>
                <Typography variant="caption">Home / Property Type</Typography>
            </Paper>

            {/* CARD */}
            <Paper sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">Property Types</Typography>
                    <Button variant="contained" onClick={openCreateModal}>
                        Add Property Type
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
                                <TableCell>Property Type</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filtered.map((row, i) => (
                                <TableRow key={row._id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{row.propertyType}</TableCell>
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
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isEdit ? "Edit Property Type" : "Add Property Type"}
                </DialogTitle>

                <DialogContent sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Property Type"
                        value={form.propertyType}
                        onChange={(e) =>
                            setForm({ ...form, propertyType: e.target.value })
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
