import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthState";

const drawerWidth = 270;

export default function Topbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

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
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: "72px !important",
          px: 3,
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
            {isAuthenticated
              ? `Welcome back${user?.name ? `, ${user.name}` : ""} 👋`
              : "Welcome to What Should I Cook? 🍳"}
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
            {isAuthenticated
              ? "Plan meals, save favorites, and make everyday cooking easier."
              : "Browse recipes and discover meals using ingredients you already have."}
          </Typography>
        </Box>

        {isAuthenticated ? (
          <>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                fontWeight: 800,
                cursor: "pointer",
              }}
              onClick={handleMenuOpen}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Avatar>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem disabled>{user?.name || "User"}</MenuItem>
              <MenuItem disabled>{user?.email || "No email"}</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<LoginRoundedIcon />}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>

            <Button
              variant="contained"
              startIcon={<PersonAddRoundedIcon />}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}