import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, registar, logout, verificarToken } from '../services/authService';
import { obterUtilizador } from '../utils/armazenamento';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [utilizador, setUtilizador] = useState(null);
const [token, setToken] = useState(null);
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState(null);

  // Verifica se há sessão guardada ao iniciar a app
useEffect(() => {
    verificarSessao();
}, []);

const verificarSessao = async () => {
    try {
    setCarregando(true);
    const utilizadorGuardado = await obterUtilizador();
    const dados = await verificarToken();
    if (dados && utilizadorGuardado) {
        setUtilizador(utilizadorGuardado);
    }
    } catch (err) {
    setUtilizador(null);
    } finally {
    setCarregando(false);
    }
};

const entrar = async (email, password) => {
    try {
    setErro(null);
    setCarregando(true);
    const dados = await login(email, password);
    setUtilizador(dados.utilizador);
    setToken(dados.token);
    return true;
    } catch (err) {
    setErro(err.message);
    return false;
    } finally {
    setCarregando(false);
    }
};

const criar = async (dados) => {
    try {
    setErro(null);
    setCarregando(true);
    const resposta = await registar(dados);
    setUtilizador(resposta.utilizador);
    setToken(resposta.token);
    return true;
    } catch (err) {
    setErro(err.message);
    return false;
    } finally {
    setCarregando(false);
    }
};

const sair = async () => {
    await logout();
    setUtilizador(null);
    setToken(null);
};

const limparErro = () => setErro(null);

return (
    <AuthContext.Provider value={{
    utilizador, token, carregando, erro,
    entrar, criar, sair, limparErro,
    estaAutenticado: !!utilizador,
    }}>
    {children}
    </AuthContext.Provider>
);
};

export const useAuthContext = () => {
const contexto = useContext(AuthContext);
if (!contexto) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
}
return contexto;
};

export default AuthContext;