import React from 'react';
import {
TouchableOpacity, Text, ActivityIndicator, StyleSheet,
} from 'react-native';

export default function Botao({
texto,
onPress,
carregando = false,
desativado = false,
variante = 'primario',
icone,
}) {
const ePrimario = variante === 'primario';
const eSecundario = variante === 'secundario';

return (
    <TouchableOpacity
    style={[
        styles.botao,
        ePrimario && styles.primario,
        eSecundario && styles.secundario,
        (desativado || carregando) && styles.desativado,
    ]}
    onPress={onPress}
    disabled={desativado || carregando}
    activeOpacity={0.8}
    >
    {carregando ? (
        <ActivityIndicator color="#FFFFFF" />
    ) : (
        <Text style={[styles.texto, eSecundario && styles.textoSecundario]}>
        {icone ? `${icone} ${texto}` : texto}
        </Text>
    )}
    </TouchableOpacity>
);
}

const styles = StyleSheet.create({
botao: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
},
primario: {
    backgroundColor: '#73057d',
},
secundario: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#73057d',
},
desativado: {
    opacity: 0.6,
},
texto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
},
textoSecundario: {
    color: '#73057d',
},
});