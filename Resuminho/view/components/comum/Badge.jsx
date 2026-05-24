import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator, StyleSheet,} from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';

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
        <ActivityIndicator color={ePrimario ? '#FFF' : cores.primaria} />
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
    backgroundColor: cores.primaria,
},
secundario: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: cores.primaria,
},
desativado: {
    opacity: 0.6,
},
texto: {
    color: '#FFFFFF',
    fontSize: fontes.normal,
    fontWeight: fontes.bold,
},
textoSecundario: {
    color: cores.primaria,
},
});