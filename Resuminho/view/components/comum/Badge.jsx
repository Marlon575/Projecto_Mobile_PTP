import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import fontes from '../../constants/fontes';
import { obterNivel } from '../../../viewmodel/utils/nivelEstudante';

export default function Badge({ pontos = 0, tamanho = 'normal' }) {
const nivel = obterNivel(pontos);
const ePequeno = tamanho === 'pequeno';

return (
    <View style={[styles.container, { backgroundColor: nivel.cor }, ePequeno && styles.containerPequeno]}>
    <Text style={ePequeno ? styles.iconePequeno : styles.icone}>{nivel.icone}</Text>
    <Text style={[styles.texto, ePequeno && styles.textoPequeno]}>{nivel.nome}</Text>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 4,
},
containerPequeno: { paddingHorizontal: 8, paddingVertical: 4 },
icone: { fontSize: 16 },
iconePequeno: { fontSize: 12 },
texto: { color: '#FFFFFF', fontSize: fontes.normal, fontWeight: fontes.bold },
textoPequeno: { fontSize: fontes.pequeno },
});