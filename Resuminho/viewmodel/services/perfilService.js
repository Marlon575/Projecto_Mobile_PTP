import api from './api';
import { guardarUtilizador } from '../utils/armazenamento';

const obterPerfil = async () => {
try {
    const resposta = await api.get('/perfil');
    return resposta.data;
} catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Erro ao obter perfil.');
}
};

const actualizarPerfil = async (dados) => {
try {
    const resposta = await api.put('/perfil', dados);
    await guardarUtilizador(resposta.data.utilizador);
    return resposta.data;
} catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Erro ao actualizar perfil.');
}
};

const actualizarFoto = async (uri) => {
try {
    const formData = new FormData();
    formData.append('foto', {
    uri,
    type: 'image/jpeg',
    name: 'foto_perfil.jpg',
    });
    const resposta = await api.put('/perfil/foto', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    });
    await guardarUtilizador(resposta.data.utilizador);
    return resposta.data;
} catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Erro ao actualizar foto.');
}
};

const obterEstatisticas = async () => {
try {
    const resposta = await api.get('/perfil/estatisticas');
    return resposta.data;
} catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Erro ao obter estatísticas.');
}
};

export { obterPerfil, actualizarPerfil, actualizarFoto, obterEstatisticas };