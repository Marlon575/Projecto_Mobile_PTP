import { StyleSheet } from 'react-native';
import cores from '../constants/cores';
import fontes from '../constants/fontes';

const global = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  containerCentrado: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPadding: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: 16,
  },

  // Cartões
  cartao: {
    backgroundColor: cores.fundoCartao,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Texto
  titulo: {
    fontSize: fontes.titulo,
    fontWeight: fontes.bold,
    color: cores.textoPrimario,
  },
  subtitulo: {
    fontSize: fontes.grande,
    fontWeight: fontes.semibold,
    color: cores.textoPrimario,
  },
  textoNormal: {
    fontSize: fontes.normal,
    color: cores.textoPrimario,
  },
  textoSecundario: {
    fontSize: fontes.normal,
    color: cores.textoSecundario,
  },
  textoPequeno: {
    fontSize: fontes.pequeno,
    color: cores.textoSecundario,
  },

  // Botões
  botaoPrimario: {
    backgroundColor: cores.primaria,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  botaoPrimarioTexto: {
    color: cores.textoClaro,
    fontSize: fontes.medio,
    fontWeight: fontes.bold,
  },
  botaoSecundario: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.primaria,
  },
  botaoSecundarioTexto: {
    color: cores.primaria,
    fontSize: fontes.medio,
    fontWeight: fontes.bold,
  },

  // Inputs
  input: {
    backgroundColor: cores.fundoCartao,
    borderRadius: 8,
    padding: 12,
    fontSize: fontes.normal,
    borderWidth: 1,
    borderColor: cores.separador,
    color: cores.textoPrimario,
    marginBottom: 12,
  },

  // Separador
  separador: {
    height: 1,
    backgroundColor: cores.separador,
    marginVertical: 12,
  },

  // Estados vazios
  vazio: {
    textAlign: 'center',
    color: cores.textoSecundario,
    fontSize: fontes.medio,
    marginTop: 40,
  },

  // Spinner
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default global;