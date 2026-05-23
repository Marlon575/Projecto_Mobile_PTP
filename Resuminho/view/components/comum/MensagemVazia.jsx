import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';

export default function MensagemVazia({ icone = '📭', titulo, descricao }) {
return (
    <View style={styles.container}>
    <Text style={styles.icone}>{icone}</Text>
    {titulo && <Text style={styles.titulo}>{titulo}</Text>}
    {descricao && <Text style={styles.descricao}>{descricao}</Text>}
    </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
icone: { fontSize: 48, marginBottom: 16 },
titulo: {
    fontSize: fontes.grande,
    fontWeight: fontes.bold,
    color: cores.textoPrimario,
    textAlign: 'center',
    marginBottom: 8,
},
descricao: {
    fontSize: fontes.normal,
    color: cores.textoSecundario,
    textAlign: 'center',
},
});