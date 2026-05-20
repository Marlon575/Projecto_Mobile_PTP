import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  listarResumos,
  obterResumosRecentes,
  obterMeusResumos,
} from '../services/resumoService';

// Cria o contexto
const ResumoContext = createContext();

// Provider — envolve os ecrãs que precisam de acesso aos resumos
export const ResumoProvider = ({ children }) => {
  const [resumos, setResumos] = useState([]);
  const [resumosRecentes, setResumosRecentes] = useState([]);
  const [meusResumos, setMeusResumos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [filtros, setFiltros] = useState({
    disciplina: '',
    curso: '',
    pesquisa: '',
    pagina: 1,
  });

  // Carrega todos os resumos aprovados
  const carregarResumos = useCallback(async (novosFiltros = {}) => {
    try {
      setCarregando(true);
      setErro(null);
      const filtrosActuais = { ...filtros, ...novosFiltros };
      const resposta = await listarResumos(filtrosActuais);
      setResumos(resposta.dados || []);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [filtros]);

  // Carrega os resumos recentes para o ecrã Home
  const carregarResumosRecentes = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await obterResumosRecentes();
      setResumosRecentes(resposta.dados || []);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Carrega os resumos do utilizador autenticado
  const carregarMeusResumos = useCallback(async (token) => {
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
  }, []);

  // Actualiza os filtros e recarrega
  const actualizarFiltros = useCallback((novosFiltros) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }));
    carregarResumos(novosFiltros);
  }, [carregarResumos]);

  // Limpa os filtros
  const limparFiltros = useCallback(() => {
    const filtrosLimpos = { disciplina: '', curso: '', pesquisa: '', pagina: 1 };
    setFiltros(filtrosLimpos);
    carregarResumos(filtrosLimpos);
  }, [carregarResumos]);

  return (
    <ResumoContext.Provider value={{
      resumos,
      resumosRecentes,
      meusResumos,
      carregando,
      erro,
      filtros,
      carregarResumos,
      carregarResumosRecentes,
      carregarMeusResumos,
      actualizarFiltros,
      limparFiltros,
    }}>
      {children}
    </ResumoContext.Provider>
  );
};

// Hook para usar o contexto facilmente
export const useResumoContext = () => {
  const contexto = useContext(ResumoContext);
  if (!contexto) {
    throw new Error('useResumoContext deve ser usado dentro de ResumoProvider');
  }
  return contexto;
};

export default ResumoContext;