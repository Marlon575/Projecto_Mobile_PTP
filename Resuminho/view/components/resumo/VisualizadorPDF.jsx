import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  TouchableOpacity, Dimensions,
} from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';

const { width, height } = Dimensions.get('window');

export default function VisualizadorPDF({ uri, titulo }) {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  // Tenta importar o PDF viewer — pode não estar disponível em todos os ambientes
  let PDFView = null;
  try {
    PDFView = require('react-native-pdf').default;
  } catch (e) {
    PDFView = null;
  }

  if (!uri) {
    return (
      <View style={styles.semFicheiro}>
        <Text style={styles.semFicheiroIcone}>📄</Text>
        <Text style={styles.semFicheiroTexto}>
          Nenhum ficheiro disponível.
        </Text>
      </View>
    );
  }

  if (!PDFView) {
    return (
      <View style={styles.semSuporteContainer}>
        <Text style={styles.semSuporteIcone}>📋</Text>
        <Text style={styles.semSuporteTitulo}>Pré-visualização não disponível</Text>
        <Text style={styles.semSuporteTexto}>
          Descarrega o resumo para o visualizar no teu dispositivo.
        </Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.erroContainer}>
        <Text style={styles.erroIcone}>⚠️</Text>
        <Text style={styles.erroTexto}>
          Não foi possível carregar o PDF.
        </Text>
        <TouchableOpacity
          style={styles.botaoRetry}
          onPress={() => { setErro(false); setCarregando(true); }}
        >
          <Text style={styles.botaoRetryTexto}>Tentar de novo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {carregando && (
        <View style={styles.carregando}>
          <ActivityIndicator size="large" color={cores.primaria} />
          <Text style={styles.carregandoTexto}>A carregar PDF...</Text>
        </View>
      )}

      <PDFView
        source={{ uri }}
        style={styles.pdf}
        onLoadComplete={() => setCarregando(false)}
        onError={() => {
          setCarregando(false);
          setErro(true);
        }}
        enablePaging
        horizontal={false}
        fitPolicy={0}
        trustAllCerts={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  pdf: {
    flex: 1,
    width: width,
    height: height * 0.6,
  },
  carregando: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 1,
  },
  carregandoTexto: {
    marginTop: 12,
    fontSize: fontes.normal,
    color: cores.textoSecundario,
  },
  semFicheiro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  semFicheiroIcone: { fontSize: 48, marginBottom: 12 },
  semFicheiroTexto: {
    fontSize: fontes.medio,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
  semSuporteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F5F5F5',
  },
  semSuporteIcone: { fontSize: 48, marginBottom: 12 },
  semSuporteTitulo: {
    fontSize: fontes.grande,
    fontWeight: fontes.bold,
    color: cores.textoPrimario,
    marginBottom: 8,
    textAlign: 'center',
  },
  semSuporteTexto: {
    fontSize: fontes.normal,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
  erroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  erroIcone: { fontSize: 48, marginBottom: 12 },
  erroTexto: {
    fontSize: fontes.medio,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginBottom: 16,
  },
  botaoRetry: {
    backgroundColor: cores.primaria,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  botaoRetryTexto: {
    color: '#FFFFFF',
    fontWeight: fontes.bold,
  },
});