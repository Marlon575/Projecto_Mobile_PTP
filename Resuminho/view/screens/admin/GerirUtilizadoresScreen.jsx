// Lista todos os utilizadores. O admin pode bloquear ou eliminar cada um.

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, TextInput,
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000';

export default function GerirUtilizadoresScreen() {
  const [utilizadores, setUtilizadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState('');

  useEffect(() => { carregarUtilizadores(); }, []);

  const carregarUtilizadores = async () => {
    try {
      setCarregando(true);
      const resposta = await axios.get(`${API_URL}/admin/utilizadores`);
      setUtilizadores(resposta.data.dados);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar os utilizadores.');
    } finally {
      setCarregando(false);
    }
  };

  const utilizadoresFiltrados = utilizadores.filter(u =>
    u.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
    u.email?.toLowerCase().includes(pesquisa.toLowerCase())
  );
  // Filtra por nome ou email — .toLowerCase() ignora maiúsculas/minúsculas

  const confirmarBloquear = (utilizador) => {
    const acao = utilizador.bloqueado ? 'desbloquear' : 'bloquear';
    Alert.alert('Confirmar', `Tens a certeza que queres ${acao} ${utilizador.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: () => bloquearUtilizador(utilizador._id, !utilizador.bloqueado) },
    ]);
  };

  const bloquearUtilizador = async (id, bloqueado) => {
    try {
      await axios.put(`${API_URL}/admin/utilizadores/${id}/bloquear`, { bloqueado });
      setUtilizadores(prev =>
        prev.map(u => u._id === id ? { ...u, bloqueado } : u)
        // Actualiza só o utilizador modificado sem recarregar tudo
      );
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível actualizar o utilizador.');
    }
  };

  const confirmarEliminar = (utilizador) => {
    Alert.alert('Eliminar', `Eliminar ${utilizador.nome}? Esta acção é irreversível.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => eliminarUtilizador(utilizador._id) },
    ]);
  };

  const eliminarUtilizador = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/utilizadores/${id}`);
      setUtilizadores(prev => prev.filter(u => u._id !== id));
      // Remove o utilizador do estado local com .filter()
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível eliminar o utilizador.');
    }
  };

  const renderUtilizador = ({ item }) => (
    <View style={[styles.item, item.bloqueado && styles.itemBloqueado]}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemEmail}>{item.email}</Text>
        <View style={styles.itemRodape}>
          <View style={[styles.badge, { backgroundColor: item.papel === 'admin' ? '#F44336' : item.papel === 'revisor' ? '#4b0073' : '#2196F3' }]}>
            <Text style={styles.badgeTexto}>{item.papel}</Text>
          </View>
          {item.bloqueado && <Text style={styles.textoBloqueado}>🚫 Bloqueado</Text>}
        </View>
      </View>
      <View style={styles.acoes}>
        <TouchableOpacity
          style={[styles.botao, item.bloqueado ? styles.botaoDesbloquear : styles.botaoBloquear]}
          onPress={() => confirmarBloquear(item)}
        >
          <Text style={styles.botaoTexto}>{item.bloqueado ? '✅' : '🚫'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botao, styles.botaoEliminar]} onPress={() => confirmarEliminar(item)}>
          <Text style={styles.botaoTexto}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando) {
    return <View style={styles.centrado}><ActivityIndicator size="large" color="#4b0073" /></View>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.pesquisa}
        placeholder="Pesquisar por nome ou email..."
        value={pesquisa}
        onChangeText={setPesquisa}
      />
      <Text style={styles.contador}>{utilizadoresFiltrados.length} utilizador(es)</Text>
      <FlatList
        data={utilizadoresFiltrados}
        keyExtractor={item => item._id}
        renderItem={renderUtilizador}
        onRefresh={carregarUtilizadores}
        refreshing={carregando}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum utilizador encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pesquisa: { backgroundColor: '#FFF', margin: 12, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD' },
  contador: { paddingHorizontal: 16, color: '#666', marginBottom: 8, fontSize: 12 },
  item: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 12, marginBottom: 8, borderRadius: 8, padding: 12, elevation: 1, alignItems: 'center' },
  itemBloqueado: { opacity: 0.6 },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 15, fontWeight: '600', color: '#212121' },
  itemEmail: { fontSize: 12, color: '#757575', marginTop: 2 },
  itemRodape: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  badge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  badgeTexto: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  textoBloqueado: { fontSize: 11, color: '#F44336' },
  acoes: { flexDirection: 'row', gap: 8 },
  botao: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  botaoBloquear: { backgroundColor: '#FFF3E0' },
  botaoDesbloquear: { backgroundColor: '#E8F5E9' },
  botaoEliminar: { backgroundColor: '#FFEBEE' },
  botaoTexto: { fontSize: 16 },
  vazio: { textAlign: 'center', color: '#999', marginTop: 40 },
});