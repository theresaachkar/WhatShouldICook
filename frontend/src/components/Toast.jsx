import * as React from "react";
import { Snackbar, Alert } from "@mui/material";

const ToastContext = React.createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = React.useState({
    open: false,
    message: "",
    severity: "success"
  });

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity
    });
  };

  const handleClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}