import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import config from '../../view/constants/config';

// Busca todos os resumos aprovados com filtros opcionais
const listarResumos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    if (filtros.disciplina) params.append('disciplina', filtros.disciplina);
    if (filtros.curso) params.append('curso', filtros.curso);
    if (filtros.pesquisa) params.append('pesquisa', filtros.pesquisa);
    if (filtros.pagina) params.append('pagina', filtros.pagina);

    const resposta = await axios.get(
      `${config.API_URL}/resumos?${params.toString()}`
    );
    return resposta.data;
  } catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Erro ao listar resumos.');
  }
};

// Busca um resumo pelo ID
const obterResumoPorId = async (id) => {
  try {
    const resposta = await axios.get(`${config.API_URL}/resumos/${id}`);
    return resposta.data;
  } catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Resumo não encontrado.');
  }
};

// Busca os resumos do utilizador autenticado
const obterMeusResumos = async (token) => {
  try {
    const resposta = await axios.get(`${config.API_URL}/resumos/meus`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resposta.data;
  } catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Erro ao buscar resumos.');
  }
};

// Publica um novo resumo (selecciona PDF e envia)
const publicarResumo = async (dados, token) => {
  try {
    // Abre o picker de documentos para seleccionar o PDF
    const resultado = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (resultado.canceled) return null;

    const ficheiro = resultado.assets[0];

    // Verifica o tamanho do ficheiro
    if (ficheiro.size > config.TAMANHO_MAXIMO_PDF) {
      throw new Error('O ficheiro não pode ter mais de 10MB.');
    }

    // Cria o FormData para enviar o ficheiro
    const formData = new FormData();
    formData.append('titulo', dados.titulo);
    formData.append('disciplina', dados.disciplina);
    formData.append('curso', dados.curso);
    formData.append('ficheiro', {
      uri: ficheiro.uri,
      type: 'application/pdf',
      name: ficheiro.name,
    });

    const resposta = await axios.post(
      `${config.API_URL}/resumos`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return resposta.data;
  } catch (erro) {
    throw new Error(erro.response?.data?.mensagem || erro.message || 'Erro ao publicar resumo.');
  }
};

// Descarrega um resumo para o dispositivo
const descarregarResumo = async (id, titulo, token) => {
  try {
    // Caminho onde o ficheiro vai ser guardado
    const caminho = `${FileSystem.documentDirectory}${titulo}.pdf`;

    const resposta = await FileSystem.downloadAsync(
      `${config.API_URL}/resumos/${id}/download`,
      caminho,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (resposta.status === 200) {
      return { sucesso: true, caminho: resposta.uri };
    }
    throw new Error('Erro ao descarregar o ficheiro.');
  } catch (erro) {
    throw new Error(erro.message || 'Erro ao descarregar resumo.');
  }
};

// Busca resumos recentes para o ecrã Home
const obterResumosRecentes = async () => {
  try {
    const resposta = await axios.get(`${config.API_URL}/resumos/recentes`);
    return resposta.data;
  } catch (erro) {
    throw new Error(erro.response?.data?.mensagem || 'Erro ao buscar resumos recentes.');
  }
};

export {
  listarResumos,
  obterResumoPorId,
  obterMeusResumos,
  publicarResumo,
  descarregarResumo,
  obterResumosRecentes,
};