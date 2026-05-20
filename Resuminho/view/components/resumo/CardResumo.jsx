import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';
import AvaliacaoEstrelas from './AvaliacaoEstrelas';
import EstadoResumo from './EstadoResumo';
import { formatarDataRelativa } from '../../../viewmodel/utils/formatarData';

export default function CardResumo({ resumo, onPress, mostrarEstado = false }) {
  return (
    <TouchableOpacity
      style={styles.cartao}
      onPress={() => onPress && onPress(resumo)}
      activeOpacity={0.8}
    >
      {/* Cabeçalho do card */}
      <View style={styles.cabecalho}>
        <View style={styles.iconeContainer}>
          <Text style={styles.icone}>📄</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.titulo} numberOfLines={2}>
            {resumo.titulo}
          </Text>
          <Text style={styles.disciplina} numberOfLines={1}>
            {resumo.disciplina?.nome || resumo.disciplina}
          </Text>
        </View>
      </View>

      {/* Separador */}
      <View style={styles.separador} />

      {/* Rodapé do card */}
      <View style={styles.rodape}>
        <View style={styles.rodapeEsquerda}>
          <AvaliacaoEstrelas
            valor={Math.round(resumo.mediaAvaliacoes || 0)}
            soLeitura
            tamanho="pequeno"
            mostrarContagem
            contagem={resumo.totalAvaliacoes || 0}
          />
        </View>

        <View style={styles.rodapeDireita}>
          {mostrarEstado && resumo.estado && (
            <EstadoResumo estado={resumo.estado} tamanho="pequeno" />
          )}
          <Text style={styles.data}>
            {formatarDataRelativa(resumo.createdAt)}
          </Text>
        </View>
      </View>

      {/* Downloads */}
      {resumo.totalDownloads > 0 && (
        <Text style={styles.downloads}>
          ⬇️ {resumo.totalDownloads} downloads
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: cores.fundoCartao,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconeContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icone: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  titulo: {
    fontSize: fontes.medio,
    fontWeight: fontes.semibold,
    color: cores.textoPrimario,
    marginBottom: 4,
  },
  disciplina: {
    fontSize: fontes.normal,
    color: cores.textoSecundario,
  },
  separador: {
    height: 1,
    backgroundColor: cores.separador,
    marginVertical: 10,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rodapeEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rodapeDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  data: {
    fontSize: fontes.pequeno,
    color: cores.textoSecundario,
  },
  downloads: {
    fontSize: fontes.pequeno,
    color: cores.textoSecundario,
    marginTop: 6,
  },
});