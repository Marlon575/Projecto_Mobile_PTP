import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';

// Mostra o estado do resumo com uma cor e ícone correspondente
export default function EstadoResumo({ estado, tamanho = 'normal' }) {
  // Define cor e ícone conforme o estado
  const config = {
    pendente: {
      cor: cores.pendente,
      fundo: '#FFF3E0',
      icone: '⏳',
      texto: 'Pendente',
    },
    aprovado: {
      cor: cores.aprovado,
      fundo: '#E8F5E9',
      icone: '✅',
      texto: 'Aprovado',
    },
    rejeitado: {
      cor: cores.rejeitado,
      fundo: '#FFEBEE',
      icone: '❌',
      texto: 'Rejeitado',
    },
  };

  const estadoConfig = config[estado] || config.pendente;
  const ePequeno = tamanho === 'pequeno';

  return (
    <View style={[
      styles.container,
      { backgroundColor: estadoConfig.fundo },
      ePequeno && styles.containerPequeno,
    ]}>
      <Text style={ePequeno ? styles.iconePequeno : styles.icone}>
        {estadoConfig.icone}
      </Text>
      <Text style={[
        styles.texto,
        { color: estadoConfig.cor },
        ePequeno && styles.textoPequeno,
      ]}>
        {estadoConfig.texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 4,
  },
  containerPequeno: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  icone: {
    fontSize: 14,
  },
  iconePequeno: {
    fontSize: 11,
  },
  texto: {
    fontSize: fontes.normal,
    fontWeight: fontes.semibold,
  },
  textoPequeno: {
    fontSize: fontes.pequeno,
    fontWeight: fontes.semibold,
  },
});