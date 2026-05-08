import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthState";

const drawerWidth = 270;

export default function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(14px)",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: "72px !important",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            Welcome back{user?.name ? `, ${user.name}` : ""} 👋
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: { xs: 180, sm: 320, md: 500 },
            }}
          >
            Plan meals, save favorites, and make everyday cooking easier.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip
            label="Meal planner"
            size="small"
            variant="outlined"
            sx={{
              display: { xs: "none", md: "inline-flex" },
              fontWeight: 700,
            }}
          />

          <Avatar
            sx={{
              bgcolor: "primary.main",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(109, 76, 65, 0.18)",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.04)",
              },
            }}
            onClick={handleMenuOpen}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </Avatar>
        </Stack>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 16px 36px rgba(0,0,0,0.08)",
              overflow: "hidden",
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonRoundedIcon fontSize="small" color="primary" />
                <Typography sx={{ fontWeight: 700 }}>
                  {user?.name || "User"}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <EmailRoundedIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {user?.email || "No email"}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Divider />

          <MenuItem onClick={handleLogout} sx={{ py: 1.25 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LogoutRoundedIcon fontSize="small" />
              <Typography>Logout</Typography>
            </Stack>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}