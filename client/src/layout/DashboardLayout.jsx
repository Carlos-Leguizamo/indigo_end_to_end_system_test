import React from "react";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <Box display="flex" height="100vh">
      <Sidebar />
      <Box flexGrow={1}>
        <Navbar />
        <Box p={3}>{children}</Box>
      </Box>
    </Box>
  );
}
