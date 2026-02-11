import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { getSales } from "../api/sales";
import { AuthContext } from "../context/AuthContext";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatDateTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getSales("2026-01-01", "2026-12-31", user.token);
      setSales(data);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalItems = sales.reduce((sum, s) => sum + s.items.length, 0);
  const totalOrders = sales.length;

  const salesChartData = sales.map((s) => ({
    date: formatDate(s.date),
    total: s.total,
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filtered = sales.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.id?.toString().toLowerCase().includes(q) ||
      formatDateTime(s.date).toLowerCase().includes(q) ||
      s.total?.toString().toLowerCase().includes(q) ||
      s.items?.length.toString().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Dashboard de Ventas
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total de Ventas</Typography>
              <Typography variant="h4">${totalSales}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Órdenes Totales</Typography>
              <Typography variant="h4">{totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Productos Vendidos</Typography>
              <Typography variant="h4">{totalItems}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ventas por Fecha
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#1976d2" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Últimas Ventas
          </Typography>

          <Box mb={2}>
            <TextField
              label="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="small"
            />
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Items</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{formatDateTime(row.date)}</TableCell>
                          <TableCell align="right">${row.total}</TableCell>
                          <TableCell align="right">
                            {row.items.length}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20, 50]}
              />
            </>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
