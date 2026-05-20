import React from 'react';
import {
  View, FlatList, Text, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';
import CardResumo from './CardResumo';

export default function ListaResumos({
  resumos = [],
  carregando = false,
  onResumoPress,
  onRefresh,
  mostrarEstado = false,
  mensagemVazia = 'Nenhum resumo encontrado.',
  cabecalho = null,
}) {
  // Componente mostrado quando a lista está vazia
  const ComponenteVazio = () => {
    if (carregando) return null;
    return (
      <View style={styles.vazio}>
        <Text style={styles.vazioIcone}>📭</Text>
        <Text style={styles.vazioTexto}>{mensagemVazia}</Text>
      </View>
    );
  };

  // Componente mostrado no rodapé da lista
  const ComponenteRodape = () => {
    if (!carregando) return null;
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="small" color={cores.primaria} />
        <Text style={styles.carregandoTexto}>A carregar...</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={resumos}
      keyExtractor={item => item._id || item.id}
      renderItem={({ item }) => (
        <CardResumo
          resumo={item}
          onPress={onResumoPress}
          mostrarEstado={mostrarEstado}
        />
      )}
      ListEmptyComponent={ComponenteVazio}
      ListFooterComponent={ComponenteRodape}
      ListHeaderComponent={cabecalho}
      contentContainerStyle={[
        styles.lista,
        resumos.length === 0 && styles.listaVazia,
      ]}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={carregando}
            onRefresh={onRefresh}
            colors={[cores.primaria]}
            tintColor={cores.primaria}
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    padding: 16,
    paddingBottom: 40,
  },
  listaVazia: {
    flex: 1,
    justifyContent: 'center',
  },
  vazio: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  vazioIcone: {
    fontSize: 48,
    marginBottom: 12,
  },
  vazioTexto: {
    fontSize: fontes.medio,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
  carregando: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  carregandoTexto: {
    fontSize: fontes.normal,
    color: cores.textoSecundario,
  },
});