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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

import {
  getAllProperties,
  updatePropertyStatus_listed,
} from "../../../services/propertyService";

/* ================= STATUS TABS ================= */

const STATUS_TABS = [
  { label: "All Properties", value: "ALL" },
  { label: "Pending Properties", value: "0" },
  { label: "Live Properties", value: "1" },
];

export default function PropertiesIndex() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [tab, setTab] = useState("ALL");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(null);

  const [openLiveDialog, setOpenLiveDialog] = useState(false);
  const [checkedAttachments, setCheckedAttachments] = useState([]);

  /* ================= FETCH ================= */

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const res = await getAllProperties();
    setProperties(res);
  };

  /* ================= FILTER ================= */

  const filtered = properties.filter((p) => p.status === "Active");

  const closeMenu = () => setAnchorEl(null);

  /* ================= ATTACHMENT HANDLER ================= */

  const toggleAttachment = (id) => {
    setCheckedAttachments((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const getFeaturedImage = (property) => {
    if (!property.featured_image || !property.attachments) return null;

    return property.attachments.find(
      (att) => att._id === property.featured_image
    );
  };

  /* ================= UI ================= */

  return (
    <Box>
      {/* HEADER */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Listed Properties
        </Typography>
        <Typography variant="caption">Home / Listed Properties</Typography>
      </Paper>

      {/* TABS */}
      {/* <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          {STATUS_TABS.map((t) => (
            <Tab key={t.value} label={t.label} value={t.value} />
          ))}
        </Tabs>
      </Paper> */}

      {/* TABLE */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Listing ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Area</TableCell>
                <TableCell>Postcode</TableCell>
                <TableCell>Rent</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Image</TableCell>
                {/* <TableCell align="center">Action</TableCell> */}
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.listingId}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.owner?.fullName || "-"}</TableCell>
                  <TableCell>{row.propertyType?.propertyType}</TableCell>
                  {/* <TableCell>{row.area}</TableCell> */}
                  <TableCell>{row.area?.location_name}</TableCell>
                  <TableCell>{row.postcode}</TableCell>
                  <TableCell>£ {row.rent}</TableCell>

                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      color={
                        row.status === "Live" || row.status === "Active"
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
                  <TableCell>
                    {(() => {
                      const featured = getFeaturedImage(row);

                      return featured ? (
                        <img
                          src={`http://localhost:5000${featured.file}`}
                          alt="featured"
                          style={{
                            width: 80,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid #ddd",
                          }}
                        />
                      ) : (
                        "-"
                      );
                    })()}
                  </TableCell>

                  {/* <TableCell align="center">
                    <IconButton
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setSelected(row);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ACTION MENU */}
      {/* <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={() => navigate(`/app/properties/${selected?._id}/view`)}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View
        </MenuItem>

        <MenuItem onClick={() => navigate(`/app/properties/${selected?._id}/edit`)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>

        {selected?.property_listed === "0" && (
          <MenuItem
            onClick={() => {
              setOpenLiveDialog(true);
              closeMenu();
            }}
          >
            <ChangeCircleIcon fontSize="small" sx={{ mr: 1 }} />
            Mark as Live
          </MenuItem>
        )}
      </Menu> */}

      {/* LIVE CONFIRM DIALOG */}
      <Dialog open={openLiveDialog} onClose={() => setOpenLiveDialog(false)}>
        <DialogTitle>Select Attachments</DialogTitle>

        <DialogContent>
          <List>
            {selected?.attachments?.map((att) => (
              <ListItem key={att._id} button onClick={() => toggleAttachment(att._id)}>
                <ListItemIcon>
                  <Checkbox checked={checkedAttachments.includes(att._id)} />
                </ListItemIcon>
                <ListItemText primary={att.fileName} />
              </ListItem>
            ))}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenLiveDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              await updatePropertyStatus_listed(selected._id, "1");
              setOpenLiveDialog(false);
              setCheckedAttachments([]);
              loadProperties();
            }}
          >
            Confirm Live
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
