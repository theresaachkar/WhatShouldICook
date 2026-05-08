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
  Stack,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { NavLink } from "react-router-dom";

const drawerWidth = 270;

const items = [
  { label: "Dashboard", icon: <DashboardIcon />, to: "/" },
  { label: "Ingredients", icon: <RestaurantMenuIcon />, to: "/ingredients" },
  { label: "Suggestions", icon: <AutoAwesomeIcon />, to: "/suggestions" },
  { label: "Favorites", icon: <FavoriteIcon />, to: "/favorites" },
  { label: "History", icon: <HistoryIcon />, to: "/history" },
  { label: "Weekly Planner", icon: <CalendarMonthIcon />, to: "/planner" },
];

export default function Sidebar() {
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
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,246,243,1) 100%)",
        },
      }}
    >
      <Toolbar sx={{ minHeight: "72px !important", px: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "white",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 10px 22px rgba(109, 76, 65, 0.24)",
            }}
          >
            <LunchDiningIcon />
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              What Should I Cook?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Smart meal planning 🍳
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Divider />

      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Chip
          label="Navigation"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 700 }}
        />
      </Box>

      <List sx={{ px: 1.5, py: 1 }}>
        {items.map((it) => (
          <ListItemButton
            key={it.to}
            component={NavLink}
            to={it.to}
            sx={{
              borderRadius: 3,
              my: 0.5,
              px: 1.5,
              py: 1.15,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(109, 76, 65, 0.06)",
              },
              "&.active": {
                bgcolor: "rgba(109, 76, 65, 0.10)",
                boxShadow: "inset 0 0 0 1px rgba(109, 76, 65, 0.08)",
                "& .MuiListItemIcon-root": {
                  color: "primary.main",
                },
                "& .MuiListItemText-primary": {
                  fontWeight: 800,
                  color: "text.primary",
                },
                "& .nav-arrow": {
                  opacity: 1,
                  transform: "translateX(0)",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: "text.secondary",
                transition: "color 0.2s ease",
              }}
            >
              {it.icon}
            </ListItemIcon>

            <ListItemText
              primary={it.label}
              primaryTypographyProps={{
                fontWeight: 600,
              }}
            />

            <ChevronRightRoundedIcon
              className="nav-arrow"
              sx={{
                fontSize: 18,
                color: "primary.main",
                opacity: 0,
                transform: "translateX(-4px)",
                transition: "all 0.2s ease",
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2 }}>
        <PaperLikeFooter />
      </Box>
    </Drawer>
  );
}

function PaperLikeFooter() {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px dashed",
        borderColor: "divider",
        bgcolor: "rgba(255,255,255,0.55)",
      }}
    >
      <Stack spacing={0.75}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Quick tip
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Select ingredients first, then go to Suggestions for smarter recipe matches.
        </Typography>
      </Stack>
    </Box>
  );
}