import * as React from "react";
import {
  Stack,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Autocomplete,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import BreakfastDiningRoundedIcon from "@mui/icons-material/BreakfastDiningRounded";
import LunchDiningRoundedIcon from "@mui/icons-material/LunchDiningRounded";
import DinnerDiningRoundedIcon from "@mui/icons-material/DinnerDiningRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import { api } from "../api/client";
import { useToast } from "../components/Toast";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const createEmptyPlan = () =>
  DAYS.map((day) => ({
    day,
    breakfast: "",
    lunch: "",
    dinner: "",
  }));

export default function Planner() {
  const { showToast } = useToast();

  const [plan, setPlan] = React.useState(createEmptyPlan());
  const [recipes, setRecipes] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const plannerRes = await api.get("/api/planner");
        const recipesRes = await api.get("/api/recipes");
        const favoritesRes = await api.get("/api/favorites");

        const loadedPlan =
          Array.isArray(plannerRes.data) && plannerRes.data.length === 7
            ? plannerRes.data.map((x) => ({
                day: x.day ?? "",
                breakfast: x.breakfast ?? "",
                lunch: x.lunch ?? "",
                dinner: x.dinner ?? "",
              }))
            : createEmptyPlan();

        setPlan(loadedPlan);
        setRecipes(Array.isArray(recipesRes.data) ? recipesRes.data : []);
        setFavorites(Array.isArray(favoritesRes.data) ? favoritesRes.data : []);
      } catch (e) {
        console.error("Planner load error:", e);

        if (e?.response) {
          setError(
            `Failed to load planner data. ${e.config?.url} returned status ${e.response.status}.`
          );
        } else {
          setError("Failed to load planner data. Check backend and endpoint URLs.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const recipeOptions = React.useMemo(() => {
    const favIds = new Set(favorites.map((x) => x.id));

    const favoriteOptions = favorites.map((x) => ({
      label: `⭐ ${x.title}`,
      value: x.title,
    }));

    const otherRecipeOptions = recipes
      .filter((x) => !favIds.has(x.id))
      .map((x) => ({
        label: x.title,
        value: x.title,
      }));

    return [...favoriteOptions, ...otherRecipeOptions];
  }, [recipes, favorites]);

  const updateMeal = (dayIndex, mealType, value) => {
    setPlan((prev) =>
      prev.map((row, index) =>
        index === dayIndex ? { ...row, [mealType]: value ?? "" } : row
      )
    );
  };

  const savePlan = async () => {
    setSaving(true);
    setError("");

    try {
      await api.put("/api/planner", plan);
      showToast("Weekly planner saved successfully ✅", "success");
    } catch (e) {
      console.error(e);
      setError("Failed to save planner.");
    } finally {
      setSaving(false);
    }
  };

  const clearPlan = async () => {
    const empty = createEmptyPlan();
    setPlan(empty);

    try {
      await api.put("/api/planner", empty);
      showToast("Weekly planner cleared 🗑️", "success");
      setError("");
    } catch (e) {
      console.error(e);
      setError("Failed to clear planner.");
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
          <Typography color="text.secondary">Loading planner...</Typography>
        </Stack>
      </Paper>
    );
  }

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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
        >
          <Stack spacing={1}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <CalendarMonthRoundedIcon color="primary" />
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                Weekly Planner
              </Typography>
            </Stack>

            <Typography color="text.secondary">
              Organize your meals from Monday to Sunday. Type your own ideas or choose from saved and favorite recipes.
            </Typography>
          </Stack>

          <Chip
            label="7-day plan"
            color="primary"
            variant="outlined"
            size="small"
          />
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
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Plan your week
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use recipes from your favorites or type custom meal ideas freely.
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              onClick={savePlan}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Plan"}
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={clearPlan}
            >
              Clear Plan
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Stack spacing={2.5}>
        {plan.map((row, index) => (
          <Paper
            key={row.day}
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
                  {row.day}
                </Typography>

                <Chip
                  label="3 meals"
                  size="small"
                  variant="outlined"
                />
              </Stack>

              <Divider />

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BreakfastDiningRoundedIcon color="primary" fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Breakfast
                      </Typography>
                    </Stack>

                    <Autocomplete
                      freeSolo
                      options={recipeOptions}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.label
                      }
                      value={row.breakfast}
                      onChange={(_, newValue) => {
                        if (typeof newValue === "string") {
                          updateMeal(index, "breakfast", newValue);
                        } else {
                          updateMeal(index, "breakfast", newValue?.value ?? "");
                        }
                      }}
                      inputValue={row.breakfast}
                      onInputChange={(_, newInputValue) =>
                        updateMeal(index, "breakfast", newInputValue)
                      }
                      ListboxProps={{
                        sx: {
                          fontSize: 16,
                          maxHeight: 320,
                          minWidth: 320,
                        },
                      }}
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          style={{
                            whiteSpace: "nowrap",
                            fontSize: "16px",
                            padding: "10px 14px",
                          }}
                        >
                          {option.label}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="Type or choose a recipe"
                        />
                      )}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LunchDiningRoundedIcon color="primary" fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Lunch
                      </Typography>
                    </Stack>

                    <Autocomplete
                      freeSolo
                      options={recipeOptions}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.label
                      }
                      value={row.lunch}
                      onChange={(_, newValue) => {
                        if (typeof newValue === "string") {
                          updateMeal(index, "lunch", newValue);
                        } else {
                          updateMeal(index, "lunch", newValue?.value ?? "");
                        }
                      }}
                      inputValue={row.lunch}
                      onInputChange={(_, newInputValue) =>
                        updateMeal(index, "lunch", newInputValue)
                      }
                      ListboxProps={{
                        sx: {
                          fontSize: 16,
                          maxHeight: 320,
                          minWidth: 320,
                        },
                      }}
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          style={{
                            whiteSpace: "nowrap",
                            fontSize: "16px",
                            padding: "10px 14px",
                          }}
                        >
                          {option.label}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="Type or choose a recipe"
                        />
                      )}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <DinnerDiningRoundedIcon color="primary" fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Dinner
                      </Typography>
                    </Stack>

                    <Autocomplete
                      freeSolo
                      options={recipeOptions}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.label
                      }
                      value={row.dinner}
                      onChange={(_, newValue) => {
                        if (typeof newValue === "string") {
                          updateMeal(index, "dinner", newValue);
                        } else {
                          updateMeal(index, "dinner", newValue?.value ?? "");
                        }
                      }}
                      inputValue={row.dinner}
                      onInputChange={(_, newInputValue) =>
                        updateMeal(index, "dinner", newInputValue)
                      }
                      ListboxProps={{
                        sx: {
                          fontSize: 16,
                          maxHeight: 320,
                          minWidth: 320,
                        },
                      }}
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          style={{
                            whiteSpace: "nowrap",
                            fontSize: "16px",
                            padding: "10px 14px",
                          }}
                        >
                          {option.label}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="Type or choose a recipe"
                        />
                      )}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 4,
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <RestaurantMenuRoundedIcon color="disabled" />
          <Typography variant="body2" color="text.secondary">
            Tip: favorite recipes appear first in the planner suggestions so they’re easier to reuse.
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
}