import axios from 'axios';
import { obterToken } from '../utils/armazenamento';

const API_URL = 'http://10.0.2.2:3000';

const api = axios.create({
baseURL: API_URL,
timeout: 10000,
headers: { 'Content-Type': 'application/json' },
});

// Interceptor — adiciona o token JWT em cada pedido automaticamente
api.interceptors.request.use(
async (config) => {
    const token = await obterToken();
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
(erro) => Promise.reject(erro)
);

// Interceptor de resposta — trata erros globais
api.interceptors.response.use(
(resposta) => resposta,
(erro) => {
    if (erro.response?.status === 401) {
    console.warn('Token expirado ou inválido.');
    }
    return Promise.reject(erro);
}
);

export default api;