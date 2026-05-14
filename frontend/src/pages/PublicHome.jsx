import * as React from "react";
import {
  Stack,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { useNavigate } from "react-router-dom";

export default function PublicHome() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 5,
          textAlign: "center",
          background:
            "linear-gradient(135deg, rgba(242,141,53,0.14), rgba(217,119,6,0.06))",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <RestaurantMenuRoundedIcon color="primary" sx={{ fontSize: 54 }} />

          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            What Should I Cook?
          </Typography>

          <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
            Discover recipes based on ingredients you already have. Browse recipes as a guest,
            then sign in to save favorites, track cooking history, and plan your week.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button variant="contained" onClick={() => navigate("/ingredients")}>
              Start with ingredients
            </Button>

            <Button variant="outlined" onClick={() => navigate("/browse")}>
              Browse recipes
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack spacing={1}>
                <AutoAwesomeRoundedIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Smart Suggestions
                </Typography>
                <Typography color="text.secondary">
                  Select ingredients and get recipe matches with missing ingredients shown clearly.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack spacing={1}>
                <FavoriteRoundedIcon color="error" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Save Favorites
                </Typography>
                <Typography color="text.secondary">
                  Sign in to save recipes you love and revisit them anytime.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack spacing={1}>
                <CalendarMonthRoundedIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Weekly Planner
                </Typography>
                <Typography color="text.secondary">
                  Logged-in users can organize breakfast, lunch, and dinner for the full week.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}