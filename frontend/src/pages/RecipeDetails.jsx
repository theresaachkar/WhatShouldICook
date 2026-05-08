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
  Box,
  Divider,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { api } from "../api/client";
import { useToast } from "../components/Toast";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

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
        if (!cancelled) setData(res.data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Recipe not found or backend not running.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSaveFavorite = async () => {
    if (!data) return;

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
          <Typography color="text.secondary">Loading recipe details...</Typography>
        </Stack>
      </Paper>
    );
  }

  if (error) {
    return (
      <Stack spacing={2}>
        <Button
          variant="text"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate(-1)}
          sx={{ alignSelf: "flex-start" }}
        >
          Back
        </Button>

        <Alert severity="error">{error}</Alert>
      </Stack>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Stack spacing={3}>
      <Button
        variant="text"
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate(-1)}
        sx={{ alignSelf: "flex-start" }}
      >
        Back
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(242,141,53,0.10), rgba(217,119,6,0.05))",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                {data.title}
              </Typography>

              <Typography color="text.secondary" sx={{ maxWidth: 650 }}>
                A simple recipe suggestion based on your available ingredients.
                Review the ingredients, follow the steps, and save it if you like it.
              </Typography>
            </Box>

            <Chip
              icon={<AccessTimeRoundedIcon />}
              label={`${data.minutes} minutes`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          </Stack>

          <Divider />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ pt: 0.5 }}
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
              startIcon={<CheckCircleRoundedIcon />}
              onClick={handleMarkCooked}
              disabled={markingCooked}
            >
              {markingCooked ? "Saving..." : "Mark as Cooked"}
            </Button>
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
          <Stack direction="row" spacing={1} alignItems="center">
            <RestaurantMenuRoundedIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Ingredients
            </Typography>
          </Stack>

          <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
            {data.ingredients.map((x) => (
              <Chip
                key={x}
                label={x}
                sx={{ borderRadius: 999 }}
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
          <Stack direction="row" spacing={1} alignItems="center">
            <MenuBookRoundedIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Instructions
            </Typography>
          </Stack>

          <Typography
            sx={{
              whiteSpace: "pre-line",
              lineHeight: 1.8,
              color: "text.primary",
            }}
          >
            {data.instructions}
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
}