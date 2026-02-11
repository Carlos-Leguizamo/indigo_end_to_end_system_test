import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Typography, Card, CardContent } from "@mui/material";

export default function Sales() {
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Ventas
      </Typography>
      <Card>
        <CardContent>
          <Typography>Lista de ventas y detalles aparecerán aquí.</Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
