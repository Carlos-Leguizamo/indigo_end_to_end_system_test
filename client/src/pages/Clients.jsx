import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../api/clients";

export default function Clients() {
  const { user } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (!user) return;
    fetchClients();
  }, [user]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await getClients(user.token);
      setClients(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Error al obtener clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingClient(null);
    setForm({ name: "", email: "", phone: "" });
    setDialogOpen(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editingClient) {
        await updateClient(editingClient.id, form, user.token);
        toast.success("Cliente actualizado correctamente");
      } else {
        await createClient(form, user.token);
        toast.success("Cliente creado correctamente");
      }
      await fetchClients();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    try {
      setLoading(true);
      await deleteClient(id, user.token);
      toast.success("Cliente eliminado correctamente");
      await fetchClients();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar cliente");
    } finally {
      setLoading(false);
    }
  };

  const filtered = clients.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.id?.toString().includes(q) ||
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Clientes
        </Typography>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <TextField
              label="Buscar clientes"
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" onClick={handleOpenCreate}>
              Nuevo Cliente
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {loading && !clients.length ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Nombre</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Teléfono</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Acciones</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((c) => (
                      <TableRow key={c.id} hover>
                        <TableCell>{c.id}</TableCell>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.phone}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEdit(c)}
                            sx={{ mr: 1 }}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(c.id)}
                            disabled={loading}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="textSecondary">
                          No hay clientes disponibles
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingClient ? "Editar Cliente" : "Nuevo Cliente"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Nombre"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              fullWidth
              required
            />
            <TextField
              label="Teléfono"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
