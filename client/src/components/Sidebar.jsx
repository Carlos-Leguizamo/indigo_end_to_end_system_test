import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    to: "/dashboard",
    icon: <DashboardIcon />,
  },
  { key: "clients",
    label: "Clientes",
    to: "/clients",
    icon: <PeopleIcon /> 
  },
  {
    key: "products",
    label: "Productos",
    to: "/products",
    icon: <InventoryIcon />,
  },
  { key: "sales",
    label: "Ventas", 
    to: "/sales",
    icon: <ShoppingCartIcon /> 
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main" }}></Avatar>
          <Box>
            <Typography variant="h6" noWrap>
              Indigo
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Panel de control
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider />

      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.key}
            component={Link}
            to={item.to}
            selected={location.pathname === item.to}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flex: 1 }} />
      <Divider />
      <List>
        <ListItemButton
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
