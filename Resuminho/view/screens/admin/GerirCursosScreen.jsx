// Lista, cria, edita e elimina cursos. Usa Modal para o formulário.

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, TextInput, Modal,
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000';

export default function GerirCursosScreen() {
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [cursoEditando, setCursoEditando] = useState(null);
  
  const [form, setForm] = useState({ nome: '', descricao: '' });

  useEffect(() => { carregarCursos(); }, []);

  const carregarCursos = async () => {
    try {
      setCarregando(true);
      const resposta = await axios.get(`${API_URL}/admin/cursos`);
      setCursos(resposta.data.dados);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar os cursos.');
    } finally {
      setCarregando(false);
    }
  };

  const abrirCriar = () => {
    setCursoEditando(null);
    setForm({ nome: '', descricao: '' });
    setModalVisivel(true);
  };

  const abrirEditar = (curso) => {
    setCursoEditando(curso);
    setForm({ nome: curso.nome, descricao: curso.descricao || '' });
    setModalVisivel(true);
  };

  const guardar = async () => {
    if (!form.nome.trim()) {
      Alert.alert('Erro', 'O nome do curso é obrigatório.');
      return;
    }
    try {
      if (cursoEditando) {
        await axios.put(`${API_URL}/admin/cursos/${cursoEditando._id}`, form);
      } else {
        await axios.post(`${API_URL}/admin/cursos`, form);
      }
      setModalVisivel(false);
      await carregarCursos();
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível guardar o curso.');
    }
  };

  const confirmarEliminar = (curso) => {
    Alert.alert('Eliminar', `Eliminar "${curso.nome}" e todas as suas disciplinas?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/admin/cursos/${curso._id}`);
            setCursos(prev => prev.filter(c => c._id !== curso._id));
          } catch (erro) {
            Alert.alert('Erro', 'Não foi possível eliminar o curso.');
          }
        },
      },
    ]);
  };

  const renderCurso = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.nome}>{item.nome}</Text>
        {item.descricao ? <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text> : null}
      </View>
      <View style={styles.acoes}>
        <TouchableOpacity style={[styles.botao, styles.botaoEditar]} onPress={() => abrirEditar(item)}>
          <Text style={styles.botaoTexto}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botao, styles.botaoEliminar]} onPress={() => confirmarEliminar(item)}>
          <Text style={styles.botaoTexto}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando) {
    return <View style={styles.centrado}><ActivityIndicator size="large" color="#FF9800" /></View>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoCriar} onPress={abrirCriar}>
        <Text style={styles.botaoCriarTexto}>+ Novo Curso</Text>
      </TouchableOpacity>
      <FlatList
        data={cursos}
        keyExtractor={item => item._id}
        renderItem={renderCurso}
        onRefresh={carregarCursos}
        refreshing={carregando}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum curso registado.</Text>}
      />
      <Modal visible={modalVisivel} animationType="slide" transparent onRequestClose={() => setModalVisivel(false)}>
        <View style={styles.modalFundo}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>{cursoEditando ? 'Editar Curso' : 'Novo Curso'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do curso *"
              value={form.nome}
              onChangeText={texto => setForm(prev => ({ ...prev, nome: texto }))}
            />
            <TextInput
              style={[styles.input, styles.inputMultilinha]}
              placeholder="Descrição (opcional)"
              value={form.descricao}
              onChangeText={texto => setForm(prev => ({ ...prev, descricao: texto }))}
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={[styles.modalBotao, styles.modalBotaoCancelar]} onPress={() => setModalVisivel(false)}>
                <Text style={{ color: '#666', fontWeight: '700' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBotao, styles.modalBotaoGuardar]} onPress={guardar}>
                <Text style={{ color: '#FFF', fontWeight: '700' }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  botaoCriar: { backgroundColor: '#FF9800', margin: 12, padding: 14, borderRadius: 8, alignItems: 'center' },
  botaoCriarTexto: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  lista: { paddingHorizontal: 12, paddingBottom: 20 },
  item: { flexDirection: 'row', backgroundColor: '#FFF', marginBottom: 8, borderRadius: 8, padding: 12, elevation: 1, alignItems: 'center' },
  itemInfo: { flex: 1 },
  nome: { fontSize: 15, fontWeight: '600', color: '#212121' },
  descricao: { fontSize: 12, color: '#757575', marginTop: 4 },
  acoes: { flexDirection: 'row', gap: 8 },
  botao: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  botaoEditar: { backgroundColor: '#FFF9C4' },
  botaoEliminar: { backgroundColor: '#FFEBEE' },
  botaoTexto: { fontSize: 16 },
  vazio: { textAlign: 'center', color: '#999', marginTop: 40 },
  modalFundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalConteudo: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitulo: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: '#212121' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  inputMultilinha: { height: 80, textAlignVertical: 'top' },
  modalBotoes: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBotao: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
  modalBotaoCancelar: { backgroundColor: '#ECEFF1' },
  modalBotaoGuardar: { backgroundColor: '#FF9800' },
});