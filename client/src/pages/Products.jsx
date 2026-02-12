import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layout/DashboardLayout";
import ConfirmDialog from "../components/Confirmdialog";
import { AuthContext } from "../context/AuthContext";
import {
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
  Paper,
  IconButton,
  Chip,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";

export default function Products() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(user?.token);
      setProducts(data);
    } catch (err) {
      console.error("Error al cargar los productos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    setFormData({
      name: "",
      price: "",
      stock: "",
      category: "",
      imageUrl: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = async (product) => {
    try {
      setLoading(true);
      const data = await getProductById(product.id, user?.token);
      setSelectedProduct(data);
      setFormData({
        name: data.name,
        price: data.price,
        stock: data.stock,
        category: data.category,
        imageUrl: data.imageUrl,
      });
      setIsEditing(true);
      setOpenDialog(true);
    } catch (err) {
      console.error("Error al cargar el producto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: "",
      price: "",
      stock: "",
      category: "",
      imageUrl: "",
    });
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" ? parseFloat(value) || "" : value,
    }));
  };

  const handleSaveProduct = async () => {
    try {
      setLoading(true);

      if (
        !formData.name ||
        !formData.price ||
        !formData.stock ||
        !formData.category
      ) {
        toast.error("Por favor completa todos los campos requeridos");
        setLoading(false);
        return;
      }

      if (isEditing && selectedProduct) {
        await updateProduct(selectedProduct.id, formData, user?.token);
        toast.success("Producto actualizado correctamente");
      } else {
        await createProduct(formData, user?.token);
        toast.success("Producto creado correctamente");
      }

      await loadProducts();
      handleCloseDialog();
    } catch (err) {
      console.error("Error al guardar el producto: " + err.message);
      toast.error("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteProduct(productToDelete, user?.token);
      toast.success("Producto eliminado correctamente");
      setOpenConfirmDelete(false);
      setProductToDelete(null);
      await loadProducts();
    } catch (err) {
      console.error("Error al eliminar el producto: " + err.message);
      toast.error("Error al eliminar el producto");
      setOpenConfirmDelete(false);
      setProductToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDelete(false);
    setProductToDelete(null);
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
          Gestión de Productos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Administra tu catálogo de productos e inventario
        </Typography>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Catálogo de Productos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {products.length} producto{products.length !== 1 ? "s" : ""}{" "}
                registrado{products.length !== 1 ? "s" : ""}
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
              Nuevo Producto
            </Button>
          </Box>
        </CardContent>
      </Card>

      {loading && !products.length ? (
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
                  Producto
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  Precio
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  Stock
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Categoría
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Imagen
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
              {products.length > 0 ? (
                products.map((product, index) => (
                  <TableRow
                    key={product.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "action.hover",
                        cursor: "pointer",
                      },
                      backgroundColor:
                        index % 2 === 0 ? "background.paper" : "action.hover",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      #{product.id}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="success.main"
                      >
                        ${product.price.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={product.stock}
                        size="small"
                        color={
                          product.stock > 10
                            ? "success"
                            : product.stock > 0
                              ? "warning"
                              : "error"
                        }
                        sx={{ fontWeight: 600, minWidth: 50 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.category}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      {product.imageUrl ? (
                        <Box
                          component="img"
                          src={product.imageUrl}
                          alt={product.name}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "2px solid",
                            borderColor: "divider",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: "grey.200",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Sin imagen
                          </Typography>
                        </Box>
                      )}
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
                          onClick={() => handleOpenEdit(product)}
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
                          onClick={() => handleDeleteProduct(product.id)}
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
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No hay productos disponibles
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Comienza creando tu primer producto
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenCreate}
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      + Crear Primer Producto
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
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
          {isEditing ? "Editar Producto" : "Nuevo Producto"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Nombre del Producto"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
            placeholder="Ej: Laptop Gamer"
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Precio"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              margin="normal"
              required
              inputProps={{ step: "0.01", min: 0 }}
              placeholder="0.00"
            />
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              margin="normal"
              required
              inputProps={{ step: "1", min: 0 }}
              placeholder="0"
            />
          </Box>
          <TextField
            fullWidth
            label="Categoría"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            margin="normal"
            required
            placeholder="Ej: Electrónica"
          />
          <TextField
            fullWidth
            label="URL de Imagen"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            margin="normal"
            placeholder="https://ejemplo.com/imagen.jpg"
            helperText="Ingresa la URL de la imagen del producto"
          />
          {formData.imageUrl && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1.5 }}
              >
                Vista previa:
              </Typography>

              <Box
                component="img"
                src={formData.imageUrl}
                alt="Preview"
                sx={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  borderRadius: 2,
                  border: "2px solid",
                  borderColor: "divider",
                  mt: 1,
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=Imagen+No+Valida";
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 4,
            }}
          >
            {loading
              ? "Guardando..."
              : isEditing
                ? "Actualizar Producto"
                : "Crear Producto"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openConfirmDelete}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
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
