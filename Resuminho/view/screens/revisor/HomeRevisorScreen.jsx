import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useAuthContext } from '../../../viewmodel/context/AuthContext';
import api from '../../../viewmodel/services/api';

export default function HomeRevisorScreen({ navigation }) {
  const { utilizador, sair } = useAuthContext();

  // resumosPendentes — lista de resumos que precisam de revisão
  const [pendentes, setPendentes] = useState([]);

  // carregando — true enquanto carrega os dados
  const [carregando, setCarregando] = useState(true);

  // aRefrescar — true quando o utilizador puxa para refrescar
  const [aRefrescar, setARefrescar] = useState(false);

  // estatisticas — contadores do painel
  const [estatisticas, setEstatisticas] = useState({
    pendentes: 0,
    aprovados: 0,
    rejeitados: 0,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);

      // GET /revisao/pendentes — resumos que este revisor ainda não reviu
      const respostaPendentes = await api.get('/revisao/pendentes');
      setPendentes(respostaPendentes.data);

      // GET /resumos/meus — resumos publicados por este revisor
      const respostaMeus = await api.get('/resumos/meus');
      const meus = respostaMeus.data;

      // Conta os resumos por estado
      setEstatisticas({
        pendentes: respostaPendentes.data.length,
        aprovados: meus.filter(r => r.estado === 'aprovado').length,
        rejeitados: meus.filter(r => r.estado === 'rejeitado').length,
      });

    } catch (err) {
      console.error('Erro ao carregar dados:', err.message);
    } finally {
      setCarregando(false);
      setARefrescar(false);
    }
  };

  const aoRefrescar = () => {
    setARefrescar(true);
    carregarDados();
  };

  // Renderiza cada card de resumo pendente
  const renderPendente = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      // Navega para o ecrã de decisão passando o id do resumo
      onPress={() => navigation.navigate('Aprovar', { resumoId: item._id })}
      activeOpacity={0.8}
    >
      <View style={styles.cardCabecalho}>
        <View style={styles.estadoEtiqueta}>
          <Text style={styles.estadoTexto}>⏳ Pendente</Text>
        </View>
        <Text style={styles.cardData}>
          {new Date(item.createdAt).toLocaleDateString('pt-PT')}
        </Text>
      </View>

      <Text style={styles.cardTitulo} numberOfLines={2}>
        {item.titulo}
      </Text>
      <Text style={styles.cardDisciplina}>{item.disciplina}</Text>

      <View style={styles.cardRodape}>
        <Text style={styles.cardMeta}>👤 {item.autor?.nome}</Text>
        <Text style={styles.cardMeta}>📚 {item.curso}</Text>
        <Text style={styles.cardMeta}>{item.ano}º Ano</Text>
      </View>

      <View style={styles.botaoRevisar}>
        <Text style={styles.botaoRevisarTexto}>Revisar agora →</Text>
      </View>
    </TouchableOpacity>
  );

  if (carregando && !aRefrescar) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#73057d" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Cabeçalho com saudação */}
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.saudacao}>
            Olá, {utilizador?.nome?.split(' ')[0]} 👋
          </Text>
          <Text style={styles.subtitulo}>Painel do Revisor</Text>
        </View>
        <TouchableOpacity onPress={sair} style={styles.botaoSair}>
          <Text style={styles.botaoSairTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Cartões de estatísticas */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { borderTopColor: '#FF9800' }]}>
          <Text style={styles.statValor}>{estatisticas.pendentes}</Text>
          <Text style={styles.statLabel}>Para Rever</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#4CAF50' }]}>
          <Text style={styles.statValor}>{estatisticas.aprovados}</Text>
          <Text style={styles.statLabel}>Aprovados</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#F44336' }]}>
          <Text style={styles.statValor}>{estatisticas.rejeitados}</Text>
          <Text style={styles.statLabel}>Rejeitados</Text>
        </View>
      </View>

      {/* Título da lista */}
      <Text style={styles.listaTitulo}>
        Resumos para Rever ({pendentes.length})
      </Text>

      {/* Lista de resumos pendentes */}
      {pendentes.length === 0 ? (
        <View style={styles.vazioContainer}>
          <Text style={styles.vazioIcone}>✅</Text>
          <Text style={styles.vazioTexto}>Tudo em dia!</Text>
          <Text style={styles.vazioSubtexto}>
            Não há resumos pendentes para rever
          </Text>
        </View>
      ) : (
        <FlatList
          data={pendentes}
          keyExtractor={(item) => item._id}
          renderItem={renderPendente}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={aRefrescar}
              onRefresh={aoRefrescar}
              colors={['#73057d']}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cabecalho: {
    backgroundColor: '#73057d',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saudacao: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  subtitulo: { fontSize: 13, color: '#e0b3e8', marginTop: 2 },
  botaoSair: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  botaoSairTexto: { color: '#FFFFFF', fontWeight: '600' },
  statsContainer: {
    flexDirection: 'row',
    margin: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    elevation: 2,
    borderTopWidth: 3,
  },
  statValor: { fontSize: 22, fontWeight: '800', color: '#212121' },
  statLabel: { fontSize: 11, color: '#757575', marginTop: 4 },
  listaTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  lista: { padding: 16, paddingTop: 0, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    marginBottom: 4,
  },
  cardCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  estadoEtiqueta: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  estadoTexto: { fontSize: 12, color: '#FF9800', fontWeight: '600' },
  cardData: { fontSize: 12, color: '#BDBDBD' },
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
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 10,
    marginBottom: 10,
  },
  cardMeta: { fontSize: 12, color: '#757575' },
  botaoRevisar: {
    backgroundColor: '#f3e5f5',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  botaoRevisarTexto: {
    color: '#73057d',
    fontWeight: '700',
    fontSize: 13,
  },
  vazioContainer: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', padding: 24,
  },
  vazioIcone: { fontSize: 64, marginBottom: 16 },
  vazioTexto: {
    fontSize: 17, fontWeight: '700',
    color: '#212121', marginBottom: 8,
  },
  vazioSubtexto: {
    fontSize: 13, color: '#757575', textAlign: 'center',
  },
});