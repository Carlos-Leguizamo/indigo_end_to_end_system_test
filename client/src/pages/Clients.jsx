import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layout/DashboardLayout";
import ConfirmDialog from "../components/Confirmdialog";
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
  IconButton,
  Chip,
} from "@mui/material";
import { Edit, Delete, Add, Person, Email, Phone } from "@mui/icons-material";
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
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

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
    setTimeout(() => {
      setDialogOpen(true);
    }, 0);
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

  const handleDelete = (id) => {
    setClientToDelete(id);
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteClient(clientToDelete, user.token);
      toast.success("Cliente eliminado correctamente");
      setOpenConfirmDelete(false);
      setClientToDelete(null);
      await fetchClients();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar cliente");
      setOpenConfirmDelete(false);
      setClientToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDelete(false);
    setClientToDelete(null);
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
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "primary.main",
            mb: 1,
          }}
        >
          Gestión de Clientes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Administra tu base de datos de clientes
        </Typography>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <TextField
                placeholder="Buscar por nombre, email, teléfono o ID..."
                size="small"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                fullWidth
                sx={{ backgroundColor: "background.paper" }}
              />
            </Box>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Total: {clients.length} cliente{clients.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenCreate}
              startIcon={<Add />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
              }}
            >
              Nuevo Cliente
            </Button>
          </Box>
        </CardContent>
      </Card>

      {loading && !clients.length ? (
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress />
            </Box>
          </CardContent>
        </Card>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  ID
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Teléfono
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((client, index) => (
                  <TableRow
                    key={client.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "action.hover",
                        cursor: "pointer",
                      },
                      backgroundColor:
                        index % 2 === 0 ? "background.paper" : "action.hover",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>#{client.id}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Person sx={{ color: "primary.main", fontSize: 20 }} />
                        <Typography variant="body2" fontWeight={500}>
                          {client.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Email sx={{ color: "action.active", fontSize: 18 }} />
                        <Typography variant="body2">{client.email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Phone sx={{ color: "success.main", fontSize: 18 }} />
                        <Chip
                          label={client.phone}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(client)}
                          title="Editar"
                          sx={{
                            color: "primary.main",
                            "&:hover": { backgroundColor: "primary.lighter" },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(client.id)}
                          title="Eliminar"
                          disabled={loading}
                          sx={{
                            color: "error.main",
                            "&:hover": { backgroundColor: "error.lighter" },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      {query
                        ? "No se encontraron resultados"
                        : "No hay clientes disponibles"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {query
                        ? `No hay clientes que coincidan con "${query}"`
                        : "Comienza agregando tu primer cliente"}
                    </Typography>
                    {!query && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenCreate}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                      >
                        + Crear Primer Cliente
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        key={editingClient?.id || "new"}
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            backgroundColor: "primary.main",
            color: "white",
            fontWeight: 600,
          }}
        >
          {editingClient ? "Editar Cliente" : "Nuevo Cliente"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, px: 3 }}>
          <TextField
            label="Nombre completo"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            fullWidth
            required
            placeholder="Ej: Juan Pérez"
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            fullWidth
            required
            type="email"
            placeholder="Ej: juan@ejemplo.com"
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Teléfono"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            fullWidth
            required
            placeholder="Ej: 3001234567"
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 4,
            }}
          >
            {loading
              ? "Guardando..."
              : editingClient
                ? "Actualizar Cliente"
                : "Guardar Cliente"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openConfirmDelete}
        title="Eliminar Cliente"
        message="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={loading}
      />
    </DashboardLayout>
  );
}
