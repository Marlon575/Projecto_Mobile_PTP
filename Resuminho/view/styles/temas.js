import cores from '../constants/cores';
import fontes from '../constants/fontes';

const temaClaro = {
  fundo: cores.fundo,
  fundoCartao: cores.fundoCartao,
  textoPrimario: cores.textoPrimario,
  textoSecundario: cores.textoSecundario,
  primaria: cores.primaria,
  secundaria: cores.secundaria,
  separador: cores.separador,
  input: {
    fundo: '#FFFFFF',
    borda: '#E0E0E0',
    texto: cores.textoPrimario,
    placeholder: cores.textoSecundario,
  },
  cartao: {
    fundo: '#FFFFFF',
    sombra: 'rgba(0,0,0,0.1)',
  },
  cabecalho: {
    fundo: cores.primaria,
    texto: '#FFFFFF',
    icone: '#FFFFFF',
  },
  navegacao: {
    fundo: '#FFFFFF',
    activo: cores.primaria,
    inactivo: cores.textoSecundario,
  },
};

const temaEscuro = {
  fundo: cores.fundoEscuro,
  fundoCartao: '#1E1E1E',
  textoPrimario: '#FFFFFF',
  textoSecundario: '#AAAAAA',
  primaria: cores.secundaria,
  secundaria: cores.primaria,
  separador: '#333333',
  input: {
    fundo: '#2C2C2C',
    borda: '#444444',
    texto: '#FFFFFF',
    placeholder: '#888888',
  },
  cartao: {
    fundo: '#1E1E1E',
    sombra: 'rgba(0,0,0,0.4)',
  },
  cabecalho: {
    fundo: '#1A1A2E',
    texto: '#FFFFFF',
    icone: '#FFFFFF',
  },
  navegacao: {
    fundo: '#1E1E1E',
    activo: cores.secundaria,
    inactivo: '#888888',
  },
};

export { temaClaro, temaEscuro };