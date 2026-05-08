import * as React from "react";
import {
  Stack,
  Typography,
  Paper,
  Button,
  Alert,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import { api } from "../api/client";

export default function History() {
  const [items, setItems] = React.useState([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [removingId, setRemovingId] = React.useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const load = React.useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const res = await api.get("/api/history");
      setItems(res.data);
    } catch (e) {
      console.error(e);
      setError("Failed to load history. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const askRemove = (item) => {
    setSelectedItem(item);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedItem(null);
  };

  const confirmRemove = async () => {
    if (!selectedItem) return;

    try {
      setRemovingId(selectedItem.id);
      await api.delete(`/api/history/${selectedItem.id}`);
      await load();
      handleCloseDialog();
    } catch (e) {
      console.error(e);
      setError("Failed to delete history item.");
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
                <HistoryRoundedIcon color="primary" />
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  Cooking History
                </Typography>
              </Stack>

              <Typography color="text.secondary">
                Keep track of recipes you already cooked recently.
              </Typography>
            </Stack>

            <Chip
              label={`${items.length} item${items.length !== 1 ? "s" : ""}`}
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
              <Typography color="text.secondary">Loading history...</Typography>
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
              <RestaurantRoundedIcon color="disabled" sx={{ fontSize: 36 }} />

              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                No cooking history yet
              </Typography>

              <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
                Once you mark a recipe as cooked, it will appear here so you can track
                what you made recently.
              </Typography>
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

                  <Typography variant="body2" color="text.secondary">
                    Cooked on {new Date(x.cookedAt).toLocaleString()}
                  </Typography>
                </Stack>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={() => askRemove(x)}
                  disabled={removingId === x.id}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                >
                  {removingId === x.id ? "Removing..." : "Remove"}
                </Button>
              </Stack>
            </Paper>
          ))}
      </Stack>

      <Dialog open={openDeleteDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete history item?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedItem
              ? `Are you sure you want to delete "${selectedItem.title}" from your cooking history?`
              : "Are you sure you want to delete this history item?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmRemove}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}