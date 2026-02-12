import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  title = "Confirmar acción",
  message = "¿Estás seguro de que deseas continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "primary",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          pb: 1,
          backgroundColor:
            confirmColor === "error" ? "error.main" : "primary.main",
          color: "white",
          fontWeight: 600,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ pt: 3, px: 3 }}>
        <DialogContentText
          id="confirm-dialog-description"
          sx={{
            color: "text.primary",
            fontSize: "1rem",
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={loading}
          autoFocus
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 4,
          }}
        >
          {loading ? "Procesando..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
