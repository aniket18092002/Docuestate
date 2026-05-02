import {
    Box,
    Grid,
    Paper,
    Typography,
    Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
    getDashboardStats,
} from "../../../services/dashboardService";

// D:\DocuEstate\DE009\frontend\src\services\dashboardService.js

export default function ReportsAnalytics() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await getDashboardStats();
            setStats(res);
        } catch (err) {
            console.error("Failed to load reports", err);
        }
    };

    if (!stats) return null;

    return (
        <Box sx={{ p: 4 }}>
            {/* HEADER */}
            <Typography variant="h4" fontWeight={700} mb={1}>
                Reports & Analytics
            </Typography>
            <Typography color="text.secondary" mb={4}>
                Users & Properties overview
            </Typography>

            {/* ================= USERS REPORT ================= */}
            <Typography variant="h6" fontWeight={600} mb={2}>
                User Analytics
            </Typography>

            <Grid container spacing={3} mb={5}>
                <ReportCard title="Total Users" value={stats.totalUsers} />
                <ReportCard title="Active Users" value={stats.activeUsers} />
                <ReportCard title="Inactive Users" value={stats.inactiveUsers} />
                <ReportCard title="New Users (This Month)" value={stats.monthUsers} />
            </Grid>

            <Divider />

            {/* ================= PROPERTIES REPORT ================= */}
            <Typography variant="h6" fontWeight={600} mt={4} mb={2}>
                Property Analytics
            </Typography>

            <Grid container spacing={3}>
                <ReportCard title="Total Properties" value={stats.totalProperties} />
                <ReportCard title="Active Properties" value={stats.activeProperties} />
                <ReportCard title="Pending Properties" value={stats.pendingListings} />
                <ReportCard title="Monthly Listings" value={stats.monthListings} />
            </Grid>
        </Box>
    );
}

/* ================= SMALL CARD ================= */

function ReportCard({ title, value }) {
    return (
        <Grid item xs={12} md={3}>
            <Paper
                sx={{
                    p: 3,
                    borderRadius: 2,
                    textAlign: "center",
                }}
            >
                <Typography color="text.secondary" fontSize={14}>
                    {title}
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                    {value}
                </Typography>
            </Paper>
        </Grid>
    );
}
