// Ecrã principal do painel de administração.
// Mostra estatísticas gerais e botões para os outros ecrãs de gestão.

import React, { useEffect, useState } from 'react';
import {
View, Text, StyleSheet, ScrollView,
TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000';
// 10.0.2.2 é o IP do computador visto pelo emulador Android
// Se usares telemóvel real, muda para o IP local do teu computador (ex: 192.168.1.x)

export default function AdminDashboardScreen({ navigation }) {
const [estatisticas, setEstatisticas] = useState(null);

const [carregando, setCarregando] = useState(true);

useEffect(() => {
    carregarEstatisticas();
}, []);


const carregarEstatisticas = async () => {
    try {
    setCarregando(true);
    const resposta = await axios.get(`${API_URL}/admin/estatisticas`);
    setEstatisticas(resposta.data.dados);
    } catch (erro) {
    Alert.alert('Erro', 'Não foi possível carregar as estatísticas.');
    } finally {
    setCarregando(false);
    
    }
};

const CartaoEstatistica = ({ titulo, valor, cor }) => (
    <View style={[styles.cartao, { borderLeftColor: cor }]}>
    <Text style={styles.cartaoValor}>{valor ?? '—'}</Text>
    <Text style={styles.cartaoTitulo}>{titulo}</Text>
    </View>
);

const BotaoNavegacao = ({ titulo, destino, cor }) => (
    <TouchableOpacity
    style={[styles.botaoNav, { backgroundColor: cor }]}
    onPress={() => navigation.navigate(destino)}
    >
    <Text style={styles.botaoNavTexto}>{titulo}</Text>
    </TouchableOpacity>
);

if (carregando) {
    return (
    <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#4b0073" />
        <Text style={styles.textoCarregando}>A carregar...</Text>
    </View>
    );
}

return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
    <Text style={styles.titulo}>Painel de Administração</Text>
    <Text style={styles.subtitulo}>Resuminho — UJAC</Text>

    <Text style={styles.secaoTitulo}>Visão Geral</Text>

    <View style={styles.grade}>
        <CartaoEstatistica titulo="Utilizadores" valor={estatisticas?.totalUtilizadores} cor="#4b0073" />
        <CartaoEstatistica titulo="Revisores" valor={estatisticas?.totalRevisores} cor="#7C3AED" />
        <CartaoEstatistica titulo="Cursos" valor={estatisticas?.totalCursos} cor="#FF9800" />
        <CartaoEstatistica titulo="Disciplinas" valor={estatisticas?.totalDisciplinas} cor="#4CAF50" />
        <CartaoEstatistica titulo="Resumos" valor={estatisticas?.totalResumos} cor="#F44336" />
        <CartaoEstatistica titulo="Pendentes" valor={estatisticas?.resumosPendentes} cor="#FF5722" />
    </View>

    <Text style={styles.secaoTitulo}>Gestão</Text>

    <BotaoNavegacao titulo="👥 Gerir Utilizadores" destino="GerirUtilizadores" cor="#4b0073" />
    <BotaoNavegacao titulo="✅ Gerir Revisores" destino="GerirRevisores" cor="#7C3AED" />
    <BotaoNavegacao titulo="🎓 Gerir Cursos" destino="GerirCursos" cor="#FF9800" />
    <BotaoNavegacao titulo="📚 Gerir Disciplinas" destino="GerirDisciplinas" cor="#4CAF50" />

    <TouchableOpacity style={styles.botaoActualizar} onPress={carregarEstatisticas}>
        <Text style={styles.botaoActualizarTexto}>🔄 Actualizar Dados</Text>
    </TouchableOpacity>
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#F5F5F5' },
conteudo: { padding: 16, paddingBottom: 40 },
centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
textoCarregando: { marginTop: 12, color: '#666', fontSize: 14 },
titulo: { fontSize: 24, fontWeight: 'bold', color: '#4b0073', textAlign: 'center', marginTop: 8 },
subtitulo: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
secaoTitulo: {
    fontSize: 16, fontWeight: '700', color: '#333',
    marginTop: 16, marginBottom: 12,
    textTransform: 'uppercase', letterSpacing: 1,
},
grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
cartao: {
    backgroundColor: '#FFF', borderRadius: 8, padding: 16,
    width: '47%', borderLeftWidth: 4,
    elevation: 2, alignItems: 'center',
},
cartaoValor: { fontSize: 28, fontWeight: 'bold', color: '#212121' },
cartaoTitulo: { fontSize: 12, color: '#757575', marginTop: 4, textAlign: 'center' },
botaoNav: { borderRadius: 8, padding: 16, marginBottom: 10, alignItems: 'center' },
botaoNavTexto: { color: '#FFF', fontSize: 16, fontWeight: '600' },
botaoActualizar: { marginTop: 16, padding: 14, backgroundColor: '#ECEFF1', borderRadius: 8, alignItems: 'center' },
botaoActualizarTexto: { color: '#455A64', fontWeight: '600' },
});