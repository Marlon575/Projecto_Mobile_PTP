import React, { useState } from 'react';
import {
View, Text, StyleSheet, ScrollView,
TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';
import Header from '../../components/layout/Header';
import AvaliacaoEstrelas from '../../components/resumo/AvaliacaoEstrelas';
import VisualizadorPDF from '../../components/resumo/VisualizadorPDF';
import { formatarDataCompleta } from '../../../viewmodel/utils/formatarData';
import useResumos from '../../../viewmodel/hooks/useResumos';

export default function DetalheResumoScreen({ navigation, route }) {
const { resumo } = route.params;
const [mostrarPDF, setMostrarPDF] = useState(false);
const { descarregar, carregando } = useResumos();

const handleDescarregar = async () => {
    const resultado = await descarregar(resumo._id, resumo.titulo);
    if (resultado?.sucesso) {
    Alert.alert('Sucesso', 'Resumo descarregado com sucesso!');
    }
};

return (
    <View style={styles.container}>
    <Header
        titulo="Detalhe do Resumo"
        onVoltar={() => navigation.goBack()}
    />
    <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.info}>
        <View style={styles.iconeContainer}>
            <Text style={styles.icone}>📄</Text>
        </View>
        <Text style={styles.titulo}>{resumo.titulo}</Text>
        <Text style={styles.disciplina}>
            {resumo.disciplina?.nome || resumo.disciplina}
        </Text>
        <Text style={styles.data}>
            Publicado em {formatarDataCompleta(resumo.createdAt)}
        </Text>

        <View style={styles.avaliacaoContainer}>
            <AvaliacaoEstrelas
            valor={Math.round(resumo.mediaAvaliacoes || 0)}
            soLeitura
            tamanho="grande"
            mostrarContagem
            contagem={resumo.totalAvaliacoes || 0}
            />
        </View>

        <View style={styles.estatisticas}>
            <View style={styles.stat}>
            <Text style={styles.statValor}>
                {resumo.totalDownloads || 0}
            </Text>
            <Text style={styles.statLabel}>Downloads</Text>
            </View>
            <View style={styles.separadorVertical} />
            <View style={styles.stat}>
            <Text style={styles.statValor}>
                {resumo.totalAvaliacoes || 0}
            </Text>
            <Text style={styles.statLabel}>Avaliações</Text>
            </View>
            <View style={styles.separadorVertical} />
            <View style={styles.stat}>
            <Text style={styles.statValor}>
                {(resumo.mediaAvaliacoes || 0).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Média</Text>
            </View>
        </View>
        </View>

        {mostrarPDF && (
        <View style={styles.pdfContainer}>
            <VisualizadorPDF
            uri={resumo.ficheiro}
            titulo={resumo.titulo}
            />
        </View>
        )}

        <View style={styles.botoes}>
        <TouchableOpacity
            style={styles.botaoPreview}
            onPress={() => setMostrarPDF(!mostrarPDF)}
        >
            <Text style={styles.botaoPreviewTexto}>
            {mostrarPDF ? '🔼 Fechar PDF' : '👁️ Pré-visualizar'}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.botaoDescarregar}
            onPress={handleDescarregar}
            disabled={carregando}
        >
            {carregando
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.botaoDescarregarTexto}>⬇️ Descarregar</Text>
            }
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.botaoAvaliar}
            onPress={() => navigation.navigate('AvaliarResumo', { resumo })}
        >
            <Text style={styles.botaoAvaliarTexto}>⭐ Avaliar</Text>
        </TouchableOpacity>
        </View>
    </ScrollView>
    </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: cores.fundo },
info: {
    backgroundColor: cores.fundoCartao,
    padding: 20,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    elevation: 2,
},
iconeContainer: {
    width: 70, height: 70,
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
},
icone: { fontSize: 36 },
titulo: {
    fontSize: fontes.titulo,
    fontWeight: fontes.bold,
    color: cores.textoPrimario,
    textAlign: 'center',
    marginBottom: 8,
},
disciplina: {
    fontSize: fontes.medio,
    color: cores.secundaria,
    marginBottom: 4,
},
data: {
    fontSize: fontes.normal,
    color: cores.textoSecundario,
    marginBottom: 12,
},
avaliacaoContainer: { marginBottom: 16 },
estatisticas: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
},
stat: { alignItems: 'center' },
statValor: {
    fontSize: fontes.titulo,
    fontWeight: fontes.bold,
    color: cores.primaria,
},
statLabel: {
    fontSize: fontes.pequeno,
    color: cores.textoSecundario,
},
separadorVertical: {
    width: 1, height: 40,
    backgroundColor: cores.separador,
},
pdfContainer: {
    height: 400,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
},
botoes: { padding: 16, gap: 10 },
botaoPreview: {
    padding: 14, borderRadius: 8,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.separador,
},
botaoPreviewTexto: {
    fontSize: fontes.medio,
    color: cores.textoPrimario,
    fontWeight: fontes.semibold,
},
botaoDescarregar: {
    padding: 14, borderRadius: 8,
    backgroundColor: cores.primaria,
    alignItems: 'center',
},
botaoDescarregarTexto: {
    fontSize: fontes.medio,
    color: '#FFFFFF',
    fontWeight: fontes.bold,
},
botaoAvaliar: {
    padding: 14, borderRadius: 8,
    backgroundColor: cores.destaque,
    alignItems: 'center',
},
botaoAvaliarTexto: {
    fontSize: fontes.medio,
    color: '#FFFFFF',
    fontWeight: fontes.bold,
},
});