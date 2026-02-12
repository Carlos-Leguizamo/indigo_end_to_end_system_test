import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../api/auth";
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
  email: yup.string().email("Email inválido").required("El email es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});

export default function Login() {
  const { login } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data);
      toast.success("¡Bienvenido!", { duration: 3500 });
      login(res);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Credenciales incorrectas", { duration: 4500 });
        return;
      }
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error al iniciar sesión",
        { duration: 4500 },
      );
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
            Bienvenido
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Inicia sesión en tu cuenta
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
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
            {isSubmitting ? <CircularProgress size={24} /> : "Iniciar Sesión"}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            ¿No tienes cuenta?{" "}
            <Link
              component={RouterLink}
              to="/register"
              sx={{
                fontWeight: 600,
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </Card>
    </AuthLayout>
  );
}
