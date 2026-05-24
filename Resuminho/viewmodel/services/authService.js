import api from './api';
import {
guardarToken, guardarUtilizador,
removerToken, removerUtilizador, limparTudo,
} from '../utils/armazenamento';

const login = async (email, password) => {
try {
    const resposta = await api.post('/auth/login', { email, senha: password });
    const { token, utilizador } = resposta.data;
    await guardarToken(token);
    await guardarUtilizador(utilizador);
    return { token, utilizador };
} catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Erro ao fazer login.');
}
};

const registar = async (dados) => {
try {
    const resposta = await api.post('/auth/registar', dados);
    const { token, utilizador } = resposta.data;
    await guardarToken(token);
    await guardarUtilizador(utilizador);
    return { token, utilizador };
} catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Erro ao registar.');
}
};

const logout = async () => {
try {
    await limparTudo();
} catch (erro) {
    console.error('Erro ao fazer logout:', erro);
}
};

const verificarToken = async () => {
try {
    const resposta = await api.get('/auth/verificar');
    return resposta.data;
} catch (erro) {
    await removerToken();
    await removerUtilizador();
    return null;
}
};

export { login, registar, logout, verificarToken };