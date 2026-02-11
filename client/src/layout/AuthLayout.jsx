import React from "react";
import { Box, Container } from "@mui/material";

export default function AuthLayout({ children }) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f4f6f8"
    >
      <Container maxWidth="xs">{children}</Container>
    </Box>
  );
}
