import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getSales = async (from, to, token) => {
  const res = await axios.get(`${API_URL}/sales/report?from=${from}&to=${to}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getSalesAll = async (token) => {
  const res = await axios.get(`${API_URL}/sales`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export const createSale = async (saleData, token) => {
  const res = await axios.post(`${API_URL}/sales`, saleData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteSale = async (id, token) => {
  const res = await axios.delete(`${API_URL}/sales/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export const getSaleById = async (id, token) => {
  const res = await axios.get(`${API_URL}/sales/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export const updateSale = async (id, saleData, token) => {
  const res = await axios.put(`${API_URL}/sales/${id}`, saleData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
