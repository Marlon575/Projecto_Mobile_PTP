import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { validarLogin, validarRegisto } from '../utils/validarFormulario';

const useAuth = () => {
const { entrar, criar, sair, utilizador, carregando, erro, limparErro } = useAuthContext();
const [errosForm, setErrosForm] = useState({});

const fazerLogin = async (email, password) => {
    const erros = validarLogin(email, password);
    if (Object.keys(erros).length > 0) {
    setErrosForm(erros);
    return false;
    }
    setErrosForm({});
    return await entrar(email, password);
};

const fazerRegisto = async (nome, email, password, confirmar, extras = {}) => {
    const erros = validarRegisto(nome, email, password, confirmar);
    if (Object.keys(erros).length > 0) {
    setErrosForm(erros);
    return false;
    }
    setErrosForm({});
    return await criar({ nome, email, password, ...extras });
};

const fazerLogout = async () => {
    await sair();
};

const limparErros = () => {
    setErrosForm({});
    limparErro();
};

return {
    utilizador, carregando, erro, errosForm,
    fazerLogin, fazerRegisto, fazerLogout, limparErros,
};
};

export default useAuth;