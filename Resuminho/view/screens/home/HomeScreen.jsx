import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';
import BarraPesquisa from '../../components/layout/BarraPesquisa';
import CardResumo from '../../components/resumo/CardResumo';
import FiltroCategoria from '../../components/resumo/FiltroCategoria';
import { useResumoContext } from '../../../viewmodel/context/ResumoContext';

export default function HomeScreen({ navigation }) {
  const {
    resumosRecentes,
    carregando,
    erro,
    carregarResumosRecentes,
    actualizarFiltros,
  } = useResumoContext();

  const [pesquisa, setPesquisa] = useState('');

  useEffect(() => {
    carregarResumosRecentes();
  }, []);

  const handlePesquisar = (texto) => {
    setPesquisa(texto);
    if (texto.length > 2) {
      navigation.navigate('Pesquisa', { pesquisa: texto });
    }
  };

  const handleFiltrar = (filtros) => {
    actualizarFiltros(filtros);
    navigation.navigate('ListaResumos', { filtros });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={carregando}
          onRefresh={carregarResumosRecentes}
          colors={[cores.primaria]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.saudacao}>Olá, estudante! 👋</Text>
          <Text style={styles.subtitulo}>Encontra os melhores resumos</Text>
        </View>
        <TouchableOpacity
          style={styles.botaoNotificacao}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Text style={styles.botaoNotificacaoTexto}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de pesquisa */}
      <View style={styles.pesquisaContainer}>
        <BarraPesquisa
          placeholder="Pesquisar resumos..."
          onPesquisar={handlePesquisar}
        />
      </View>

      {/* Filtros rápidos */}
      <View style={styles.filtrosContainer}>
        <Text style={styles.secaoTitulo}>Filtrar por</Text>
        <FiltroCategoria onFiltrar={handleFiltrar} />
      </View>

      {/* Acesso rápido */}
      <View style={styles.acessoRapido}>
        <TouchableOpacity
          style={styles.cartaoAcesso}
          onPress={() => navigation.navigate('ListaResumos')}
        >
          <Text style={styles.cartaoAcessoIcone}>📚</Text>
          <Text style={styles.cartaoAcessoTexto}>Todos os Resumos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cartaoAcesso}
          onPress={() => navigation.navigate('MeusResumos')}
        >
          <Text style={styles.cartaoAcessoIcone}>📝</Text>
          <Text style={styles.cartaoAcessoTexto}>Meus Resumos</Text>
        </TouchableOpacity>
      </View>

      {/* Resumos recentes */}
      <View style={styles.secao}>
        <View style={styles.secaoCabecalho}>
          <Text style={styles.secaoTitulo}>Resumos Recentes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ListaResumos')}>
            <Text style={styles.verTodos}>Ver todos →</Text>
          </TouchableOpacity>
        </View>

        {erro && (
          <Text style={styles.erro}>{erro}</Text>
        )}

        {carregando && resumosRecentes.length === 0 && (
          <ActivityIndicator
            size="large"
            color={cores.primaria}
            style={styles.spinner}
          />
        )}

        {resumosRecentes.map(resumo => (
          <CardResumo
            key={resumo._id}
            resumo={resumo}
            onPress={() => navigation.navigate('DetalheResumo', { resumo })}
          />
        ))}

        {!carregando && resumosRecentes.length === 0 && !erro && (
          <View style={styles.vazio}>
            <Text style={styles.vazioIcone}>📭</Text>
            <Text style={styles.vazioTexto}>
              Nenhum resumo disponível ainda.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: cores.primaria,
  },
  saudacao: {
    fontSize: fontes.titulo,
    fontWeight: fontes.bold,
    color: '#FFFFFF',
  },
  subtitulo: {
    fontSize: fontes.normal,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  botaoNotificacao: {
    width: 42,
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoNotificacaoTexto: { fontSize: 20 },
  pesquisaContainer: {
    padding: 16,
    backgroundColor: cores.primaria,
    paddingTop: 0,
  },
  filtrosContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  acessoRapido: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  cartaoAcesso: {
    flex: 1,
    backgroundColor: cores.fundoCartao,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartaoAcessoIcone: { fontSize: 28, marginBottom: 8 },
  cartaoAcessoTexto: {
    fontSize: fontes.normal,
    fontWeight: fontes.semibold,
    color: cores.textoPrimario,
    textAlign: 'center',
  },
  secao: {
    padding: 16,
  },
  secaoCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  secaoTitulo: {
    fontSize: fontes.grande,
    fontWeight: fontes.bold,
    color: cores.textoPrimario,
  },
  verTodos: {
    fontSize: fontes.normal,
    color: cores.secundaria,
    fontWeight: fontes.semibold,
  },
  spinner: { marginVertical: 40 },
  erro: {
    color: cores.erro,
    textAlign: 'center',
    marginVertical: 16,
  },
  vazio: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  vazioIcone: { fontSize: 40, marginBottom: 12 },
  vazioTexto: {
    fontSize: fontes.medio,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
});