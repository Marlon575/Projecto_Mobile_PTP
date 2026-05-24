import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import api from '../../../viewmodel/services/api';

export default function AprovarScreen() {
  const [pendentes, setPendentes]   = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aRefrescar, setARefrescar] = useState(false);

  // resumoSeleccionado — o resumo que está a ser revisto
  const [resumoSeleccionado, setResumoSeleccionado] = useState(null);

  // decisao — 'aprovado' ou 'rejeitado'
  const [decisao, setDecisao]       = useState(null);

  // comentario — texto opcional para aprovação, obrigatório para rejeição
  const [comentario, setComentario] = useState('');

  // aEnviar — true enquanto envia a decisão
  const [aEnviar, setAEnviar]       = useState(false);

  useEffect(() => {
    carregarPendentes();
  }, []);

  const carregarPendentes = async () => {
    try {
      setCarregando(true);
      // GET /revisao/pendentes — resumos que este revisor ainda não reviu
      const resposta = await api.get('/revisao/pendentes');
      setPendentes(resposta.data);
    } catch (err) {
      console.error('Erro ao carregar pendentes:', err.message);
    } finally {
      setCarregando(false);
      setARefrescar(false);
    }
  };

  const aoRefrescar = () => {
    setARefrescar(true);
    carregarPendentes();
  };

  // Abre o painel de decisão para um resumo
  const abrirDecisao = (resumo) => {
    setResumoSeleccionado(resumo);
    setDecisao(null);
    setComentario('');
  };

  // Fecha o painel de decisão
  const fecharDecisao = () => {
    setResumoSeleccionado(null);
    setDecisao(null);
    setComentario('');
  };

  // Envia a decisão para o servidor
  const enviarDecisao = async () => {
    // Comentário obrigatório para rejeição
    if (decisao === 'rejeitado' && !comentario.trim()) {
      Alert.alert('Atenção', 'O comentário é obrigatório para rejeitar um resumo.');
      return;
    }

    try {
      setAEnviar(true);

      // POST /revisao/:id/decidir — envia a decisão
      await api.post(`/revisao/${resumoSeleccionado._id}/decidir`, {
        decisao,
        comentario,
      });

      Alert.alert(
        decisao === 'aprovado' ? '✅ Aprovado!' : '❌ Rejeitado!',
        `O resumo foi ${decisao} com sucesso.`,
        [{ text: 'OK', onPress: () => {
          fecharDecisao();
          // Recarrega a lista depois de decidir
          carregarPendentes();
        }}]
      );
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.mensagem || 'Erro ao enviar decisão.');
    } finally {
      setAEnviar(false);
    }
  };

  // Renderiza cada card de resumo pendente
  const renderPendente = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => abrirDecisao(item)}
      activeOpacity={0.8}
    >
      {/* Cabeçalho do card */}
      <View style={styles.cardCabecalho}>
        <View style={styles.etiquetaPendente}>
          <Text style={styles.etiquetaTexto}>⏳ Pendente</Text>
        </View>
        <Text style={styles.cardData}>
          {new Date(item.createdAt).toLocaleDateString('pt-PT')}
        </Text>
      </View>

      <Text style={styles.cardTitulo} numberOfLines={2}>{item.titulo}</Text>
      <Text style={styles.cardDisciplina}>{item.disciplina}</Text>

      <View style={styles.cardRodape}>
        <Text style={styles.cardMeta}>👤 {item.autor?.nome}</Text>
        <Text style={styles.cardMeta}>📚 {item.curso} — {item.ano}º Ano</Text>
      </View>

      <View style={styles.botaoRevisar}>
        <Text style={styles.botaoRevisarTexto}>Toca para decidir →</Text>
      </View>
    </TouchableOpacity>
  );

  // Painel de decisão — aparece quando um resumo é seleccionado
  const renderPainelDecisao = () => (
    <View style={styles.painel}>
      <View style={styles.painelCabecalho}>
        <Text style={styles.painelTitulo} numberOfLines={2}>
          {resumoSeleccionado.titulo}
        </Text>
        <TouchableOpacity onPress={fecharDecisao}>
          <Text style={styles.fechar}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.painelDisciplina}>
        {resumoSeleccionado.disciplina} — {resumoSeleccionado.curso}
      </Text>
      <Text style={styles.painelAutor}>
        👤 Publicado por: {resumoSeleccionado.autor?.nome}
      </Text>

      {/* Botões de decisão */}
      <Text style={styles.painelLabel}>A tua decisão:</Text>
      <View style={styles.decisoesContainer}>
        <TouchableOpacity
          style={[
            styles.botaoDecisao,
            styles.botaoAprovar,
            decisao === 'aprovado' && styles.botaoAprovarActivo,
          ]}
          onPress={() => setDecisao('aprovado')}
        >
          <Text style={styles.botaoDecisaoTexto}>✅ Aprovar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoDecisao,
            styles.botaoRejeitar,
            decisao === 'rejeitado' && styles.botaoRejeitarActivo,
          ]}
          onPress={() => setDecisao('rejeitado')}
        >
          <Text style={styles.botaoDecisaoTexto}>❌ Rejeitar</Text>
        </TouchableOpacity>
      </View>

      {/* Campo de comentário */}
      <Text style={styles.painelLabel}>
        Comentário {decisao === 'rejeitado' ? '(obrigatório)' : '(opcional)'}:
      </Text>
      <TextInput
        style={styles.inputComentario}
        value={comentario}
        onChangeText={setComentario}
        placeholder="Justifica a tua decisão..."
        placeholderTextColor="#BDBDBD"
        multiline
        numberOfLines={4}
      />

      {/* Botão de confirmar */}
      {decisao && (
        <TouchableOpacity
          style={[
            styles.botaoConfirmar,
            decisao === 'aprovado' ? styles.confirmarAprovar : styles.confirmarRejeitar,
            aEnviar && styles.botaoDesativado,
          ]}
          onPress={enviarDecisao}
          disabled={aEnviar}
        >
          {aEnviar ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.botaoConfirmarTexto}>
              {decisao === 'aprovado' ? '✅ Confirmar Aprovação' : '❌ Confirmar Rejeição'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Text style={styles.tituloPagina}>Fila de Revisão</Text>
        <Text style={styles.subtitulo}>
          {pendentes.length} resumo(s) para rever
        </Text>
      </View>

      {/* Painel de decisão ou lista */}
      {resumoSeleccionado ? (
        renderPainelDecisao()
      ) : carregando ? (
        <ActivityIndicator size="large" color="#73057d" style={styles.spinner} />
      ) : pendentes.length === 0 ? (
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
  container:    { flex: 1, backgroundColor: '#f5f5f5' },
  cabecalho:    { backgroundColor: '#73057d', padding: 20, paddingTop: 50 },
  tituloPagina: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  subtitulo:    { fontSize: 13, color: '#e0b3e8', marginTop: 2 },
  spinner:      { marginTop: 40 },
  lista:        { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12,
    padding: 16, elevation: 2, marginBottom: 4,
  },
  cardCabecalho: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10,
  },
  etiquetaPendente: {
    backgroundColor: '#FFF3E0', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 10,
  },
  etiquetaTexto: { fontSize: 12, color: '#FF9800', fontWeight: '600' },
  cardData:      { fontSize: 12, color: '#BDBDBD' },
  cardTitulo:    { fontSize: 15, fontWeight: '700', color: '#212121', marginBottom: 4 },
  cardDisciplina:{ fontSize: 13, color: '#73057d', fontWeight: '600', marginBottom: 10 },
  cardRodape:    { flexDirection: 'row', gap: 12, marginBottom: 10 },
  cardMeta:      { fontSize: 12, color: '#757575' },
  botaoRevisar:  {
    backgroundColor: '#f3e5f5', borderRadius: 8,
    padding: 10, alignItems: 'center',
  },
  botaoRevisarTexto: { color: '#73057d', fontWeight: '700', fontSize: 13 },
  painel: {
    flex: 1, backgroundColor: '#FFFFFF',
    margin: 16, borderRadius: 12, padding: 20, elevation: 3,
  },
  painelCabecalho: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 8,
  },
  painelTitulo:   { flex: 1, fontSize: 17, fontWeight: '700', color: '#212121' },
  fechar:         { fontSize: 20, color: '#757575', paddingLeft: 10 },
  painelDisciplina: { fontSize: 14, color: '#73057d', fontWeight: '600', marginBottom: 4 },
  painelAutor:    { fontSize: 13, color: '#757575', marginBottom: 16 },
  painelLabel:    { fontSize: 13, fontWeight: '700', color: '#212121', marginBottom: 8 },
  decisoesContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  botaoDecisao:   {
    flex: 1, padding: 14, borderRadius: 10,
    alignItems: 'center', borderWidth: 2,
  },
  botaoAprovar:       { borderColor: '#4CAF50', backgroundColor: '#f9fff9' },
  botaoAprovarActivo: { backgroundColor: '#4CAF50' },
  botaoRejeitar:      { borderColor: '#F44336', backgroundColor: '#fff9f9' },
  botaoRejeitarActivo:{ backgroundColor: '#F44336' },
  botaoDecisaoTexto:  { fontWeight: '700', fontSize: 14, color: '#212121' },
  inputComentario: {
    backgroundColor: '#f5f5f5', borderRadius: 8,
    borderWidth: 1, borderColor: '#E0E0E0',
    paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: '#212121',
    height: 100, textAlignVertical: 'top',
    marginBottom: 16,
  },
  botaoConfirmar: {
    borderRadius: 12, padding: 16, alignItems: 'center',
  },
  confirmarAprovar:   { backgroundColor: '#4CAF50' },
  confirmarRejeitar:  { backgroundColor: '#F44336' },
  botaoDesativado:    { opacity: 0.6 },
  botaoConfirmarTexto:{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  vazioContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  vazioIcone:    { fontSize: 64, marginBottom: 16 },
  vazioTexto:    { fontSize: 17, fontWeight: '700', color: '#212121', marginBottom: 8 },
  vazioSubtexto: { fontSize: 13, color: '#757575', textAlign: 'center' },
});