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
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

import {
  getUsers,
  updateUserStatus,
} from "../../../services/userService";

/* ================= STYLED TABLE ================= */

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

/* ================= COMPONENT ================= */

export default function UsersIndex() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  /* ================= MENU HANDLERS ================= */

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openStatusConfirm = () => {
    handleMenuClose();
    setConfirmOpen(true);
  };

  /* ================= CONFIRM ACTION ================= */

  const handleConfirm = async () => {
    if (!selectedUser) return;

    const newStatus =
      selectedUser.status === "Active" ? "Inactive" : "Active";

    await updateUserStatus(selectedUser._id, newStatus);

    setConfirmOpen(false);
    setSelectedUser(null);
    fetchUsers();
  };

  /* ================= FILTER ================= */

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <Box>
      {/* HEADER */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          User Management
        </Typography>
        <Typography variant="caption">
          Home / User Management
        </Typography>
      </Paper>

      {/* CARD */}
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6">Users</Typography>
          <Button
            variant="contained"
            component={Link}
            to="/app/users/create"
          >
            Add User
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
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
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.map((user, index) => (
                <StyledTableRow key={user._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{user.fullName}</StyledTableCell>
                  <StyledTableCell>{user.email}</StyledTableCell>

                  <StyledTableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      color={
                        user.role === "admin"
                          ? "success"
                          : user.role === "student"
                          ? "warning"
                          : "primary"
                      }
                    />
                  </StyledTableCell>

                  <StyledTableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      color={
                        user.status === "Active" ? "success" : "error"
                      }
                    />
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, user)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}

              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found
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
        open={menuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => navigate(`/app/users/${selectedUser?._id}/view`)}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => navigate(`/app/users/${selectedUser?._id}/edit`)}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem onClick={openStatusConfirm}>
          <ListItemIcon>
            <Chip
              label={
                selectedUser?.status === "Active"
                  ? "Deactivate"
                  : "Activate"
              }
              size="small"
              color={
                selectedUser?.status === "Active"
                  ? "error"
                  : "success"
              }
            />
          </ListItemIcon>
          <ListItemText>
            {selectedUser?.status === "Active"
              ? "Deactivate User"
              : "Activate User"}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* CONFIRM DIALOG */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Confirm Action</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            {selectedUser?.status === "Active"
              ? "deactivate"
              : "activate"}{" "}
            this user?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
