import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import ConfirmDialog from "../components/ConfirmDialog";
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
  Chip,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import {
  getSales,
  getSalesAll,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} from "../api/sales";
import { getAllProducts } from "../api/products";
import { getClients } from "../api/clients";
import toast from "react-hot-toast";

const SALE_STATUSES = [
  { id: 1, name: "Pendiente", color: "warning" },
  { id: 2, name: "Completada", color: "success" },
  { id: 3, name: "Cancelada", color: "error" },
];

export default function Sales() {
  const { user } = useContext(AuthContext);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);

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
      loadSalesAll();
    }
  }, [user, user?.token]);

  const loadSales = async () => {
    try {
      setLoading(true);
      const fromDateTime = `${fromDate}T00:00:00Z`;
      const toDateTime = `${toDate}T23:59:59Z`;
      const data = await getSales(fromDateTime, toDateTime, user?.token);
      setSales(data || []);
    } catch (err) {
      console.error("Error completo al cargar ventas:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSalesAll = async () => {
    try {
      setLoading(true);
      const data = await getSalesAll(user?.token);
      setSales(data || []);
    } catch (err) {
      console.error("Error completo al cargar todas las ventas:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await getAllProducts(user?.token);
      setProducts(data || []);
    } catch (err) {
      console.error("Error al cargar los productos", err);
    }
  };

  const loadClients = async () => {
    try {
      const data = await getClients(user?.token);
      setClients(data || []);
    } catch (err) {
      console.error("Error completo al cargar clientes:", err);
    }
  };

  const handleFilterByDate = () => {
    if (!fromDate || !toDate) {
      toast.error("Por favor selecciona ambas fechas");
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("La fecha inicial no puede ser mayor a la fecha final");
      return;
    }
    loadSales();
  };

  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");
    loadSalesAll();
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
      console.error("Error al cargar venta para edición: " + err.message);
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
      console.error("Error al cargar venta para detalles: " + err.message);
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

      if (!formData.clientId || formData.clientId === 0) {
        toast.error("Selecciona un cliente");
        return;
      }

      if (!formData.saleStatusId || formData.saleStatusId === 0) {
        toast.error("Selecciona un estado de venta");
        return;
      }

      if (
        formData.items.some(
          (item) => !item.productId || item.productId === 0 || !item.quantity,
        )
      ) {
        toast.error("Completa todos los items");
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
      if (fromDate && toDate) {
        await loadSales();
      } else {
        await loadSalesAll();
      }
    } catch (err) {
      console.error("Error al guardar venta: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setSaleToDelete(id);
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteSale(saleToDelete, user?.token);
      toast.success("Venta eliminada correctamente");
      setOpenConfirmDelete(false);
      setSaleToDelete(null);
      if (fromDate && toDate) {
        await loadSales();
      } else {
        await loadSalesAll();
      }
    } catch (err) {
      console.error("Error al eliminar venta: " + err.message);
      setOpenConfirmDelete(false);
      setSaleToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDelete(false);
    setSaleToDelete(null);
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "Desconocido";
  };

  const getStatusInfo = (statusId) => {
    return SALE_STATUSES.find((s) => s.id === statusId) || SALE_STATUSES[0];
  };

  const calculateTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  };

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
          Gestión de Ventas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Administra y controla todas las ventas de tu negocio
        </Typography>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              <TextField
                type="date"
                label="Desde"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ minWidth: 160 }}
              />
              <TextField
                type="date"
                label="Hasta"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ minWidth: 160 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleFilterByDate}
                disabled={!fromDate || !toDate}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Filtrar
              </Button>
              {(fromDate || toDate) && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClearFilter}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Limpiar
                </Button>
              )}
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenCreate}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
              }}
            >
              Nueva Venta
            </Button>
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Cliente
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Estado
              </TableCell>
              <TableCell align="right" sx={{ color: "white", fontWeight: 600 }}>
                Total
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Fecha
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
            {sales.map((sale, index) => {
              const statusInfo = getStatusInfo(sale.saleStatusId);
              return (
                <TableRow
                  key={sale.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                      cursor: "pointer",
                    },
                    backgroundColor:
                      index % 2 === 0 ? "background.paper" : "action.hover",
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>#{sale.id}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {sale.client.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {sale.client.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusInfo.name}
                      color={statusInfo.color}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="success.main"
                    >
                      ${calculateTotal(sale.items).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(sale.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
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
                        onClick={() => handleOpenDetail(sale)}
                        title="Ver detalles"
                        sx={{
                          color: "info.main",
                          "&:hover": { backgroundColor: "info.lighter" },
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(sale)}
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
                        onClick={() => handleDelete(sale.id)}
                        title="Eliminar"
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {sales.length === 0 && !loading && (
        <Card
          sx={{
            mt: 3,
            borderRadius: 2,
            boxShadow: 3,
            textAlign: "center",
            py: 6,
          }}
        >
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay ventas registradas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {fromDate && toDate
                ? "No se encontraron ventas en el período seleccionado"
                : "Comienza creando tu primera venta"}
            </Typography>
            {!fromDate && !toDate && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenCreate}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                + Crear Primera Venta
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog
        open={openCreate || openEdit}
        onClose={selectedSale ? handleCloseEdit : handleCloseCreate}
        maxWidth="md"
        fullWidth
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
          {selectedSale ? "Editar Venta" : "Nueva Venta"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <FormControl fullWidth margin="normal">
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

          <FormControl fullWidth margin="normal">
            <InputLabel>Estado de la Venta</InputLabel>
            <Select
              value={formData.saleStatusId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  saleStatusId: Number(e.target.value),
                })
              }
              label="Estado de la Venta"
            >
              {SALE_STATUSES.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={status.name}
                      color={status.color}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography
            variant="subtitle1"
            sx={{ mt: 3, mb: 2, fontWeight: 600, color: "primary.main" }}
          >
            Productos
          </Typography>
          {formData.items.map((item, index) => (
            <Card
              key={index}
              sx={{
                mb: 2,
                p: 2,
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
            >
              <FormControl fullWidth margin="normal">
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
                      {product.name} (${product.price.toLocaleString()})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}
              >
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
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveItem(index)}
                  disabled={formData.items.length === 1}
                  sx={{
                    textTransform: "none",
                    minWidth: 100,
                  }}
                >
                  Quitar
                </Button>
              </Box>
            </Card>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddItem}
            fullWidth
            sx={{
              mb: 2,
              textTransform: "none",
              fontWeight: 600,
              py: 1.5,
              borderStyle: "dashed",
              borderWidth: 2,
            }}
          >
            + Agregar Producto
          </Button>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={selectedSale ? handleCloseEdit : handleCloseCreate}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 4,
            }}
          >
            {loading ? "Guardando..." : "Guardar Venta"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            backgroundColor: "info.main",
            color: "white",
            fontWeight: 600,
          }}
        >
          🧾 Detalles de Venta
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedSale && (
            <Box>
              <Card
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      ID DE VENTA
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      #{selectedSale.id}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      CLIENTE
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedSale.client?.name ||
                        `ID: ${selectedSale.clientId}`}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      ESTADO
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={getStatusInfo(selectedSale.saleStatusId).name}
                        color={getStatusInfo(selectedSale.saleStatusId).color}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      FECHA
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {new Date(selectedSale.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Card>

              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}
              >
                Productos
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  boxShadow: 2,
                  mb: 3,
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "primary.main" }}>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Producto
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "white", fontWeight: 600 }}
                      >
                        Precio Unit.
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: "white", fontWeight: 600 }}
                      >
                        Cantidad
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "white", fontWeight: 600 }}
                      >
                        Subtotal
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedSale.items?.map((item, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          "&:hover": { backgroundColor: "action.hover" },
                          backgroundColor:
                            idx % 2 === 0 ? "background.paper" : "action.hover",
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {item.productName || getProductName(item.productId)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            ${item.unitPrice.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                              backgroundColor: "primary.lighter",
                              color: "primary.main",
                              px: 2,
                              py: 0.5,
                              borderRadius: 1,
                              display: "inline-block",
                            }}
                          >
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="success.main"
                          >
                            ${(item.unitPrice * item.quantity).toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Card
                sx={{
                  p: 3,
                  backgroundColor: "success.lighter",
                  borderRadius: 2,
                  textAlign: "right",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                  gutterBottom
                >
                  TOTAL DE LA VENTA
                </Typography>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  ${calculateTotal(selectedSale.items).toLocaleString()}
                </Typography>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDetail}
            variant="contained"
            sx={{ textTransform: "none", fontWeight: 600, px: 4 }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openConfirmDelete}
        title="Eliminar Venta"
        message="¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede deshacer."
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
