import * as React from "react";
import {
  Stack,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppState";
import { api } from "../api/client";

export default function Suggestions() {
  const navigate = useNavigate();
  const { selectedIngredients } = useAppState();

  const [loading, setLoading] = React.useState(false);
  const [recipes, setRecipes] = React.useState([]);
  const [error, setError] = React.useState("");

  const ingredientIds = React.useMemo(
    () => selectedIngredients.map((x) => x.id).sort((a, b) => a - b),
    [selectedIngredients]
  );

  const idsKey = React.useMemo(() => ingredientIds.join(","), [ingredientIds]);

  const fetchSuggestions = React.useCallback(
    async (signal) => {
      if (ingredientIds.length === 0) {
        setRecipes([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await api.post(
          "/api/suggestions",
          {
            ingredientIds,
            allowMissing: 4,
            avoidLastDays: 7,
          },
          signal ? { signal } : undefined
        );

        setRecipes(res.data);
      } catch (err) {
        if (err?.code === "ERR_CANCELED") return;
        console.error(err);
        setError("Failed to load suggestions.");
      } finally {
        setLoading(false);
      }
    },
    [ingredientIds]
  );

  React.useEffect(() => {
    const controller = new AbortController();
    fetchSuggestions(controller.signal);
    return () => controller.abort();
  }, [idsKey, fetchSuggestions]);

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(242,141,53,0.10), rgba(217,119,6,0.06))",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Stack spacing={1}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <RestaurantMenuRoundedIcon color="primary" />
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                Suggestions
              </Typography>
            </Stack>

            <Typography color="text.secondary" sx={{ maxWidth: 700 }}>
              Discover recipes based on the ingredients you already have. We rank
              recipes by how well they match your selection and show what is still missing.
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
            <Button
              variant="outlined"
              startIcon={<TuneRoundedIcon />}
              onClick={() => navigate("/ingredients")}
            >
              Edit ingredients
            </Button>

            <Button
              variant="contained"
              startIcon={<RefreshRoundedIcon />}
              disabled={ingredientIds.length === 0 || loading}
              onClick={() => fetchSuggestions()}
            >
              Refresh
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
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Selected ingredients
            </Typography>

            <Chip
              label={`${selectedIngredients.length} selected`}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Stack>

          {selectedIngredients.length === 0 ? (
            <Alert severity="info">
              Select ingredients first to get recipe suggestions.
            </Alert>
          ) : (
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {selectedIngredients.map((ingredient) => (
                <Chip
                  key={ingredient.id}
                  label={ingredient.name}
                  sx={{ borderRadius: 999 }}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      {loading && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CircularProgress size={20} />
            <Typography color="text.secondary">
              Updating suggestions...
            </Typography>
          </Stack>
        </Paper>
      )}

      {!loading && ingredientIds.length > 0 && recipes.length > 0 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
        >
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Recommended recipes
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} found
          </Typography>
        </Stack>
      )}

      <Grid container spacing={2.5}>
        {recipes.map((r) => (
          <Grid key={r.id} item xs={12} md={6} lg={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1.5}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        lineHeight: 1.3,
                        flex: 1,
                      }}
                    >
                      {r.title}
                    </Typography>

                    <Chip
                      icon={<AccessTimeRoundedIcon />}
                      label={`${r.minutes} min`}
                      size="small"
                      color="default"
                      variant="outlined"
                    />
                  </Stack>

                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 0.8 }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Match score
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {r.match}/{r.total} ({r.matchPercent}%)
                      </Typography>
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={r.matchPercent}
                      sx={{
                        height: 8,
                        borderRadius: 999,
                      }}
                    />
                  </Box>

                  <Divider />

                  <Stack spacing={1}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Ingredient status
                    </Typography>

                    {r.missingIngredients?.length ? (
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        {r.missingIngredients.map((item) => (
                          <Chip
                            key={item}
                            icon={<ErrorOutlineRoundedIcon />}
                            label={item}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Chip
                        icon={<CheckCircleRoundedIcon />}
                        label="You already have everything"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ alignSelf: "flex-start" }}
                      />
                    )}
                  </Stack>

                  <Box sx={{ flexGrow: 1 }} />

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/recipes/${r.id}`)}
                    >
                      View recipe
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!loading && ingredientIds.length > 0 && recipes.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px dashed",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Stack spacing={1.5} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              No matching recipes found
            </Typography>

            <Typography color="text.secondary" sx={{ maxWidth: 500 }}>
              Try selecting different ingredients or adding a few more items to get
              better recipe suggestions.
            </Typography>

            <Button
              variant="outlined"
              onClick={() => navigate("/ingredients")}
            >
              Update ingredients
            </Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}