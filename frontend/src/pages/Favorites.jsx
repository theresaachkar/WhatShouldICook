import * as React from "react";
import {
  Stack,
  Typography,
  Paper,
  Button,
  Alert,
  Chip,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function Favorites() {
  const navigate = useNavigate();
  const [items, setItems] = React.useState([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [removingId, setRemovingId] = React.useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedRecipe, setSelectedRecipe] = React.useState(null);

  const load = React.useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const res = await api.get("/api/favorites");
      setItems(res.data);
    } catch (e) {
      console.error(e);
      setError("Failed to load favorites. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const askRemove = (recipe) => {
    setSelectedRecipe(recipe);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedRecipe(null);
  };

  const confirmRemove = async () => {
    if (!selectedRecipe) return;

    try {
      setRemovingId(selectedRecipe.id);
      await api.delete(`/api/favorites/${selectedRecipe.id}`);
      await load();
      handleCloseDialog();
    } catch (e) {
      console.error(e);
      setError("Failed to remove favorite.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
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
                <FavoriteRoundedIcon color="primary" />
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  Favorites
                </Typography>
              </Stack>

              <Typography color="text.secondary">
                Save recipes you love and come back to them anytime.
              </Typography>
            </Stack>

            <Chip
              label={`${items.length} saved`}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Stack>
        </Paper>

        {error ? <Alert severity="error">{error}</Alert> : null}

        {loading ? (
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
              <Typography color="text.secondary">Loading favorites...</Typography>
            </Stack>
          </Paper>
        ) : null}

        {!loading && items.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "1px dashed",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Stack spacing={1.5} alignItems="center">
              <MenuBookRoundedIcon color="disabled" sx={{ fontSize: 36 }} />

              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                No favorites yet
              </Typography>

              <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
                Save recipes from the Suggestions or Recipe Details pages to build your
                personal collection.
              </Typography>

              <Button variant="contained" onClick={() => navigate("/suggestions")}>
                Explore suggestions
              </Button>
            </Stack>
          </Paper>
        ) : null}

        {!loading &&
          items.map((x) => (
            <Paper
              key={x.id}
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
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={2}
              >
                <Stack spacing={1}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {x.title}
                  </Typography>

                  <Box>
                    <Chip
                      icon={<AccessTimeRoundedIcon />}
                      label={`${x.minutes} min`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                >
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => navigate(`/recipes/${x.id}`)}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    View recipe
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineRoundedIcon />}
                    onClick={() => askRemove(x)}
                    disabled={removingId === x.id}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    {removingId === x.id ? "Removing..." : "Remove"}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
      </Stack>

      <Dialog open={openDeleteDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Remove favorite?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedRecipe
              ? `Are you sure you want to remove "${selectedRecipe.title}" from your favorites?`
              : "Are you sure you want to remove this recipe from your favorites?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmRemove}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}