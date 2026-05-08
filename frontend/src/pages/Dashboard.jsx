import * as React from "react";
import {
  Stack,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAppState } from "../state/AppState";

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedIngredients } = useAppState();

  const [favorites, setFavorites] = React.useState([]);
  const [history, setHistory] = React.useState([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboardData() {
      setError("");
      setLoading(true);

      try {
        const [favRes, historyRes] = await Promise.all([
          api.get("/api/favorites"),
          api.get("/api/history"),
        ]);

        setFavorites(Array.isArray(favRes.data) ? favRes.data : []);
        setHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
      } catch (e) {
        console.error(e);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const cookedThisWeek = React.useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    return history.filter((item) => new Date(item.cookedAt) >= sevenDaysAgo).length;
  }, [history]);

  const recentHistory = React.useMemo(() => {
    return [...history].slice(0, 5);
  }, [history]);

  const popularRecipes = React.useMemo(() => {
    const counts = {};

    history.forEach((item) => {
      if (!counts[item.title]) counts[item.title] = 0;
      counts[item.title] += 1;
    });

    return Object.entries(counts)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [history]);

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
          <Typography color="text.secondary">Loading dashboard...</Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
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
        <Stack spacing={1.2}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Dashboard 🍳
          </Typography>

          <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
            Welcome to your meal decision helper. Plan smarter, avoid repeating meals,
            and discover what to cook with what you already have.
          </Typography>
        </Stack>
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: "100%", borderRadius: 4 }}>
            <CardContent>
              <Stack spacing={1.2}>
                <RestaurantMenuIcon color="primary" />
                <Typography variant="overline" color="text.secondary">
                  Selected Ingredients
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {selectedIngredients.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingredients currently selected
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: "100%", borderRadius: 4 }}>
            <CardContent>
              <Stack spacing={1.2}>
                <FavoriteIcon color="error" />
                <Typography variant="overline" color="text.secondary">
                  Favorite Recipes
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {favorites.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recipes saved for later
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: "100%", borderRadius: 4 }}>
            <CardContent>
              <Stack spacing={1.2}>
                <HistoryIcon color="success" />
                <Typography variant="overline" color="text.secondary">
                  Cooked This Week
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {cookedThisWeek}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Meals marked as cooked in the last 7 days
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: "100%", borderRadius: 4 }}>
            <CardContent>
              <Stack spacing={1.2}>
                <TrendingUpIcon color="warning" />
                <Typography variant="overline" color="text.secondary">
                  Most Popular Now
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    minHeight: 40,
                    lineHeight: 1.25,
                  }}
                >
                  {popularRecipes.length > 0 ? popularRecipes[0].title : "-"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on your cooking history
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Quick Actions
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<RestaurantMenuIcon />}
                onClick={() => navigate("/ingredients")}
              >
                Select Ingredients
              </Button>
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AutoAwesomeIcon />}
                onClick={() => navigate("/suggestions")}
              >
                View Suggestions
              </Button>
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CalendarMonthIcon />}
                onClick={() => navigate("/planner")}
              >
                Open Weekly Planner
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FavoriteIcon />}
                onClick={() => navigate("/favorites")}
              >
                Go to Favorites
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => navigate("/history")}
              >
                Open Cooking History
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              height: "100%",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Favorite Recipes ⭐
                </Typography>
                <Button size="small" onClick={() => navigate("/favorites")}>
                  View all
                </Button>
              </Stack>

              <Divider />

              {favorites.length === 0 ? (
                <Alert severity="info">
                  No favorite recipes yet. Save recipes you love so they’re easy to revisit.
                </Alert>
              ) : (
                favorites.slice(0, 4).map((item) => (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    sx={{ p: 1.75, borderRadius: 3 }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Stack spacing={0.5}>
                        <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.minutes} min
                        </Typography>
                      </Stack>

                      <Button
                        size="small"
                        endIcon={<ArrowForwardRoundedIcon />}
                        onClick={() => navigate(`/recipes/${item.id}`)}
                      >
                        Open
                      </Button>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              height: "100%",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocalFireDepartmentRoundedIcon color="warning" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Most Popular Recipes
                </Typography>
              </Stack>

              <Divider />

              {popularRecipes.length === 0 ? (
                <Alert severity="info">
                  No cooking activity yet to calculate popularity.
                </Alert>
              ) : (
                popularRecipes.map((item, index) => (
                  <Paper
                    key={item.title}
                    variant="outlined"
                    sx={{ p: 1.75, borderRadius: 3 }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Stack spacing={0.5}>
                        <Typography sx={{ fontWeight: 700 }}>
                          {index + 1}. {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Cooked {item.count} time{item.count > 1 ? "s" : ""}
                        </Typography>
                      </Stack>

                      <Chip
                        label={`${item.count}x`}
                        color={index === 0 ? "primary" : "default"}
                        size="small"
                      />
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              height: "100%",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Recent Cooking Activity
              </Typography>

              <Divider />

              {recentHistory.length === 0 ? (
                <Alert severity="info">
                  No cooking activity yet. Mark a recipe as cooked to start building your history.
                </Alert>
              ) : (
                recentHistory.map((item) => (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    sx={{ p: 1.75, borderRadius: 3 }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Stack spacing={0.5}>
                        <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Cooked at {new Date(item.cookedAt).toLocaleString()}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              height: "100%",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LightbulbRoundedIcon color="warning" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Smart Tips & Ideas
                </Typography>
              </Stack>

              <Divider />

              <Alert severity="info">
                Select ingredients you already have, then jump directly to recipe suggestions.
              </Alert>

              <Alert severity="success">
                Use cooking history to avoid repeating meals too often.
              </Alert>

              <Alert severity="warning">
                Save your best meals to favorites so they’re easy to find later.
              </Alert>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>
                  Today’s idea
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try selecting 2 or 3 ingredients only. The system will still suggest recipes
                  and clearly show what ingredients are missing.
                </Typography>
              </Paper>

              <Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/suggestions")}
                >
                  Try suggestions now
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}