import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useAuthContext } from '../../../viewmodel/context/AuthContext';
import api from '../../../viewmodel/services/api';

// Tabela de níveis baseada nos pontos do utilizador
const obterNivel = (pontos) => {
  if (pontos <= 50)  return { nome: 'Caloiro',          icone: '🌱', cor: '#8BC34A' };
  if (pontos <= 150) return { nome: 'Estudante',         icone: '📚', cor: '#2196F3' };
  if (pontos <= 300) return { nome: 'Colaborador',       icone: '🤝', cor: '#FF9800' };
  if (pontos <= 600) return { nome: 'Destaque da Turma', icone: '⭐', cor: '#9C27B0' };
  if (pontos <= 1000)return { nome: 'Embaixador',        icone: '🏆', cor: '#F44336' };
  return               { nome: 'Mentor',                 icone: '🎓', cor: '#FFD700' };
};

export default function PerfilScreen({ navigation }) {
  const { utilizador, sair } = useAuthContext();

  // estatisticas — dados extra do perfil vindos do servidor
  const [estatisticas, setEstatisticas] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      // GET /perfil — devolve os dados actualizados do utilizador
      const resposta = await api.get('/perfil');
      setEstatisticas(resposta.data);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err.message);
    } finally {
      setCarregando(false);
    }
  };

  // Calcula o nível com base nos pontos actuais
  const nivel = obterNivel(utilizador?.pontos || 0);

  // Calcula a percentagem de progresso para o próximo nível
  const limites = [0, 50, 150, 300, 600, 1000];
  const pontos = utilizador?.pontos || 0;
  const limiteActual = limites.find(l => l > pontos) || 1000;
  const limiteAnterior = limites[limites.indexOf(limiteActual) - 1] || 0;
  const progresso = (pontos - limiteAnterior) / (limiteActual - limiteAnterior);

  if (carregando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#73057d" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Cabeçalho roxo com avatar e nome */}
      <View style={styles.cabecalho}>
        {/* Avatar com a inicial do nome */}
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {utilizador?.nome?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>

        <Text style={styles.nome}>{utilizador?.nome}</Text>
        <Text style={styles.email}>{utilizador?.email}</Text>

        {/* Etiqueta de nível */}
        <View style={[styles.nivelEtiqueta, { backgroundColor: nivel.cor }]}>
          <Text style={styles.nivelTexto}>
            {nivel.icone} {nivel.nome}
          </Text>
        </View>
      </View>

      {/* Barra de progresso para o próximo nível */}
      <View style={styles.progressoContainer}>
        <View style={styles.progressoTopo}>
          <Text style={styles.progressoLabel}>Progresso para o próximo nível</Text>
          <Text style={styles.progressoPontos}>{pontos} pts</Text>
        </View>
        <View style={styles.progressoBarra}>
          <View style={[
            styles.progressoPreenchimento,
            { width: `${Math.min(progresso * 100, 100)}%` },
          ]} />
        </View>
        <Text style={styles.progressoMeta}>
          Meta: {limiteActual} pontos
        </Text>
      </View>

      {/* Cartões de estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{utilizador?.pontos || 0}</Text>
          <Text style={styles.statLabel}>Pontos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{utilizador?.curso || '--'}</Text>
          <Text style={styles.statLabel}>Curso</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{utilizador?.ano || '--'}º</Text>
          <Text style={styles.statLabel}>Ano</Text>
        </View>
      </View>

      {/* Como ganhar pontos */}
      <View style={styles.seccao}>
        <Text style={styles.seccaoTitulo}>Como ganhar pontos</Text>
        {[
          { icone: '⭐', texto: '1 estrela = 1 ponto' },
          { icone: '⭐⭐', texto: '2 estrelas = 3 pontos' },
          { icone: '⭐⭐⭐', texto: '3 estrelas = 5 pontos' },
          { icone: '⭐⭐⭐⭐', texto: '4 estrelas = 8 pontos' },
          { icone: '⭐⭐⭐⭐⭐', texto: '5 estrelas = 12 pontos' },
          { icone: '📥', texto: 'Download do teu resumo = 2 pontos' },
          { icone: '✅', texto: 'Resumo aprovado = 10 pontos bónus' },
        ].map((item, i) => (
          <View key={i} style={styles.dicaLinha}>
            <Text style={styles.dicaIcone}>{item.icone}</Text>
            <Text style={styles.dicaTexto}>{item.texto}</Text>
          </View>
        ))}
      </View>

      {/* Botão de terminar sessão */}
      <TouchableOpacity style={styles.botaoSair} onPress={sair}>
        <Text style={styles.botaoSairTexto}>🚪 Terminar Sessão</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cabecalho: {
    backgroundColor: '#73057d',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  avatarTexto: { fontSize: 36, fontWeight: '800', color: '#FFFFFF' },
  nome: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  email: { fontSize: 13, color: '#e0b3e8', marginBottom: 12 },
  nivelEtiqueta: {
    paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 20,
  },
  nivelTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  progressoContainer: {
    backgroundColor: '#FFFFFF', margin: 16,
    borderRadius: 12, padding: 16, elevation: 2,
  },
  progressoTopo: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8,
  },
  progressoLabel: { fontSize: 13, color: '#757575' },
  progressoPontos: { fontSize: 13, fontWeight: '700', color: '#73057d' },
  progressoBarra: {
    height: 10, backgroundColor: '#f5f5f5',
    borderRadius: 5, overflow: 'hidden',
  },
  progressoPreenchimento: {
    height: '100%', backgroundColor: '#73057d', borderRadius: 5,
  },
  progressoMeta: { fontSize: 11, color: '#BDBDBD', marginTop: 6 },
  statsContainer: {
    flexDirection: 'row', marginHorizontal: 16,
    gap: 10, marginBottom: 16,
  },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12,
    padding: 16, alignItems: 'center', elevation: 2,
  },
  statValor: { fontSize: 18, fontWeight: '800', color: '#73057d' },
  statLabel: { fontSize: 12, color: '#757575', marginTop: 4 },
  seccao: {
    backgroundColor: '#FFFFFF', margin: 16,
    borderRadius: 12, padding: 16, elevation: 2,
  },
  seccaoTitulo: {
    fontSize: 15, fontWeight: '700', color: '#212121', marginBottom: 12,
  },
  dicaLinha: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dicaIcone: { fontSize: 16, marginRight: 10, width: 30 },
  dicaTexto: { fontSize: 13, color: '#424242' },
  botaoSair: {
    margin: 16, backgroundColor: '#FFEBEE',
    borderRadius: 12, padding: 16, alignItems: 'center',
  },
  botaoSairTexto: { color: '#F44336', fontWeight: '700', fontSize: 15 },
});