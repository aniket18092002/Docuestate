import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDashboardStats,
  getRecentUsers,
} from "../../services/dashboardService";

/* ================= DASHBOARD ================= */

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const statsRes = await getDashboardStats();
      const usersRes = await getRecentUsers();
      setStats(statsRes);
      setUsers(usersRes);
    } catch (error) {
      console.error("Dashboard load failed", error);
    }
  };

  return (
    <Box>
      {/* HEADER */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">Home / Dashboard</Typography>
      </Box>

      {/* STAT CARDS */}
      <Grid container spacing={3}>
        {stats && (
          <>
            <StatCard title="TOTAL PROPERTIES" value={stats.totalProperties} />
            <StatCard title="ACTIVE WEBSITE USERS" value={stats.activeUsers} />
            <StatCard title="DOCUESTATE USERS" value={stats.totalUsers} />
            <StatCard title="PENDING LISTINGS" value={stats.pendingListings} />
            <StatCard title="MONTH LISTINGS" value={stats.monthListings} />
            <StatCard title="MONTH USERS" value={stats.monthUsers} />
          </>
        )}
      </Grid>

      {/* QUICK ACTIONS */}
      <Typography variant="h6" mt={5} mb={2} fontWeight={600}>
        Quick Actions Panel
      </Typography>
      <Divider />

      <Grid container spacing={3} mt={2}>
        <ActionCard
          title="WEB USER MANAGEMENT"
          subtitle={`${stats?.totalUsers || 0} Users Registered`}
          left={stats?.activeUsers || 0}
          right={stats?.inactiveUsers || 0}
          leftText="Active Users"
          rightText="Inactive Users"
          btn1="Create User"
          btn2="View"
          btn1Path="/app/users/create"
          btn2Path="/app/users"
        />

        <ActionCard
          title="PROPERTY MANAGEMENT"
          subtitle={`${stats?.activeProperties || 0} Properties Live`}
          left={stats?.activeProperties || 0}
          right={stats?.pendingListings || 0}
          leftText="Active Properties"
          rightText="Pending"
          btn1="New Property"
          btn2="View"
          btn1Path="/app/properties/create"
          btn2Path="/app/all-properties"
        />
      </Grid>

      {/* RECENT USERS */}
      <Typography variant="h6" mt={6} mb={2} fontWeight={600}>
        Recent Registered Users
      </Typography>

      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: "#4b83b6" }}>
            <TableRow>
              {["#", "Name", "Email", "Mobile", "Role", "Date Joined"].map(
                (h) => (
                  <TableCell key={h} sx={{ color: "#fff", fontWeight: 600 }}>
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u, index) => (
              <TableRow key={u._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{u.fullName}</TableCell>
                <TableCell sx={{ color: "primary.main" }}>
                  {u.email}
                </TableCell>
                <TableCell>{u.phone || "-"}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      bgcolor: "#eee",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      display: "inline-block",
                    }}
                  >
                    {new Date(u.createdAt).toLocaleDateString()}
                  </Box>
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No recent users
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value }) {
  return (
    <Grid item xs={12} md={4}>
      <Paper
        sx={{
          p: 3,
          textAlign: "center",
          bgcolor: "#4b83b6",
          color: "#fff",
          borderRadius: 2,
        }}
      >
        <Typography fontWeight={600}>{title}</Typography>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      </Paper>
    </Grid>
  );
}

function ActionCard({
  title,
  subtitle,
  left,
  right,
  leftText,
  rightText,
  btn1,
  btn2,
  btn1Path,
  btn2Path,
}) {
  const navigate = useNavigate();

  return (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 3, bgcolor: "#4b83b6", color: "#fff" }}>
        <Typography fontWeight={700}>{title}</Typography>
        <Typography fontSize={14}>{subtitle}</Typography>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={6}>
            <Typography variant="h4">{left}</Typography>
            <Typography>{leftText}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h4">{right}</Typography>
            <Typography>{rightText}</Typography>
          </Grid>
        </Grid>

        <Box mt={3} display="flex" gap={2}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#fff", color: "#000" }}
            onClick={() => navigate(btn1Path)}
          >
            {btn1}
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#222" }}
            onClick={() => navigate(btn2Path)}
          >
            {btn2}
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
}
