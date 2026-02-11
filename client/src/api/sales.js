import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getSales = async (from, to, token) => {
  const res = await axios.get(`${API_URL}/sales/report?from=${from}&to=${to}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createSale = async (saleData, token) => {
  const res = await axios.post(`${API_URL}/sales`, saleData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
