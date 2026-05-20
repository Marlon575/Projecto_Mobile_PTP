import { useState, useEffect, useCallback } from 'react';
import {
  listarResumos,
  obterResumoPorId,
  obterMeusResumos,
  publicarResumo,
  descarregarResumo,
  obterResumosRecentes,
} from '../services/resumoService';

const useResumos = (token = null) => {
  const [resumos, setResumos] = useState([]);
  const [resumoActual, setResumoActual] = useState(null);
  const [meusResumos, setMeusResumos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  // Carrega lista de resumos com filtros
  const carregarResumos = useCallback(async (filtros = {}) => {
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await listarResumos(filtros);
      setResumos(resposta.dados || []);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Carrega um resumo específico pelo ID
  const carregarResumoPorId = useCallback(async (id) => {
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await obterResumoPorId(id);
      setResumoActual(resposta.dados);
      return resposta.dados;
    } catch (err) {
      setErro(err.message);
      return null;
    } finally {
      setCarregando(false);
    }
  }, []);

  // Carrega os resumos do utilizador
  const carregarMeusResumos = useCallback(async () => {
    if (!token) return;
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await obterMeusResumos(token);
      setMeusResumos(resposta.dados || []);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [token]);

  // Publica um novo resumo
  const publicar = useCallback(async (dados) => {
    if (!token) {
      setErro('Precisas de estar autenticado para publicar.');
      return null;
    }
    try {
      setCarregando(true);
      setErro(null);
      setSucesso(null);
      const resposta = await publicarResumo(dados, token);
      if (resposta) {
        setSucesso('Resumo publicado com sucesso! Aguarda aprovação.');
        await carregarMeusResumos();
      }
      return resposta;
    } catch (err) {
      setErro(err.message);
      return null;
    } finally {
      setCarregando(false);
    }
  }, [token, carregarMeusResumos]);

  // Descarrega um resumo
  const descarregar = useCallback(async (id, titulo) => {
    if (!token) {
      setErro('Precisas de estar autenticado para descarregar.');
      return null;
    }
    try {
      setCarregando(true);
      setErro(null);
      const resultado = await descarregarResumo(id, titulo, token);
      if (resultado.sucesso) {
        setSucesso('Resumo descarregado com sucesso!');
      }
      return resultado;
    } catch (err) {
      setErro(err.message);
      return null;
    } finally {
      setCarregando(false);
    }
  }, [token]);

  // Limpa mensagens de erro e sucesso
  const limparMensagens = useCallback(() => {
    setErro(null);
    setSucesso(null);
  }, []);

  // Carrega resumos ao montar o hook
  useEffect(() => {
    carregarResumos();
  }, [carregarResumos]);

  return {
    resumos,
    resumoActual,
    meusResumos,
    carregando,
    erro,
    sucesso,
    carregarResumos,
    carregarResumoPorId,
    carregarMeusResumos,
    publicar,
    descarregar,
    limparMensagens,
  };
};

export default useResumos;