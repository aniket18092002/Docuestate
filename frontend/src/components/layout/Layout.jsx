import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <Header onToggle={() => setCollapsed(!collapsed)} />

      {/* BODY */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar collapsed={collapsed} />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
