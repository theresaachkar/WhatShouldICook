import * as React from "react";
import {
  Stack,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function Browse() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function loadRecipes() {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/api/recipes");
        setRecipes(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  const filteredRecipes = React.useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return recipes;

    return recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(value)
    );
  }, [recipes, query]);

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
              Browse Recipes
            </Typography>
          </Stack>

          <Typography color="text.secondary">
            Explore available recipes. Sign in to save favorites, mark recipes as cooked, and use the weekly planner.
          </Typography>
        </Stack>
      </Paper>

      <TextField
        label="Search recipes"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type e.g. chicken"
        InputProps={{
          startAdornment: <SearchRoundedIcon sx={{ mr: 1, color: "text.secondary" }} />,
        }}
      />

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CircularProgress size={22} />
          <Typography color="text.secondary">Loading recipes...</Typography>
        </Stack>
      ) : null}

      {!loading && filteredRecipes.length === 0 ? (
        <Alert severity="info">No recipes found.</Alert>
      ) : null}

      <Grid container spacing={2}>
        {filteredRecipes.map((recipe) => (
          <Grid key={recipe.id} item xs={12} md={6} lg={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {recipe.title}
                  </Typography>

                  <Chip
                    icon={<AccessTimeRoundedIcon />}
                    label={`${recipe.minutes} min`}
                    size="small"
                    variant="outlined"
                    sx={{ alignSelf: "flex-start" }}
                  />

                  <Button
                    variant="contained"
                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                  >
                    View recipe
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}