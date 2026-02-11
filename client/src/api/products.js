import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllProducts = async (token) => {
  const res = await axios.get(`${API_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getProductById = async (id, token) => {
  const res = await axios.get(`${API_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createProduct = async (data, token) => {
  const productData = {
    name: data.name,
    price: data.price,
    stock: data.stock,
    category: data.category,
    imageUrl: data.imageUrl,
  };
  const res = await axios.post(`${API_URL}/products`, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProduct = async (id, data, token) => {
  const productData = {
    name: data.name,
    price: data.price,
    stock: data.stock,
    category: data.category,
    imageUrl: data.imageUrl,
  };
  const res = await axios.put(`${API_URL}/products/${id}`, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteProduct = async (id, token) => {
  const res = await axios.delete(`${API_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
