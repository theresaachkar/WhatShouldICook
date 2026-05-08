import * as React from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Topbar />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Toolbar />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            px: { xs: 2, sm: 3, md: 4 },
            py: 3,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "1200px",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}