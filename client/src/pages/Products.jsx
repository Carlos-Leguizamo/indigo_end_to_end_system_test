import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layout/DashboardLayout";
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
} from "@mui/material";
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
      toast.error("Error al cargar los productos: " + err.message);
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
      toast.error("Error al cargar el producto: " + err.message);
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
      toast.error("Error al guardar el producto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        setLoading(true);
        await deleteProduct(productId, user?.token);
        toast.success("Producto eliminado correctamente");
        await loadProducts();
      } catch (err) {
        toast.error("Error al eliminar el producto: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Productos
        </Typography>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenCreate}
          >
            + Crear Producto
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {loading && !products.length ? (
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
                    <TableCell align="right">
                      <strong>Precio</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Stock</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Categoría</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Imagen</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Acciones</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell align="right">
                          ${product.price.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">{product.stock}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEdit(product)}
                            sx={{ mr: 1 }}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={loading}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="textSecondary">
                          No hay productos disponibles
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? "Editar Producto" : "Crear Nuevo Producto"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Precio"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            margin="normal"
            required
            inputProps={{ step: "0.01" }}
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
            inputProps={{ step: "1" }}
          />
          <TextField
            fullWidth
            label="Categoría"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="URL de Imagen"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
