import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import {
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} from "../api/sales";
import { getAllProducts } from "../api/products";
import { getClients } from "../api/clients";
import toast from "react-hot-toast";

const SALE_STATUS = {
  1: "Pendiente",
  2: "Completada",
  3: "Cancelada",
};

export default function Sales() {
  const { user } = useContext(AuthContext);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fromDate, setFromDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const [formData, setFormData] = useState({
    clientId: 0,
    saleStatusId: 1,
    items: [{ productId: 0, quantity: 1 }],
  });

  useEffect(() => {
    if (user && user?.token) {
      loadClients();
      loadProducts();
    } else {
      console.log("Usuario no autenticado o sin token");
    }
  }, [user, user?.token]);

  useEffect(() => {
    if (user && user?.token) {
      console.log("Cargando ventas desde", fromDate, "hasta", toDate);
      loadSales();
    }
  }, [user, user?.token, fromDate, toDate]);

const loadSales = async () => {
  try {
    setLoading(true);
    setError("");
    const fromDateTime = `${fromDate}T00:00:00Z`;
    const toDateTime = `${toDate}T23:59:59Z`;
    const data = await getSales(fromDateTime, toDateTime, user?.token);
    setSales(data || []);
  } catch (err) {
    console.error("Error completo al cargar ventas:", err);
    setError(
      "Error al cargar ventas: " +
        (err.response?.data?.message || err.message),
    );
  } finally {
    setLoading(false);
  }
};

  const loadProducts = async () => {
    try {
      const data = await getAllProducts(user?.token);
      setProducts(data || []);
    } catch (err) {
      setError(
        "Error al cargar productos: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  const loadClients = async () => {
    try {
      const data = await getClients(user?.token);
      setClients(data || []);
    } catch (err) {
      console.error("Error completo al cargar clientes:", err);
      setError(
        "Error al cargar clientes: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      clientId: 0,
      saleStatusId: 1,
      items: [{ productId: 0, quantity: 1 }],
    });
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleOpenEdit = async (sale) => {
    try {
      const fullSale = await getSaleById(sale.id, user?.token);
      setSelectedSale(fullSale);
      setFormData({
        clientId: fullSale.clientId,
        saleStatusId: fullSale.saleStatusId || 1,
        items: fullSale.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      setOpenEdit(true);
    } catch (err) {
      setError("Error al cargar venta: " + err.message);
    }
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedSale(null);
  };

  const handleOpenDetail = async (sale) => {
    try {
      const fullSale = await getSaleById(sale.id, user?.token);
      setSelectedSale(fullSale);
      setOpenDetail(true);
    } catch (err) {
      setError("Error al cargar venta: " + err.message);
    }
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedSale(null);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: 0, quantity: 1 }],
    });
  };

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] =
      field === "quantity" ? parseInt(value) : Number(value);
    setFormData({ ...formData, items: newItems });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      if (!formData.clientId || formData.clientId === 0) {
        setError("Selecciona un cliente");
        return;
      }

      if (
        formData.items.some(
          (item) => !item.productId || item.productId === 0 || !item.quantity,
        )
      ) {
        setError("Completa todos los items");
        return;
      }

      if (selectedSale) {
        await updateSale(selectedSale.id, formData, user?.token);
        toast.success("Venta actualizada correctamente");
        setOpenEdit(false);
      } else {
        await createSale(formData, user?.token);
        toast.success("Venta creada correctamente");
        setOpenCreate(false);
      }

      setSelectedSale(null);
      await loadSales();
    } catch (err) {
      setError("Error al guardar venta: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta venta?"))
      return;

    try {
      setLoading(true);
      setError("");
      await deleteSale(id, user?.token);
      setSuccess("Venta eliminada correctamente");
      await loadSales();
    } catch (err) {
      setError("Error al eliminar venta: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "Desconocido";
  };

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Ventas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          type="date"
          label="Desde"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          type="date"
          label="Hasta"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <Button variant="contained" color="primary" onClick={handleOpenCreate}>
          + Nueva Venta
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.id}</TableCell>
                <TableCell>{(sale.client.name)}</TableCell>
                <TableCell align="right">${sale.total.toFixed(2)}</TableCell>
                <TableCell>{SALE_STATUS[sale.saleStatusId] || "N/A"}</TableCell>
                <TableCell>
                  {new Date(sale.date).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="info"
                    onClick={() => handleOpenDetail(sale)}
                    title="Ver detalles"
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenEdit(sale)}
                    title="Editar"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(sale.id)}
                    title="Eliminar"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {sales.length === 0 && !loading && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography color="textSecondary">
              No hay ventas en este período.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Dialog Crear/Editar */}
      <Dialog
        open={openCreate || openEdit}
        onClose={selectedSale ? handleCloseEdit : handleCloseCreate}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedSale ? "Editar Venta" : "Nueva Venta"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Cliente</InputLabel>
            <Select
              value={formData.clientId}
              onChange={(e) =>
                setFormData({ ...formData, clientId: Number(e.target.value) })
              }
              label="Cliente"
            >
              <MenuItem value={0}>-- Selecciona un cliente --</MenuItem>
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedSale && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.saleStatusId}
                onChange={(e) =>
                  setFormData({ ...formData, saleStatusId: e.target.value })
                }
                label="Estado"
              >
                <MenuItem value={1}>Pendiente</MenuItem>
                <MenuItem value={2}>Completada</MenuItem>
                <MenuItem value={3}>Cancelada</MenuItem>
              </Select>
            </FormControl>
          )}

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Productos
          </Typography>
          {formData.items.map((item, index) => (
            <Box key={index} sx={{ mb: 2, p: 1, backgroundColor: "#f9f9f9" }}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel>Producto</InputLabel>
                <Select
                  value={item.productId}
                  onChange={(e) =>
                    handleItemChange(index, "productId", e.target.value)
                  }
                  label="Producto"
                >
                  <MenuItem value={0}>-- Selecciona un producto --</MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} (${product.price})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  type="number"
                  label="Cantidad"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  inputProps={{ min: 1 }}
                  size="small"
                  fullWidth
                />
                <Button
                  color="error"
                  onClick={() => handleRemoveItem(index)}
                  disabled={formData.items.length === 1}
                >
                  Quitar
                </Button>
              </Box>
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddItem}
            fullWidth
            sx={{ mb: 2 }}
          >
            + Agregar Producto
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={selectedSale ? handleCloseEdit : handleCloseCreate}>
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Detalles */}
      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Detalles de Venta</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedSale && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  ID: {selectedSale.id}
                </Typography>
                <Typography variant="subtitle2">
                  Cliente: {(selectedSale.clientId)}
                </Typography>
                <Typography variant="subtitle2">
                  Estado: {SALE_STATUS[selectedSale.saleStatusId] || "N/A"}
                </Typography>
                <Typography variant="subtitle2">
                  Fecha: {new Date(selectedSale.date).toLocaleDateString()}
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Productos:
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Precio</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedSale.items?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{getProductName(item.productId)}</TableCell>
                        <TableCell align="right">
                          ${item.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #ddd" }}>
                <Typography variant="h6">
                  Total: ${selectedSale.total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
