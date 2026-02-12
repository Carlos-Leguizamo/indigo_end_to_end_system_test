import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { AuthContext } from "../context/AuthContext";
import { getSalesAll } from "../api/sales";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import { AttachMoney, ShoppingCart, Inventory2 } from "@mui/icons-material";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getSalesAll(user.token);
        setSales(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchData();
  }, [user]);

  const totalSales = sales.reduce((sum, sale) => {
    const saleTotal = sale.items.reduce(
      (itemSum, item) => itemSum + item.quantity * item.unitPrice,
      0,
    );
    return sum + saleTotal;
  }, 0);

  const totalOrders = sales.length;
  const totalItems = sales.reduce((sum, s) => sum + s.items.length, 0);

 return (
  <DashboardLayout>
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        mt: 6,
        px: 2,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 1,
          }}
        >
          Bienvenido, {user?.username || "Usuario"}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Panel de control para la gestión de productos y ventas.
          Supervisa ingresos, transacciones registradas y movimiento
          general del sistema en tiempo real.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={50} />
        </Box>
      ) : (
        <Grid
          container
          spacing={4}
          justifyContent="center"
        >
          {[
            {
              label: "Ingresos Totales",
              value: totalSales.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
              }),
              icon: <AttachMoney fontSize="large" />,
            },
            {
              label: "Ventas Registradas",
              value: totalOrders,
              icon: <ShoppingCart fontSize="large" />,
            },
            {
              label: "Productos Vendidos",
              value: totalItems,
              icon: <Inventory2 fontSize="large" />,
            },
          ].map((card, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 4,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent
                  sx={{
                    py: 5,
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mb: 2,
                      color: "primary.main",
                    }}
                  >
                    {card.icon}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {card.label}
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700 }}
                  >
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  </DashboardLayout>
);
}
