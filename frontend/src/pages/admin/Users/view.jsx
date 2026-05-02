import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../../../services/userService";

export default function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await getUserById(id);
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  };

  if (!user) return null;

  return (
    <Box>
      {/* PAGE HEADER */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          DocuEstate User Management
        </Typography>
        <Typography variant="caption">
          Home / DocuEstate User Management
        </Typography>
      </Paper>

      {/* VIEW TITLE */}
      <Paper sx={{ p: 2, mb: 3, textAlign: "center", bgcolor: "#f2f2f2" }}>
        <Typography variant="h6" fontWeight={600}>
          View
        </Typography>
      </Paper>

      {/* OVERVIEW */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={1}>
          Overview
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
              <TableCell>{user._id}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell>{user.fullName}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
              <TableCell>{user.phone || "-"}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell>
                {user.role === "admin"
                  ? "Admin"
                  : user.role === "student"
                  ? "Student"
                  : user.role}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell>{user.status || "Pending"}</TableCell>
            </TableRow>

            {/*  STUDENT DETAILS */}
            {user.role === "student" && (
              <>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>
                    College Name
                  </TableCell>
                  <TableCell>{user.collegeName || "-"}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>
                    University Name
                  </TableCell>
                  <TableCell>{user.universityName || "-"}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Student ID
                  </TableCell>
                  <TableCell>{user.studentId || "-"}</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>

        {/* BACK BUTTON */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            sx={{ width: 120 }}
            onClick={() => navigate("/app/users")}
          >
            Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
