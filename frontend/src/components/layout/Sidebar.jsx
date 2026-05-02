import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";
import PeopleIcon from '@mui/icons-material/People';
import { NavLink } from "react-router-dom";
import DatasetIcon from '@mui/icons-material/Dataset';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AreaChartIcon from '@mui/icons-material/AreaChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
export default function Sidebar({ collapsed }) {
  const [userroles, setUserRoles] = useState(false);
  const [masterdata, setMaster] = useState(false);

  const [openSetting, setOpenSetting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const isAdmin = role === "admin";

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 70 : 220,
        "& .MuiDrawer-paper": {
          width: collapsed ? 70 : 220,
          boxSizing: "border-box",
          zIndex: 1200, // LESS THAN HEADER
        },
      }}
    >

      <List sx={{ mt: 8 }}>
        {/* ================= ADMIN FULL MENU ================= */}
        {isAdmin && (
          <>
            <SidebarItem
              to="/app/dashboard"
              icon={<DashboardIcon />}
              text="Dashboard"
              collapsed={collapsed}
            />

            {/* PROPERTIES */}
            <ListItemButton onClick={() => setOpenSetting(!openSetting)}>
              <ListItemIcon>
                <AreaChartIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Properties" />}
              {!collapsed && <ExpandMoreIcon />}
            </ListItemButton>

            <Collapse in={openSetting && !collapsed}>
              <List component="div" disablePadding>
                <ListItemButton
                  component={NavLink}
                  to="/app/all-properties"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <CircleIcon sx={{ fontSize: 8 }} />
                  </ListItemIcon>
                  <ListItemText primary="All Properties" />
                </ListItemButton>

                <ListItemButton
                  component={NavLink}
                  to="/app/property-list"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <CircleIcon sx={{ fontSize: 8 }} />
                  </ListItemIcon>
                  <ListItemText primary="Listed Properties" />
                </ListItemButton>
              </List>
            </Collapse>



            {/* MASTER DATA */}
            <ListItemButton onClick={() => setMaster(!masterdata)}>
              <ListItemIcon>
                <DatasetIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Master Data" />}
              {!collapsed && <ExpandMoreIcon />}
            </ListItemButton>

            <Collapse in={masterdata && !collapsed}>
              <List component="div" disablePadding>
                {[
                  { label: "Property Type", path: "/app/property-type" },
                  { label: "Location master", path: "/app/location-master" },
                  // { label: "Range Master", path: "/app/range-master" },
                ].map((item) => (
                  <ListItemButton
                    key={item.label}
                    component={NavLink}
                    to={item.path}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <CircleIcon sx={{ fontSize: 8 }} />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
            <SidebarItem
              to="/app/web-users-list"
              icon={<FormatListBulletedIcon />}
              text="WebSite Users"
              collapsed={collapsed}
            />
            {/* USERS & ROLES */}
            <ListItemButton onClick={() => setUserRoles(!userroles)}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Users & Roles" />}
              {!collapsed && <ExpandMoreIcon />}
            </ListItemButton>

            <Collapse in={userroles && !collapsed}>
              <List component="div" disablePadding>
                {[
                  { label: "DocuEstate Users", path: "/app/users" },
                  // { label: "Role Management", path: "/app/setting/company" },
                ].map((item) => (
                  <ListItemButton
                    key={item.label}
                    component={NavLink}
                    to={item.path}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <CircleIcon sx={{ fontSize: 8 }} />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
            {/* <SidebarItem
              to="/app/report"
              icon={<InsertChartIcon />}
              text="Reports & Analytics"
              collapsed={collapsed}
            /> */}

            <SidebarItem
              to="/app/Setting"
              icon={<SettingsIcon />}
              text="Setting"
              collapsed={collapsed}
            />

          </>
        )}

        {/* ================= NON-ADMIN (OWNER / USER) ================= */}
        {!isAdmin && (
          <>
            <ListItemButton
              component={NavLink}
              to="/app/all-properties"
            >
              <ListItemIcon>
                <AreaChartIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="All Properties" />}
            </ListItemButton>
          </>
        )}
      </List>

    </Drawer>
  );
}

function SidebarItem({ to, icon, text, collapsed }) {
  return (
    <ListItemButton component={NavLink} to={to}>
      <ListItemIcon>{icon}</ListItemIcon>
      {!collapsed && <ListItemText primary={text} />}
    </ListItemButton>
  );
}
