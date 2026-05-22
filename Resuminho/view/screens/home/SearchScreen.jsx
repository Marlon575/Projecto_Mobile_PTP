import React, { useState, useEffect } from 'react';
import {
View, Text, StyleSheet, ActivityIndicator,
} from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';
import BarraPesquisa from '../../components/layout/BarraPesquisa';
import ListaResumos from '../../components/resumo/ListaResumos';
import FiltroCategoria from '../../components/resumo/FiltroCategoria';
import { useResumoContext } from '../../../viewmodel/context/ResumoContext';

export default function SearchScreen({ navigation, route }) {
const { resumos, carregando, carregarResumos } = useResumoContext();
const [pesquisa, setPesquisa] = useState(route.params?.pesquisa || '');
const [filtros, setFiltros] = useState({});

useEffect(() => {
    carregarResumos({ pesquisa, ...filtros });
}, [pesquisa, filtros]);

return (
    <View style={styles.container}>
    <View style={styles.cabecalho}>
        <BarraPesquisa
        placeholder="Pesquisar resumos..."
        onPesquisar={setPesquisa}
        valorInicial={pesquisa}
        autoFoco
        />
        <FiltroCategoria
        onFiltrar={setFiltros}
        filtroActivo={filtros}
        />
    </View>

    {pesquisa.length > 0 && (
        <Text style={styles.resultados}>
        {carregando ? 'A pesquisar...' : `${resumos.length} resultado(s) para "${pesquisa}"`}
        </Text>
    )}

    <ListaResumos
        resumos={resumos}
        carregando={carregando}
        onResumoPress={resumo => navigation.navigate('DetalheResumo', { resumo })}
        onRefresh={() => carregarResumos({ pesquisa, ...filtros })}
        mensagemVazia={pesquisa ? 'Nenhum resumo encontrado.' : 'Escreve algo para pesquisar.'}
    />
    </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: cores.fundo },
cabecalho: {
    padding: 16,
    backgroundColor: cores.fundoCartao,
    gap: 12,
    elevation: 2,
},
resultados: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: fontes.normal,
    color: cores.textoSecundario,
},
});