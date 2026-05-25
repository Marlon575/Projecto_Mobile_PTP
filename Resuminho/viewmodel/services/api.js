import axios from 'axios';
import { obterToken } from '../utils/armazenamento';

const API_URL = 'https://resuminho-api.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true',
  },
});

// Adiciona o token JWT em todos os pedidos automaticamente
api.interceptors.request.use(async (config) => {
  const token = await obterToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;