import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getClients = async (token) => {
  const res = await axios.get(`${API_URL}/clients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getClientById = async (id, token) => {
  const res = await axios.get(`${API_URL}/clients/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createClient = async (clientData, token) => {
  const res = await axios.post(`${API_URL}/clients`, clientData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateClient = async (id, clientData, token) => {
  const res = await axios.put(`${API_URL}/clients/${id}`, clientData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteClient = async (id, token) => {
  const res = await axios.delete(`${API_URL}/clients/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
