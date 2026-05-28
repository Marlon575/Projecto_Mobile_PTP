import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, ScrollView, Alert
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { publicarResumo } from '../../../viewmodel/services/resumoService';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';

export default function PublicarResumoScreen({ navigation }) {
const [titulo, setTitulo] = useState('');
const [disciplina, setDisciplina] = useState('');
const [curso, setCurso] = useState('');
const [ano, setAno] = useState('');
const [descricao, setDescricao] = useState('');
const [pdf, setPdf] = useState(null);
const [carregando, setCarregando] = useState(false);

const escolherPDF = async () => {
    try {
    const resultado = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
    });
    if (!resultado.canceled) {
        setPdf(resultado.assets[0]);
    }
    } catch (erro) {
    Alert.alert('Erro', 'Não foi possível seleccionar o ficheiro.');
    }
};

const submeter = async () => {
    if (!titulo || !disciplina || !curso || !ano || !pdf) {
    Alert.alert('Atenção', 'Preenche todos os campos e selecciona um PDF.');
    return;
    }
    try {
    setCarregando(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('disciplina', disciplina);
    formData.append('curso', curso);
    formData.append('ano', ano);
    formData.append('descricao', descricao);
    formData.append('pdf', {
        uri: pdf.uri,
        name: pdf.name,
        type: 'application/pdf',
    });
    await publicarResumo(formData);
    Alert.alert('Sucesso', 'Resumo submetido! Aguarda aprovação.');
    navigation.goBack();
    } catch (erro) {
    Alert.alert('Erro', erro.message || 'Erro ao submeter resumo.');
    } finally {
    setCarregando(false);
    }
};

return (
    <ScrollView style={estilos.container}>
    <Text style={estilos.titulo}>📄 Submeter Resumo</Text>

      <Text style={estilos.label}>Título *</Text>
    <TextInput style={estilos.input} value={titulo}
        onChangeText={setTitulo} placeholder="Ex: Resumo de Cálculo I" />

      <Text style={estilos.label}>Disciplina *</Text>
    <TextInput style={estilos.input} value={disciplina}
        onChangeText={setDisciplina} placeholder="Ex: Matemática" />

      <Text style={estilos.label}>Curso *</Text>
    <TextInput style={estilos.input} value={curso}
        onChangeText={setCurso} placeholder="Ex: Informatica" />

      <Text style={estilos.label}>Ano Curricular *</Text>
    <TextInput style={estilos.input} value={ano}
        onChangeText={setAno} placeholder="Ex: 1" keyboardType="numeric" />

    <Text style={estilos.label}>Descrição</Text>
    <TextInput style={[estilos.input, { height: 80 }]} value={descricao}
        onChangeText={setDescricao} placeholder="Descrição do resumo"
        multiline />

    <TouchableOpacity style={estilos.botaoPDF} onPress={escolherPDF}>
        <Text style={estilos.botaoPDFTexto}>
        {pdf ? `✅ ${pdf.name}` : '📎 Seleccionar PDF'}
        </Text>
    </TouchableOpacity>

    <TouchableOpacity
        style={[estilos.botao, carregando && { opacity: 0.6 }]}
        onPress={submeter} disabled={carregando}>
        <Text style={estilos.botaoTexto}>
        {carregando ? 'A submeter...' : '🚀 Submeter Resumo'}
        </Text>
    </TouchableOpacity>
    </ScrollView>
);
}

const estilos = StyleSheet.create({
container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
titulo: { fontSize: 22, fontWeight: 'bold', color: cores.primaria,
    marginBottom: 20, marginTop: 40, textAlign: 'center' },
label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
input: { backgroundColor: '#fff', borderRadius: 8, padding: 12,
    marginBottom: 12, borderWidth: 1, borderColor: '#ddd', fontSize: 14 },
botaoPDF: { backgroundColor: '#f0f0f0', borderRadius: 8, padding: 14,
    alignItems: 'center', marginBottom: 12, borderWidth: 1,
    borderColor: cores.primaria, borderStyle: 'dashed' },
botaoPDFTexto: { color: cores.primaria, fontWeight: '600' },
botao: { backgroundColor: cores.primaria, borderRadius: 8,
    padding: 16, alignItems: 'center', marginBottom: 30 },
botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});