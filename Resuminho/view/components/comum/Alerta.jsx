import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';

export default function Alerta({ tipo = 'info', mensagem, onFechar }) {
const config = {
    sucesso: { cor: cores.aprovado, fundo: '#E8F5E9', icone: '✅' },
    erro: { cor: cores.erro, fundo: '#FFEBEE', icone: '❌' },
    aviso: { cor: cores.aviso, fundo: '#FFF3E0', icone: '⚠️' },
    info: { cor: cores.secundaria, fundo: '#E3F2FD', icone: 'ℹ️' },
}[tipo] || { cor: cores.secundaria, fundo: '#E3F2FD', icone: 'ℹ️' };

if (!mensagem) return null;

return (
    <View style={[styles.container, { backgroundColor: config.fundo, borderLeftColor: config.cor }]}>
    <Text style={styles.icone}>{config.icone}</Text>
    <Text style={[styles.mensagem, { color: config.cor }]}>{mensagem}</Text>
    {onFechar && (
        <TouchableOpacity onPress={onFechar}>
        <Text style={[styles.fechar, { color: config.cor }]}>✕</Text>
        </TouchableOpacity>
    )}
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 12,
    gap: 8,
},
icone: { fontSize: 16 },
mensagem: { flex: 1, fontSize: fontes.normal, fontWeight: fontes.semibold },
fechar: { fontSize: 16, fontWeight: fontes.bold },
});