// src/components/common/StatCard.jsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatCard({ title, value, subtitle, sx }) {
  return (
    <Card elevation={2} sx={{ minWidth: 180, ...sx }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Box display="flex" alignItems="baseline" justifyContent="space-between" mt={1}>
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
        </Box>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" mt={1}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
