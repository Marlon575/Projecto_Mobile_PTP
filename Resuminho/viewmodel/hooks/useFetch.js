import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../../view/constants/config';

const useFetch = (url, opcoes = {}) => {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const buscar = useCallback(async () => {
    if (!url) return;

    try {
      setCarregando(true);
      setErro(null);

      const resposta = await axios({
        url: `${config.API_URL}${url}`,
        method: opcoes.metodo || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...opcoes.headers,
        },
        data: opcoes.corpo || null,
        timeout: config.TIMEOUT,
      });

      setDados(resposta.data);
    } catch (err) {
      if (err.response) {
        // Erro do servidor (500)
        setErro(err.response.data?.mensagem || 'Erro no servidor.');
      } else if (err.request) {
        // Sem resposta do servidor
        setErro('Sem ligação ao servidor. Verifica a tua internet.');
      } else {
        setErro('Ocorreu um erro inesperado.');
      }
    } finally {
      setCarregando(false);
    }
  }, [url, opcoes.metodo]);

  useEffect(() => {
    if (opcoes.automatico !== false) {
      buscar();
    }
  }, [buscar]);

  return { dados, carregando, erro, recarregar: buscar };
};

export default useFetch;