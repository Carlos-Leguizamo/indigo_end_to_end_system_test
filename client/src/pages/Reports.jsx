import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Typography, Card, CardContent } from "@mui/material";

export default function Reports() {
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Reportes
      </Typography>
      <Card>
        <CardContent>
          <Typography>Reportes y métricas aparecerán aquí.</Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
