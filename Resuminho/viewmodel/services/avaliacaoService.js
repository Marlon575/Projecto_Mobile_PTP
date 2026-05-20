import axios from 'axios';
import config from '../../view/constants/config';
import { pontosAccao } from '../constants/niveis';

// Envia uma avaliação com estrelas e comentário
const avaliarResumo = async (resumoId, estrelas, comentario, token) => {
  try {
    const resposta = await axios.post(
      `${config.API_URL}/avaliacoes`,
      { resumoId, estrelas, comentario },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return resposta.data;
  } catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Erro ao avaliar resumo.');
  }
};

// Busca as avaliações de um resumo
const obterAvaliacoes = async (resumoId) => {
  try {
    const resposta = await axios.get(
      `${config.API_URL}/avaliacoes/${resumoId}`
    );
    return resposta.data;
  } catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Erro ao buscar avaliações.');
  }
};

// Verifica se o utilizador já avaliou um resumo
const verificarAvaliacao = async (resumoId, token) => {
  try {
    const resposta = await axios.get(
      `${config.API_URL}/avaliacoes/${resumoId}/minha`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return resposta.data;
  } catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Erro ao verificar avaliação.');
  }
};

// Calcula os pontos que uma avaliação vai gerar
const calcularPontos = (estrelas) => {
  const mapa = {
    1: pontosAccao.estrela1,
    2: pontosAccao.estrela2,
    3: pontosAccao.estrela3,
    4: pontosAccao.estrela4,
    5: pontosAccao.estrela5,
  };
  return mapa[estrelas] || 0;
};

// Calcula a média de estrelas de um array de avaliações
const calcularMedia = (avaliacoes) => {
  if (!avaliacoes || avaliacoes.length === 0) return 0;
  const total = avaliacoes.reduce((soma, a) => soma + a.estrelas, 0);
  return (total / avaliacoes.length).toFixed(1);
};

export {
  avaliarResumo,
  obterAvaliacoes,
  verificarAvaliacao,
  calcularPontos,
  calcularMedia,
};