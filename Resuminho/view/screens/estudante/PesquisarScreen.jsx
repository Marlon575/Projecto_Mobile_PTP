import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import api from '../../../viewmodel/services/api';

export default function PesquisarScreen({ navigation }) {
  // termoPesquisa — o que o utilizador está a escrever
  const [termoPesquisa, setTermoPesquisa] = useState('');

  // resultados — lista de resumos encontrados
  const [resultados, setResultados] = useState([]);

  // carregando — true enquanto o pedido está a decorrer
  const [carregando, setCarregando] = useState(false);

  // jaPesquisou — true depois da primeira pesquisa
  const [jaPesquisou, setJaPesquisou] = useState(false);

  // Pesquisa os resumos no servidor
  const pesquisar = async () => {
    // Não pesquisa se o campo estiver vazio
    if (!termoPesquisa.trim()) return;

    try {
      setCarregando(true);
      setJaPesquisou(true);

      // GET /resumos?disciplina=termo — filtra por disciplina
      const resposta = await api.get('/resumos', {
        params: { disciplina: termoPesquisa.trim() },
      });

      setResultados(resposta.data);
    } catch (err) {
      console.error('Erro ao pesquisar:', err.message);
      setResultados([]);
    } finally {
      setCarregando(false);
    }
  };

  // Renderiza cada resultado da pesquisa
  const renderResultado = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetalheResumo', { resumoId: item._id })}
      activeOpacity={0.8}
    >
      <Text style={styles.cardTitulo} numberOfLines={2}>
        {item.titulo}
      </Text>
      <Text style={styles.cardDisciplina}>{item.disciplina}</Text>
      <View style={styles.cardRodape}>
        <Text style={styles.cardMeta}>👤 {item.autor?.nome}</Text>
        <Text style={styles.cardMeta}>⭐ {item.mediaAvaliacoes?.toFixed(1) || 'N/A'}</Text>
        <Text style={styles.cardMeta}>📥 {item.downloads}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Cabeçalho com título */}
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Pesquisar</Text>
        <Text style={styles.subtitulo}>Encontra resumos por disciplina</Text>
      </View>

      {/* Barra de pesquisa */}
      <View style={styles.barraPesquisa}>
        <TextInput
          style={styles.input}
          placeholder="Ex: Matemática, Programação..."
          placeholderTextColor="#BDBDBD"
          value={termoPesquisa}
          onChangeText={setTermoPesquisa}
          // Pesquisa quando o utilizador prime Enter no teclado
          onSubmitEditing={pesquisar}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.botaoPesquisar} onPress={pesquisar}>
          <Text style={styles.botaoPesquisarTexto}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Sugestões de pesquisa rápida */}
      {!jaPesquisou && (
        <View style={styles.sugestoesContainer}>
          <Text style={styles.sugestoesTitulo}>Pesquisas populares</Text>
          <View style={styles.sugestoesLista}>
            {['Matemática', 'Programação', 'Redes', 'Base de Dados', 'Inglês', 'Física'].map(s => (
              <TouchableOpacity
                key={s}
                style={styles.sugestao}
                // Preenche o campo e pesquisa directamente
                onPress={() => { setTermoPesquisa(s); pesquisar(); }}
              >
                <Text style={styles.sugestaoTexto}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Resultado da pesquisa */}
      {carregando ? (
        <ActivityIndicator size="large" color="#73057d" style={styles.spinner} />
      ) : jaPesquisou && resultados.length === 0 ? (
        // Nenhum resultado encontrado
        <View style={styles.vazioContainer}>
          <Text style={styles.vazioIcone}>🔍</Text>
          <Text style={styles.vazioTexto}>Nenhum resultado para</Text>
          <Text style={styles.vazioTermo}>"{termoPesquisa}"</Text>
        </View>
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(item) => item._id}
          renderItem={renderResultado}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  cabecalho: {
    backgroundColor: '#73057d',
    padding: 20,
    paddingTop: 50,
  },
  titulo: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  subtitulo: { fontSize: 13, color: '#e0b3e8', marginTop: 2 },
  barraPesquisa: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#212121',
  },
  botaoPesquisar: {
    backgroundColor: '#73057d',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoPesquisarTexto: { fontSize: 20 },
  sugestoesContainer: {
    marginHorizontal: 16,
  },
  sugestoesTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#757575',
    marginBottom: 10,
  },
  sugestoesLista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sugestao: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sugestaoTexto: { fontSize: 13, color: '#424242' },
  spinner: { marginTop: 40 },
  lista: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    marginBottom: 4,
  },
  cardTitulo: {
    fontSize: 15, fontWeight: '700',
    color: '#212121', marginBottom: 4,
  },
  cardDisciplina: {
    fontSize: 13, color: '#73057d',
    fontWeight: '600', marginBottom: 10,
  },
  cardRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 10,
  },
  cardMeta: { fontSize: 12, color: '#757575' },
  vazioContainer: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', padding: 24,
  },
  vazioIcone: { fontSize: 64, marginBottom: 16 },
  vazioTexto: { fontSize: 15, color: '#757575' },
  vazioTermo: {
    fontSize: 17, fontWeight: '700',
    color: '#212121', marginTop: 4,
  },
});