import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import cores from '../../constants/cores';
import Header from '../../components/layout/Header';
import ListaResumos from '../../components/resumo/ListaResumos';
import FiltroCategoria from '../../components/resumo/FiltroCategoria';
import { useResumoContext } from '../../../viewmodel/context/ResumoContext';

export default function ListaResumosScreen({ navigation, route }) {
const {
    resumos, carregando, carregarResumos, actualizarFiltros,
} = useResumoContext();

useEffect(() => {
    carregarResumos(route.params?.filtros || {});
}, []);

return (
    <View style={styles.container}>
    <Header
        titulo="Resumos"
        onVoltar={() => navigation.goBack()}
    />
    <View style={styles.filtro}>
        <FiltroCategoria
        onFiltrar={actualizarFiltros}
        filtroActivo={route.params?.filtros || {}}
        />
    </View>
    <ListaResumos
        resumos={resumos}
        carregando={carregando}
        onResumoPress={resumo => navigation.navigate('DetalheResumo', { resumo })}
        onRefresh={() => carregarResumos(route.params?.filtros || {})}
        mensagemVazia="Nenhum resumo aprovado disponível."
    />
    </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: cores.fundo },
filtro: { padding: 12, backgroundColor: cores.fundoCartao },
});