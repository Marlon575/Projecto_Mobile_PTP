import React, { useState } from 'react';
import {
View, Text, StyleSheet, TextInput,
TouchableOpacity, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';
import Header from '../../components/layout/Header';
import AvaliacaoEstrelas from '../../components/resumo/AvaliacaoEstrelas';
import { avaliarResumo, calcularPontos } from '../../../viewmodel/services/avaliacaoService';

export default function AvaliarResumoScreen({ navigation, route }) {
const { resumo } = route.params;
const [estrelas, setEstrelas] = useState(0);
const [comentario, setComentario] = useState('');
const [carregando, setCarregando] = useState(false);

const pontos = calcularPontos(estrelas);

const handleAvaliar = async () => {
    if (estrelas === 0) {
    Alert.alert('Atenção', 'Selecciona pelo menos 1 estrela.');
    return;
    }
    try {
    setCarregando(true);
    await avaliarResumo(resumo._id, estrelas, comentario, null);
    Alert.alert(
        'Obrigado!',
        `Avaliação enviada! Ganhaste ${pontos} pontos.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
    } catch (erro) {
    Alert.alert('Erro', erro.message);
    } finally {
    setCarregando(false);
    }
};

return (
    <View style={styles.container}>
    <Header
        titulo="Avaliar Resumo"
        onVoltar={() => navigation.goBack()}
    />
    <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cartao}>
        <Text style={styles.disciplina}>
            {resumo.disciplina?.nome || resumo.disciplina}
        </Text>
        </View>

        <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>A tua avaliação</Text>
        <View style={styles.estrelasContainer}>
            <AvaliacaoEstrelas
            valor={estrelas}
            onChange={setEstrelas}
            tamanho="grande"
            mostrarPontos
            />
        </View>
        {estrelas > 0 && (
            <Text style={styles.pontosTexto}>
            Vais ganhar {pontos} pontos com esta avaliação!
            </Text>
        )}
        </View>

        <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Comentário (opcional)</Text>
        <TextInput
            style={styles.inputComentario}
            placeholder="Escreve um comentário sobre este resumo..."
            placeholderTextColor={cores.textoDesativado}
            value={comentario}
            onChangeText={setComentario}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
        />
        </View>

        <TouchableOpacity
        style={[styles.botaoEnviar, estrelas === 0 && styles.botaoDesativado]}
        onPress={handleAvaliar}
        disabled={carregando || estrelas === 0}
        >
        {carregando
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.botaoEnviarTexto}>⭐ Enviar Avaliação</Text>
        }
        </TouchableOpacity>
    </ScrollView>
    </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: cores.fundo },
conteudo: { padding: 16 },
cartao: {
    backgroundColor: cores.fundoCartao,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
},
tituloResumo: {
    fontSize: fontes.grande,
    fontWeight: fontes.bold,
    color: cores.textoPrimario,
    marginBottom: 6,
},
disciplina: {
    fontSize: fontes.normal,
    color: cores.secundaria,
},
secao: { marginBottom: 20 },
secaoTitulo: {
    fontSize: fontes.medio,
    fontWeight: fontes.bold,
    color: cores.textoPrimario,
    marginBottom: 12,
},
estrelasContainer: {
    alignItems: 'center',
    paddingVertical: 16,
},
pontosTexto: {
    textAlign: 'center',
    fontSize: fontes.normal,
    color: cores.aprovado,
    fontWeight: fontes.semibold,
    marginTop: 8,
},
inputComentario: {
    backgroundColor: cores.fundoCartao,
    borderRadius: 8,
    padding: 12,
    fontSize: fontes.normal,
    color: cores.textoPrimario,
    borderWidth: 1,
    borderColor: cores.separador,
    minHeight: 100,
},
botaoEnviar: {
    backgroundColor: cores.destaque,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
},
botaoDesativado: { backgroundColor: cores.textoDesativado },
botaoEnviarTexto: {
    color: '#FFFFFF',
    fontSize: fontes.medio,
    fontWeight: fontes.bold,
},
});