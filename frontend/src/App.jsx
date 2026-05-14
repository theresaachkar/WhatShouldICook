import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import DashboardLayout from "./layout/DashboardLayout";
import { ToastProvider } from "./components/Toast";

import PublicHome from "./pages/PublicHome";
import Browse from "./pages/Browse";
import Dashboard from "./pages/Dashboard";
import Ingredients from "./pages/Ingredients";
import Suggestions from "./pages/Suggestions";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Planner from "./pages/Planner";
import RecipeDetails from "./pages/RecipeDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { AppStateProvider } from "./state/AppState";
import { AuthProvider, useAuth } from "./state/AuthState";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#6D4C41" },
    secondary: { main: "#FFB74D" },
    background: { default: "#F8F6F3", paper: "#FFFFFF" },
    success: { main: "#43A047" },
    warning: { main: "#FB8C00" },
    error: { main: "#E53935" },
  },
  typography: {
    fontFamily: ["Inter", "Segoe UI", "Roboto", "Arial", "sans-serif"].join(","),
    h4: { fontWeight: 900 },
    h5: { fontWeight: 900 },
    h6: { fontWeight: 800 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(180deg, #F8F6F3 0%, #F4F1EC 100%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.04)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingLeft: 16,
          paddingRight: 16,
          minHeight: 42,
        },
        contained: {
          boxShadow: "0 8px 18px rgba(109, 76, 65, 0.18)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "medium" },
    },
  },
});

function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

function PublicOnlyRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
}

function AppShell({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AppShell>
              <PublicHome />
            </AppShell>
          )
        }
      />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/browse"
        element={
          <AppShell>
            <Browse />
          </AppShell>
        }
      />

      <Route
        path="/ingredients"
        element={
          <AppShell>
            <Ingredients />
          </AppShell>
        }
      />

      <Route
        path="/suggestions"
        element={
          <AppShell>
            <Suggestions />
          </AppShell>
        }
      />

      <Route
        path="/recipes/:id"
        element={
          <AppShell>
            <RecipeDetails />
          </AppShell>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <Dashboard />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <AppShell>
              <Favorites />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AppShell>
              <History />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <AppShell>
              <Planner />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ToastProvider>
          <AppStateProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AppStateProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}