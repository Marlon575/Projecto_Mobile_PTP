import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import api from '../../../viewmodel/services/api';

export default function PublicarScreen() {
  const [titulo, setTitulo]         = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [curso, setCurso]           = useState('');
  const [ano, setAno]               = useState('1');
  const [descricao, setDescricao]   = useState('');
  const [ficheiroPDF, setFicheiroPDF] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro]             = useState(null);

  // Abre o selector de ficheiros PDF
  const escolherPDF = async () => {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (!resultado.canceled && resultado.assets?.length > 0) {
        setFicheiroPDF(resultado.assets[0]);
        setErro(null);
      }
    } catch (err) {
      setErro('Erro ao seleccionar o ficheiro.');
    }
  };

  // Valida os campos antes de enviar
  const validar = () => {
    if (!titulo.trim())     return 'O título é obrigatório.';
    if (!disciplina.trim()) return 'A disciplina é obrigatória.';
    if (!curso.trim())      return 'O curso é obrigatório.';
    if (!ficheiroPDF)       return 'Selecciona um ficheiro PDF.';
    return null;
  };

  // Envia o resumo para o servidor
  const publicar = async () => {
    const erroValidacao = validar();
    if (erroValidacao) { setErro(erroValidacao); return; }

    try {
      setCarregando(true);
      setErro(null);

      // FormData — necessário para enviar ficheiros binários
      const formData = new FormData();
      formData.append('titulo',     titulo);
      formData.append('disciplina', disciplina);
      formData.append('curso',      curso);
      formData.append('ano',        ano);
      formData.append('descricao',  descricao);

      // Adiciona o ficheiro PDF
      formData.append('pdf', {
        uri:  ficheiroPDF.uri,
        name: ficheiroPDF.name,
        type: 'application/pdf',
      });

      // POST /resumos com header multipart/form-data
      await api.post('/resumos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert(
        '✅ Publicado!',
        'O teu resumo foi submetido e aguarda aprovação de 2 revisores.',
        [{ text: 'OK', onPress: () => {
          setTitulo(''); setDisciplina(''); setCurso('');
          setAno('1'); setDescricao(''); setFicheiroPDF(null);
        }}]
      );
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao publicar.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Cabeçalho roxo */}
      <View style={styles.cabecalho}>
        <Text style={styles.tituloPagina}>Publicar Resumo</Text>
        <Text style={styles.subtitulo}>Partilha o teu conhecimento</Text>
      </View>

      <View style={styles.formulario}>

        {/* Mensagem de erro */}
        {erro && (
          <View style={styles.erroContainer}>
            <Text style={styles.erroTexto}>❌ {erro}</Text>
          </View>
        )}

        {/* Campo Título */}
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex: Resumo de Álgebra Linear"
          placeholderTextColor="#BDBDBD"
        />

        {/* Campo Disciplina */}
        <Text style={styles.label}>Disciplina *</Text>
        <TextInput
          style={styles.input}
          value={disciplina}
          onChangeText={setDisciplina}
          placeholder="Ex: Matemática"
          placeholderTextColor="#BDBDBD"
        />

        {/* Campo Curso */}
        <Text style={styles.label}>Curso *</Text>
        <TextInput
          style={styles.input}
          value={curso}
          onChangeText={setCurso}
          placeholder="Ex: Informática"
          placeholderTextColor="#BDBDBD"
        />

        {/* Campo Ano */}
        <Text style={styles.label}>Ano</Text>
        <TextInput
          style={styles.input}
          value={ano}
          onChangeText={setAno}
          placeholder="Ex: 2"
          placeholderTextColor="#BDBDBD"
          keyboardType="numeric"
        />

        {/* Campo Descrição */}
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Breve descrição do conteúdo"
          placeholderTextColor="#BDBDBD"
          multiline
          numberOfLines={4}
        />

        {/* Selector de PDF */}
        <Text style={styles.label}>Ficheiro PDF *</Text>
        <TouchableOpacity style={styles.selectorPDF} onPress={escolherPDF}>
          {ficheiroPDF ? (
            <View style={styles.pdfSeleccionado}>
              <Text style={styles.pdfIcone}>📄</Text>
              <Text style={styles.pdfNome} numberOfLines={2}>
                {ficheiroPDF.name}
              </Text>
              <Text style={styles.pdfTamanho}>
                {(ficheiroPDF.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </View>
          ) : (
            <View style={styles.pdfVazio}>
              <Text style={styles.pdfVazioIcone}>📎</Text>
              <Text style={styles.pdfVazioTexto}>Toca para seleccionar PDF</Text>
              <Text style={styles.pdfVazioSub}>Máximo 10MB</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Botão Publicar */}
        <TouchableOpacity
          style={[styles.botao, carregando && styles.botaoDesativado]}
          onPress={publicar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.botaoTexto}>📤 Publicar Resumo</Text>
          )}
        </TouchableOpacity>

      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#f5f5f5' },
  cabecalho:    { backgroundColor: '#73057d', padding: 20, paddingTop: 50 },
  tituloPagina: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  subtitulo:    { fontSize: 13, color: '#e0b3e8', marginTop: 2 },
  formulario:   { margin: 16 },
  erroContainer: {
    backgroundColor: '#FFEBEE', borderRadius: 8, padding: 12,
    marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#F44336',
  },
  erroTexto: { color: '#F44336', fontSize: 13 },
  label: {
    fontSize: 13, fontWeight: '700',
    color: '#212121', marginBottom: 6, marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF', borderRadius: 8,
    borderWidth: 1, borderColor: '#E0E0E0',
    paddingHorizontal: 12, paddingVertical: 12,
    fontSize: 14, color: '#212121',
  },
  inputMultiline: { height: 100, textAlignVertical: 'top' },
  selectorPDF: {
    backgroundColor: '#FFFFFF', borderRadius: 8,
    borderWidth: 2, borderColor: '#E0E0E0',
    borderStyle: 'dashed', padding: 20,
    alignItems: 'center', marginTop: 6,
  },
  pdfSeleccionado: { alignItems: 'center' },
  pdfIcone:    { fontSize: 40, marginBottom: 8 },
  pdfNome:     { fontSize: 13, fontWeight: '600', color: '#212121', textAlign: 'center' },
  pdfTamanho:  { fontSize: 11, color: '#757575', marginTop: 4 },
  pdfVazio:    { alignItems: 'center' },
  pdfVazioIcone: { fontSize: 40, marginBottom: 8 },
  pdfVazioTexto: { fontSize: 14, fontWeight: '600', color: '#424242' },
  pdfVazioSub:   { fontSize: 12, color: '#BDBDBD', marginTop: 4 },
  botao: {
    backgroundColor: '#73057d', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 20,
  },
  botaoDesativado: { opacity: 0.6 },
  botaoTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});