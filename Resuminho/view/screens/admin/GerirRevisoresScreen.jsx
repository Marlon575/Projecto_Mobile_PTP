// Lista utilizadores e permite nomear ou remover revisores.

import React, { useEffect, useState } from 'react';
import {
View, Text, StyleSheet, FlatList, TouchableOpacity,
Alert, ActivityIndicator, TextInput,
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000';

export default function GerirRevisoresScreen() {
const [todos, setTodos] = useState([]);
const [revisores, setRevisores] = useState([]);
const [abaActiva, setAbaActiva] = useState('todos');
const [carregando, setCarregando] = useState(true);
const [pesquisa, setPesquisa] = useState('');

useEffect(() => { carregarDados(); }, []);

const carregarDados = async () => {
    try {
    setCarregando(true);
    const [respostaTodos, respostaRevisores] = await Promise.all([
        axios.get(`${API_URL}/admin/utilizadores`),
        axios.get(`${API_URL}/admin/revisores`),
    ]);
      // Promise.all corre as duas chamadas em paralelo
    setTodos(respostaTodos.data.dados);
    setRevisores(respostaRevisores.data.dados);
    } catch (erro) {
    Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
    setCarregando(false);
    }
};

const nomearRevisor = async (utilizador) => {
    Alert.alert('Nomear Revisor', `Nomear ${utilizador.nome} como revisor?`, [
    { text: 'Cancelar', style: 'cancel' },
    {
        text: 'Nomear',
        onPress: async () => {
        try {
            await axios.put(`${API_URL}/admin/revisores/${utilizador._id}/nomear`, {
            anoNomeacao: new Date().getFullYear(),
            });
            await carregarDados();
            Alert.alert('Sucesso', `${utilizador.nome} é agora revisor!`);
        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível nomear o revisor.');
        }
        },
    },
    ]);
};

const removerRevisor = async (utilizador) => {
    Alert.alert('Remover Revisor', `Remover papel de revisor de ${utilizador.nome}?`, [
    { text: 'Cancelar', style: 'cancel' },
    {
        text: 'Remover', style: 'destructive',
        onPress: async () => {
        try {
            await axios.put(`${API_URL}/admin/revisores/${utilizador._id}/remover`);
            await carregarDados();
        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível remover o revisor.');
        }
        },
    },
    ]);
};

const dadosFiltrados = (abaActiva === 'todos' ? todos : revisores).filter(u =>
    u.nome?.toLowerCase().includes(pesquisa.toLowerCase())
);

const renderItem = ({ item }) => {
    const eRevisor = item.papel === 'revisor';
    return (
    <View style={styles.item}>
        <View style={styles.itemInfo}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.email}>{item.email}</Text>
        {eRevisor && item.anoNomeacao && (
            <Text style={styles.ano}>Revisor desde {item.anoNomeacao}</Text>
        )}
        </View>
        {eRevisor ? (
        <TouchableOpacity style={[styles.botao, styles.botaoRemover]} onPress={() => removerRevisor(item)}>
            <Text style={styles.botaoTexto}>Remover</Text>
        </TouchableOpacity>
        ) : (
        <TouchableOpacity style={[styles.botao, styles.botaoNomear]} onPress={() => nomearRevisor(item)}>
            <Text style={styles.botaoTexto}>Nomear</Text>
        </TouchableOpacity>
        )}
    </View>
    );
};

if (carregando) {
    return <View style={styles.centrado}><ActivityIndicator size="large" color="#4b0073" /></View>;
}

return (
    <View style={styles.container}>
    <View style={styles.abas}>
        <TouchableOpacity
        style={[styles.aba, abaActiva === 'todos' && styles.abaActiva]}
        onPress={() => setAbaActiva('todos')}
        >
        <Text style={[styles.abaTexto, abaActiva === 'todos' && styles.abaTextoActivo]}>
            Todos ({todos.length})
        </Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={[styles.aba, abaActiva === 'revisores' && styles.abaActiva]}
        onPress={() => setAbaActiva('revisores')}
        >
        <Text style={[styles.abaTexto, abaActiva === 'revisores' && styles.abaTextoActivo]}>
            Revisores ({revisores.length})
        </Text>
        </TouchableOpacity>
    </View>
    <TextInput
        style={styles.pesquisa}
        placeholder="Pesquisar por nome..."
        value={pesquisa}
        onChangeText={setPesquisa}
    />
    <FlatList
        data={dadosFiltrados}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        onRefresh={carregarDados}
        refreshing={carregando}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum resultado.</Text>}
    />
    </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#F5F5F5' },
centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
abas: { flexDirection: 'row', backgroundColor: '#FFF', elevation: 2 },
aba: { flex: 1, paddingVertical: 14, alignItems: 'center' },
abaActiva: { borderBottomWidth: 3, borderBottomColor: '#4b0073' },
abaTexto: { fontSize: 14, color: '#999' },
abaTextoActivo: { color: '#4b0073', fontWeight: '700' },
pesquisa: { backgroundColor: '#FFF', margin: 12, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD' },
item: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 12, marginBottom: 8, borderRadius: 8, padding: 12, elevation: 1, alignItems: 'center' },
itemInfo: { flex: 1 },
nome: { fontSize: 15, fontWeight: '600', color: '#212121' },
email: { fontSize: 12, color: '#757575', marginTop: 2 },
ano: { fontSize: 11, color: '#4b0073', marginTop: 4 },
botao: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
botaoNomear: { backgroundColor: '#4b0073' },
botaoRemover: { backgroundColor: '#F44336' },
botaoTexto: { color: '#FFF', fontWeight: '600', fontSize: 13 },
vazio: { textAlign: 'center', color: '#999', marginTop: 40 },
});