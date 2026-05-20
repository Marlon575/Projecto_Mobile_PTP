import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';
import { pontosAccao } from '../../../viewmodel/constants/niveis';

// Componente de estrelas interactivo ou apenas de visualização
export default function AvaliacaoEstrelas({
  valor = 0,           // valor actual (1-5)
  onChange,            // função chamada ao seleccionar estrela
  soLeitura = false,   // se true, não permite interacção
  tamanho = 'normal',  // 'pequeno', 'normal', 'grande'
  mostrarPontos = false, // mostra os pontos que a avaliação gera
  mostrarContagem = false, // mostra o número de avaliações
  contagem = 0,
}) {
  const [valorHover, setValorHover] = useState(0);

  const tamanhos = {
    pequeno: 16,
    normal: 24,
    grande: 32,
  };

  const tamanhoEstrela = tamanhos[tamanho] || tamanhos.normal;
  const valorActivo = valorHover || valor;

  const pontosMapa = {
    1: pontosAccao?.estrela1 || 1,
    2: pontosAccao?.estrela2 || 3,
    3: pontosAccao?.estrela3 || 5,
    4: pontosAccao?.estrela4 || 8,
    5: pontosAccao?.estrela5 || 12,
  };

  return (
    <View style={styles.container}>
      <View style={styles.estrelas}>
        {[1, 2, 3, 4, 5].map((estrela) => (
          <TouchableOpacity
            key={estrela}
            onPress={() => !soLeitura && onChange && onChange(estrela)}
            onPressIn={() => !soLeitura && setValorHover(estrela)}
            onPressOut={() => !soLeitura && setValorHover(0)}
            disabled={soLeitura}
            activeOpacity={soLeitura ? 1 : 0.7}
          >
            <Text style={[
              styles.estrela,
              { fontSize: tamanhoEstrela },
              estrela <= valorActivo
                ? styles.estrellaActiva
                : styles.estrellaInactiva,
            ]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mostra pontos que a avaliação vai gerar */}
      {mostrarPontos && valor > 0 && (
        <Text style={styles.pontos}>
          +{pontosMapa[valor]} pts
        </Text>
      )}

      {/* Mostra número de avaliações */}
      {mostrarContagem && contagem > 0 && (
        <Text style={styles.contagem}>
          ({contagem})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  estrelas: {
    flexDirection: 'row',
    gap: 2,
  },
  estrela: {
    color: cores.textoDesativado,
  },
  estrellaActiva: {
    color: cores.destaque,
  },
  estrellaInactiva: {
    color: cores.textoDesativado,
  },
  pontos: {
    fontSize: fontes.pequeno,
    color: cores.aprovado,
    fontWeight: fontes.bold,
    marginLeft: 4,
  },
  contagem: {
    fontSize: fontes.pequeno,
    color: cores.textoSecundario,
    marginLeft: 2,
  },
});