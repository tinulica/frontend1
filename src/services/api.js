// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'https://backend11-75yc.onrender.com',
  withCredentials: true,
});

export default api;
