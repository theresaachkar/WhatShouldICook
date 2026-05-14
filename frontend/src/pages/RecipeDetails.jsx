import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Stack,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from "@mui/material";

import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import { api } from "../api/client";
import { useToast } from "../components/Toast";
import { useAuth } from "../state/AuthState";

export default function RecipeDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { showToast } = useToast();

  const { isAuthenticated } = useAuth();

  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [savingFavorite, setSavingFavorite] = React.useState(false);
  const [markingCooked, setMarkingCooked] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get(`/api/recipes/${id}`);

        if (!cancelled) {
          setData(res.data);
        }
      } catch (e) {
        console.error(e);

        if (!cancelled) {
          setError("Recipe not found or backend not running.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const redirectToLogin = () => {
    showToast("Please login first 🔐", "info");
    navigate("/login");
  };

  const handleSaveFavorite = async () => {
    if (!data) return;

    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    try {
      setSavingFavorite(true);

      await api.post(`/api/favorites/${data.id}`);

      showToast("Saved to favorites ⭐", "success");
    } catch (e) {
      console.error(e);

      showToast(
        e?.response?.data?.message || "Failed to save to favorites.",
        "error"
      );
    } finally {
      setSavingFavorite(false);
    }
  };

  const handleMarkCooked = async () => {
    if (!data) return;

    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    try {
      setMarkingCooked(true);

      await api.post(`/api/history/${data.id}`);

      showToast("Marked as cooked ✅", "success");
    } catch (e) {
      console.error(e);

      showToast(
        e?.response?.data?.message || "Failed to mark recipe as cooked.",
        "error"
      );
    } finally {
      setMarkingCooked(false);
    }
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CircularProgress size={22} />
          <Typography color="text.secondary">
            Loading recipe...
          </Typography>
        </Stack>
      </Paper>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data) {
    return null;
  }

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {data.title}
            </Typography>

            <Chip
              icon={<AccessTimeRoundedIcon />}
              label={`${data.minutes} min`}
              color="primary"
              variant="outlined"
            />
          </Stack>

          {!isAuthenticated ? (
            <Alert
              severity="info"
              icon={<LoginRoundedIcon />}
            >
              Login to save favorites, track cooking history, and access your planner.
            </Alert>
          ) : null}
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Ingredients
          </Typography>

          <Divider />

          <Stack direction="row" flexWrap="wrap" gap={1.2}>
            {data.ingredients.map((ingredient) => (
              <Chip
                key={ingredient}
                label={ingredient}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Instructions
          </Typography>

          <Divider />

          <Typography
            sx={{
              whiteSpace: "pre-line",
              lineHeight: 1.9,
            }}
          >
            {data.instructions}
          </Typography>
        </Stack>
      </Paper>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
      >
        <Button
          variant="contained"
          startIcon={<FavoriteRoundedIcon />}
          onClick={handleSaveFavorite}
          disabled={savingFavorite}
        >
          {savingFavorite ? "Saving..." : "Save to Favorites"}
        </Button>

        <Button
          variant="outlined"
          startIcon={<HistoryRoundedIcon />}
          onClick={handleMarkCooked}
          disabled={markingCooked}
        >
          {markingCooked ? "Saving..." : "Mark as Cooked"}
        </Button>
      </Stack>
    </Stack>
  );
}