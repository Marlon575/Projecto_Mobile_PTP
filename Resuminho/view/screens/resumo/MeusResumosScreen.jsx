import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';
import Header from '../../components/layout/Header';
import ListaResumos from '../../components/resumo/ListaResumos';
import { useResumoContext } from '../../../viewmodel/context/ResumoContext';

export default function MeusResumosScreen({ navigation }) {
const { meusResumos, carregando, carregarMeusResumos } = useResumoContext();

useEffect(() => {
    carregarMeusResumos();
}, []);

return (
    <View style={styles.container}>
    <Header
        titulo="Meus Resumos"
        onVoltar={() => navigation.goBack()}
        acaoDireita={
        <TouchableOpacity onPress={() => navigation.navigate('PublicarResumo')}>
            <Text style={styles.botaoPublicar}>＋</Text>
        </TouchableOpacity>
        }
    />
    <ListaResumos
        resumos={meusResumos}
        carregando={carregando}
        onResumoPress={resumo => navigation.navigate('DetalheResumo', { resumo })}
        onRefresh={carregarMeusResumos}
        mostrarEstado
        mensagemVazia="Ainda não publicaste nenhum resumo."
    />
    </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: cores.fundo },
botaoPublicar: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: fontes.bold,
},
});