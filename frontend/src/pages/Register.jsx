import * as React from "react";
import {
  Stack,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthState";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background: "linear-gradient(180deg, #F8F6F3 0%, #F4F1EC 100%)",
      }}
    >
      <Stack
        spacing={2.5}
        sx={{
          width: "100%",
          maxWidth: 480,
          mx: "auto",
        }}
      >
        <Stack spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: 3.5,
              bgcolor: "primary.main",
              color: "white",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 12px 24px rgba(109, 76, 65, 0.22)",
            }}
          >
            <RestaurantMenuIcon />
          </Box>

          <Stack spacing={0.5} alignItems="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                textAlign: "center",
                lineHeight: 1.1,
              }}
            >
              What Should I Cook?
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ textAlign: "center", maxWidth: 360 }}
            >
              Create your account to save favorites, track cooking history, and plan meals more easily.
            </Typography>
          </Stack>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            width: "100%",
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
          }}
        >
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonAddAltRoundedIcon color="primary" />
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  Create Account
                </Typography>
              </Stack>

              <Typography color="text.secondary">
                Make your own account to save favorites, history, and weekly plans.
              </Typography>
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              autoFocus
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              helperText="Password must be at least 6 characters."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.4 }}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>

            <Divider />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              Already have an account?{" "}
              <Box
                component={RouterLink}
                to="/login"
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Login here
              </Box>
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}