import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';

export default function Loading({ mensagem = 'A carregar...' }) {
return (
    <View style={styles.container}>
    <ActivityIndicator size="large" color={cores.primaria} />
    <Text style={styles.texto}>{mensagem}</Text>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.fundo,
},
texto: {
    marginTop: 12,
    fontSize: fontes.normal,
    color: cores.textoSecundario,
},
});