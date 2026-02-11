import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../api/auth";
import AuthLayout from "../layout/AuthLayout";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  Link,
  CircularProgress,
} from "@mui/material";

const schema = yup.object().shape({
  name: yup.string().required("El nombre es requerido"),
  email: yup.string().email("Email inválido").required("El email es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success("Usuario registrado exitosamente", { duration: 3500 });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      if (error?.response?.status === 400) {
        toast.error(error?.response?.data, { duration: 4500 });
        return;
      }
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Error al registrar usuario";
      toast.error(message, { duration: 4500 });
    }
  };

  return (
    <AuthLayout>
      <Card
        sx={{
          p: 4,
          maxWidth: 450,
          mx: "auto",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Crear Cuenta
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Regístrate para comenzar
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Nombre de Usuario"
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            type="email"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 2, py: 1.5, fontWeight: 600 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Registrarse"}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            ¿Ya tienes cuenta?{" "}
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                fontWeight: 600,
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Inicia sesión aquí
            </Link>
          </Typography>
        </Box>
      </Card>
    </AuthLayout>
  );
}
