import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useAuthContext } from '../../../viewmodel/context/AuthContext';
import api from '../../../viewmodel/services/api';

export default function HomeEstudanteScreen({ navigation }) {
  // utilizador — objecto com os dados do utilizador autenticado
  const { utilizador } = useAuthContext();

  // resumos — lista de resumos aprovados vinda do servidor
  const [resumos, setResumos] = useState([]);

  // carregando — true enquanto os dados estão a ser carregados
  const [carregando, setCarregando] = useState(true);

  // aRefrescar — true quando o utilizador puxa para refrescar
  const [aRefrescar, setARefrescar] = useState(false);

  // disciplinaActiva — filtro seleccionado, null = mostrar todos
  const [disciplinaActiva, setDisciplinaActiva] = useState(null);

  // erro — mensagem de erro caso o pedido falhe
  const [erro, setErro] = useState(null);

  // Lista de filtros rápidos por disciplina
  const filtros = [
    { id: null, nome: 'Todos' },
    { id: 'Matemática', nome: 'Matemática' },
    { id: 'Programação', nome: 'Programação' },
    { id: 'Redes', nome: 'Redes' },
    { id: 'Base de Dados', nome: 'Base de Dados' },
    { id: 'Inglês', nome: 'Inglês' },
  ];

  // Carrega os resumos quando o ecrã abre
  useEffect(() => {
    carregarResumos();
  }, [disciplinaActiva]); // Re-executa quando o filtro muda

  const carregarResumos = async () => {
    try {
      setCarregando(true);
      setErro(null);

      // Constrói os parâmetros da query — ex: ?disciplina=Matemática
      const params = {};
      if (disciplinaActiva) params.disciplina = disciplinaActiva;

      // Faz o pedido GET /resumos com os filtros
      const resposta = await api.get('/resumos', { params });

      // Guarda os resumos no estado
      setResumos(resposta.data);
    } catch (err) {
      setErro('Não foi possível carregar os resumos.');
    } finally {
      // Desliga o indicador de carregamento seja qual for o resultado
      setCarregando(false);
      setARefrescar(false);
    }
  };

  // Chamada quando o utilizador puxa para baixo para refrescar
  const aoRefrescar = () => {
    setARefrescar(true);
    carregarResumos();
  };

  // Renderiza cada card de resumo na lista
  const renderResumo = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      // Navega para o ecrã de detalhe passando o id do resumo
      onPress={() => navigation.navigate('DetalheResumo', { resumoId: item._id })}
      activeOpacity={0.8}
    >
      {/* Cabeçalho do card com título e disciplina */}
      <View style={styles.cardCabecalho}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitulo} numberOfLines={2}>
            {item.titulo}
          </Text>
          <Text style={styles.cardDisciplina}>{item.disciplina}</Text>
        </View>

        {/* Avaliação média em estrelas */}
        <View style={styles.cardAvaliacao}>
          <Text style={styles.estrela}>⭐</Text>
          <Text style={styles.avaliacaoTexto}>
            {item.mediaAvaliacoes > 0
              ? item.mediaAvaliacoes.toFixed(1)
              : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Rodapé do card com autor, curso e downloads */}
      <View style={styles.cardRodape}>
        <Text style={styles.cardMeta}>
          👤 {item.autor?.nome || 'Desconhecido'}
        </Text>
        <Text style={styles.cardMeta}>
          📥 {item.downloads} downloads
        </Text>
      </View>

      {/* Etiqueta do curso */}
      <View style={styles.etiquetaContainer}>
        <Text style={styles.etiqueta}>{item.curso}</Text>
        <Text style={styles.etiqueta}>{item.ano}º Ano</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Cabeçalho com saudação ao utilizador */}
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.saudacao}>
            Olá, {utilizador?.nome?.split(' ')[0]} 👋
          </Text>
          <Text style={styles.subtitulo}>
            Descobre resumos para estudar
          </Text>
        </View>
        {/* Pontos do utilizador */}
        <View style={styles.pontosContainer}>
          <Text style={styles.pontosValor}>{utilizador?.pontos || 0}</Text>
          <Text style={styles.pontosLabel}>pontos</Text>
        </View>
      </View>

      {/* Barra de filtros horizontal por disciplina */}
      <View style={styles.filtrosContainer}>
        <FlatList
          horizontal
          data={filtros}
          keyExtractor={(item) => String(item.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtroLista}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filtroBotao,
                // Destaca o filtro activo com cor diferente
                disciplinaActiva === item.id && styles.filtroBotaoActivo,
              ]}
              onPress={() => setDisciplinaActiva(item.id)}
            >
              <Text style={[
                styles.filtroTexto,
                disciplinaActiva === item.id && styles.filtroTextoActivo,
              ]}>
                {item.nome}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Conteúdo principal — loading, erro ou lista */}
      {carregando && !aRefrescar ? (
        // Mostra spinner enquanto carrega pela primeira vez
        <ActivityIndicator
          size="large"
          color="#73057d"
          style={styles.spinner}
        />
      ) : erro ? (
        // Mostra mensagem de erro com botão para tentar outra vez
        <View style={styles.erroContainer}>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity style={styles.botaoTentar} onPress={carregarResumos}>
            <Text style={styles.botaoTentarTexto}>Tentar outra vez</Text>
          </TouchableOpacity>
        </View>
      ) : resumos.length === 0 ? (
        // Mostra mensagem quando não há resumos
        <View style={styles.vazioContainer}>
          <Text style={styles.vazioIcone}>📚</Text>
          <Text style={styles.vazioTexto}>Nenhum resumo encontrado</Text>
          <Text style={styles.vazioSubtexto}>
            Tenta outro filtro ou volta mais tarde
          </Text>
        </View>
      ) : (
        // Lista de resumos com pull-to-refresh
        <FlatList
          data={resumos}
          keyExtractor={(item) => item._id}
          renderItem={renderResumo}
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cabecalho: {
    backgroundColor: '#73057d',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saudacao: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitulo: {
    fontSize: 13,
    color: '#e0b3e8',
    marginTop: 2,
  },
  pontosContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  pontosValor: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pontosLabel: {
    fontSize: 11,
    color: '#e0b3e8',
  },
  filtrosContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    elevation: 2,
  },
  filtroLista: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filtroBotao: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filtroBotaoActivo: {
    backgroundColor: '#73057d',
    borderColor: '#73057d',
  },
  filtroTexto: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
  },
  filtroTextoActivo: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  spinner: {
    flex: 1,
    marginTop: 50,
  },
  lista: {
    padding: 16,
    gap: 12,
  },
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
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  cardDisciplina: {
    fontSize: 13,
    color: '#73057d',
    fontWeight: '600',
  },
  cardAvaliacao: {
    alignItems: 'center',
  },
  estrela: {
    fontSize: 18,
  },
  avaliacaoTexto: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
  },
  cardRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  cardMeta: {
    fontSize: 12,
    color: '#757575',
  },
  etiquetaContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  etiqueta: {
    backgroundColor: '#f3e5f5',
    color: '#73057d',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  erroContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  erroTexto: {
    fontSize: 15,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  botaoTentar: {
    backgroundColor: '#73057d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  botaoTentarTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  vazioContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  vazioIcone: {
    fontSize: 64,
    marginBottom: 16,
  },
  vazioTexto: {
    fontSize: 17,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  vazioSubtexto: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
  },
});