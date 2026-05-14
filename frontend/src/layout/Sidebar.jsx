import * as React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LunchDiningRoundedIcon from "@mui/icons-material/LunchDiningRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";

import { NavLink } from "react-router-dom";
import { useAuth } from "../state/AuthState";

const drawerWidth = 270;

export default function Sidebar() {
  const { isAuthenticated } = useAuth();

  const publicItems = [
    { label: "Home", icon: <HomeRoundedIcon />, to: "/" },
    { label: "Browse", icon: <MenuBookRoundedIcon />, to: "/browse" },
    {
      label: "Ingredients",
      icon: <RestaurantMenuRoundedIcon />,
      to: "/ingredients",
    },
    {
      label: "Suggestions",
      icon: <AutoAwesomeRoundedIcon />,
      to: "/suggestions",
    },
  ];

  const loggedInPublicItems = [
    { label: "Browse", icon: <MenuBookRoundedIcon />, to: "/browse" },
    {
      label: "Ingredients",
      icon: <RestaurantMenuRoundedIcon />,
      to: "/ingredients",
    },
    {
      label: "Suggestions",
      icon: <AutoAwesomeRoundedIcon />,
      to: "/suggestions",
    },
  ];

  const privateItems = [
    {
      label: "Dashboard",
      icon: <DashboardRoundedIcon />,
      to: "/dashboard",
    },
    {
      label: "Favorites",
      icon: <FavoriteRoundedIcon />,
      to: "/favorites",
    },
    {
      label: "History",
      icon: <HistoryRoundedIcon />,
      to: "/history",
    },
    {
      label: "Weekly Planner",
      icon: <CalendarMonthRoundedIcon />,
      to: "/planner",
    },
  ];

  const items = isAuthenticated
    ? [...loggedInPublicItems, ...privateItems]
    : publicItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(0,0,0,0.06)",
          bgcolor: "#FFFDFB",
        },
      }}
    >
      <Toolbar sx={{ minHeight: "72px !important" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "white",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 8px 18px rgba(109, 76, 65, 0.25)",
            }}
          >
            <LunchDiningRoundedIcon />
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                lineHeight: 1.1,
              }}
            >
              What Should I Cook?
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Smart meal planning 🍳
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Divider />

      {!isAuthenticated ? (
        <Box sx={{ px: 2, pt: 2 }}>
          <Chip label="Guest mode" color="primary" variant="outlined" />
        </Box>
      ) : null}

      <List sx={{ px: 1.5, py: 1.5 }}>
        {items.map((it) => (
          <ListItemButton
            key={it.to}
            component={NavLink}
            to={it.to}
            sx={{
              borderRadius: 3,
              my: 0.5,
              px: 1.5,
              py: 1.1,
              "&.active": {
                bgcolor: "rgba(109, 76, 65, 0.10)",
                "& .MuiListItemIcon-root": {
                  color: "primary.main",
                },
                "& .MuiListItemText-primary": {
                  fontWeight: 800,
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{it.icon}</ListItemIcon>
            <ListItemText primary={it.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 4,
            bgcolor: "rgba(109, 76, 65, 0.05)",
            border: "1px dashed rgba(109, 76, 65, 0.20)",
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
            Quick tip 💡
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Select ingredients first, then go to Suggestions for smarter recipe matches.
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}