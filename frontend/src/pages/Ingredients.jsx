import * as React from "react";
import {
  Stack,
  Typography,
  TextField,
  Chip,
  Paper,
  CircularProgress,
  Button,
  Divider,
  Alert,
  Box,
} from "@mui/material";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppState";
import { api } from "../api/client";

export default function Ingredients() {
  const navigate = useNavigate();

  const [query, setQuery] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const { selectedIngredients, setSelectedIngredients } = useAppState();

  const toggle = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.some((x) => x.id === ingredient.id)
        ? prev.filter((x) => x.id !== ingredient.id)
        : [...prev, ingredient]
    );
  };

  const clearAll = () => {
    setSelectedIngredients([]);
  };

  React.useEffect(() => {
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/api/ingredients", {
          params: query ? { search: query } : {},
        });

        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setError("Failed to load ingredients.");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [query]);

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(242,141,53,0.10), rgba(217,119,6,0.05))",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={1}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <RestaurantMenuRoundedIcon color="primary" />
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Ingredients
            </Typography>
          </Stack>

          <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
            Choose the ingredients you already have, then jump directly to smart
            recipe suggestions tailored to what’s in your kitchen.
          </Typography>
        </Stack>
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Search and select
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start typing to find ingredients quickly.
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.2}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <TextField
              label="Search ingredients"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type e.g. tomato"
              InputProps={{
                startAdornment: <SearchRoundedIcon sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              sx={{
                minWidth: { xs: "100%", sm: 300 },
                maxWidth: 420,
              }}
            />

            <Button
              variant="contained"
              startIcon={<AutoAwesomeRoundedIcon />}
              onClick={() => navigate("/suggestions")}
              disabled={selectedIngredients.length === 0}
            >
              Get Suggestions
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={1}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Inventory2RoundedIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Available Ingredients
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {loading ? <CircularProgress size={18} /> : null}
              <Chip
                label={`${items.length} shown`}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Stack>

          <Divider />

          {!loading && items.length === 0 ? (
            <Alert severity="info">
              No ingredients found. Try a different search term.
            </Alert>
          ) : (
            <Stack direction="row" flexWrap="wrap" gap={1.2}>
              {items.map((ing) => {
                const isSelected = selectedIngredients.some((x) => x.id === ing.id);

                return (
                  <Chip
                    key={ing.id}
                    label={ing.name}
                    clickable
                    color={isSelected ? "primary" : "default"}
                    variant={isSelected ? "filled" : "outlined"}
                    onClick={() => toggle(ing)}
                    sx={{
                      px: 0.8,
                      py: 2.4,
                      borderRadius: 999,
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  />
                );
              })}
            </Stack>
          )}
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
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
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircleRoundedIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Selected Ingredients
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`${selectedIngredients.length} selected`}
                size="small"
                color="primary"
                variant="outlined"
              />

              <Button
                size="small"
                color="error"
                startIcon={<DeleteSweepRoundedIcon />}
                onClick={clearAll}
                disabled={selectedIngredients.length === 0}
              >
                Clear all
              </Button>
            </Stack>
          </Stack>

          <Divider />

          {selectedIngredients.length === 0 ? (
            <Box
              sx={{
                p: 2,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Typography color="text.secondary">
                No ingredients selected yet. Choose a few ingredients above to start getting recipe suggestions.
              </Typography>
            </Box>
          ) : (
            <Stack direction="row" flexWrap="wrap" gap={1.2}>
              {selectedIngredients.map((ing) => (
                <Chip
                  key={ing.id}
                  label={ing.name}
                  onDelete={() => toggle(ing)}
                  color="primary"
                  sx={{
                    px: 0.8,
                    py: 2.4,
                    borderRadius: 999,
                    fontWeight: 700,
                  }}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}