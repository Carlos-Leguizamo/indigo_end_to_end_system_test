import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (data) => {
  const loginData = {
    email: data.email,
    password: data.password,
  };
  const res = await axios.post(`${API_URL}/auth/login`, loginData);
  return res.data;
};

export const registerUser = async (data) => {
  const registerData = {
    username: data.name,
    email: data.email,
    password: data.password,
  };
  const res = await axios.post(`${API_URL}/auth/register`, registerData);
  return res.data;
};
