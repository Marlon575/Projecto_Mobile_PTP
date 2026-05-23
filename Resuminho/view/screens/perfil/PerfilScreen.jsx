import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';
import Avatar from '../../components/comum/Avatar';
import Badge from '../../components/comum/Badge';
import Loading from '../../components/comum/Loading';
import { useAuthContext } from '../../../viewmodel/context/AuthContext';
import { obterEstatisticas } from '../../../viewmodel/services/perfilService';
import { calcularProgresso, obterProximoNivel } from '../../../viewmodel/utils/nivelEstudante';

export default function PerfilScreen({ navigation }) {
  const { utilizador, sair } = useAuthContext();
  const [estatisticas, setEstatisticas] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { carregarEstatisticas(); }, []);

  const carregarEstatisticas = async () => {
    try {
      setCarregando(true);
      const dados = await obterEstatisticas();
      setEstatisticas(dados.dados);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) return <Loading mensagem="A carregar perfil..." />;

  const pontos = utilizador?.pontos || 0;
  const progresso = calcularProgresso(pontos);
  const proximoNivel = obterProximoNivel(pontos);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={carregando} onRefresh={carregarEstatisticas} colors={[cores.primaria]} />
      }
    >
      {/* Cabeçalho do perfil */}
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => navigation.navigate('EditarPerfil')}>
          <Avatar uri={utilizador?.foto} nome={utilizador?.nome} tamanho={80} />
        </TouchableOpacity>
        <Text style={styles.nome}>{utilizador?.nome}</Text>
        <Text style={styles.email}>{utilizador?.email}</Text>
        <Badge pontos={pontos} />
      </View>

      {/* Pontos e progresso */}
      <View style={styles.cartao}>
        <Text style={styles.cartaoTitulo}>Os teus pontos</Text>
        <Text style={styles.pontos}>{pontos} pts</Text>
        <View style={styles.barraFundo}>
          <View style={[styles.barraProgresso, { width: `${progresso}%` }]} />
        </View>
        {proximoNivel && (
          <Text style={styles.proximoNivel}>
            {proximoNivel.icone} Próximo nível: {proximoNivel.nome} ({proximoNivel.min} pts)
          </Text>
        )}
      </View>

      {/* Estatísticas */}
      {estatisticas && (
        <View style={styles.cartao}>
          <Text style={styles.cartaoTitulo}>Estatísticas</Text>
          <View style={styles.grade}>
            {[
              { valor: estatisticas.totalResumos || 0, label: 'Resumos', icone: '📄' },
              { valor: estatisticas.totalDownloads || 0, label: 'Downloads', icone: '⬇️' },
              { valor: estatisticas.totalAvaliacoes || 0, label: 'Avaliações', icone: '⭐' },
              { valor: estatisticas.resumosAprovados || 0, label: 'Aprovados', icone: '✅' },
            ].map((item, i) => (
              <View key={i} style={styles.stat}>
                <Text style={styles.statIcone}>{item.icone}</Text>
                <Text style={styles.statValor}>{item.valor}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Botões */}
      <View style={styles.botoes}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate('EditarPerfil')}
        >
          <Text style={styles.botaoEditarTexto}>✏️ Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoSair} onPress={sair}>
          <Text style={styles.botaoSairTexto}>🚪 Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 50,
    backgroundColor: cores.primaria,
    gap: 8,
  },
  nome: { fontSize: fontes.titulo, fontWeight: fontes.bold, color: '#FFFFFF' },
  email: { fontSize: fontes.normal, color: 'rgba(255,255,255,0.8)' },
  cartao: {
    backgroundColor: cores.fundoCartao,
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  cartaoTitulo: {
    fontSize: fontes.medio,
    fontWeight: fontes.bold,
    color: cores.textoPrimario,
    marginBottom: 12,
  },
  pontos: {
    fontSize: fontes.display,
    fontWeight: fontes.extrabold,
    color: cores.primaria,
    textAlign: 'center',
    marginBottom: 12,
  },
  barraFundo: {
    height: 8, backgroundColor: cores.separador,
    borderRadius: 4, overflow: 'hidden',
  },
  barraProgresso: {
    height: 8, backgroundColor: cores.primaria, borderRadius: 4,
  },
  proximoNivel: {
    fontSize: fontes.pequeno,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginTop: 8,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stat: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  statIcone: { fontSize: 24, marginBottom: 4 },
  statValor: {
    fontSize: fontes.titulo,
    fontWeight: fontes.bold,
    color: cores.primaria,
  },
  statLabel: { fontSize: fontes.pequeno, color: cores.textoSecundario },
  botoes: { padding: 16, gap: 10 },
  botaoEditar: {
    backgroundColor: cores.primaria,
    padding: 14, borderRadius: 8, alignItems: 'center',
  },
  botaoEditarTexto: { color: '#FFFFFF', fontWeight: fontes.bold, fontSize: fontes.medio },
  botaoSair: {
    backgroundColor: cores.fundo,
    padding: 14, borderRadius: 8, alignItems: 'center',
    borderWidth: 1, borderColor: cores.erro,
  },
  botaoSairTexto: { color: cores.erro, fontWeight: fontes.bold, fontSize: fontes.medio },
});