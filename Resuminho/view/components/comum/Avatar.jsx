import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';

export default function Avatar({ uri, nome, tamanho = 60 }) {
const iniciais = nome
    ? nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    : '?';

return uri ? (
    <Image
    source={{ uri }}
    style={[styles.imagem, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]}
    />
) : (
    <View style={[
    styles.placeholder,
    { width: tamanho, height: tamanho, borderRadius: tamanho / 2 },
    ]}>
      <Text style={[styles.iniciais, { fontSize: tamanho * 0.35 }]}>{iniciais}</Text>
    </View>
);
}

const styles = StyleSheet.create({
imagem: { borderWidth: 2, borderColor: cores.primaria },
placeholder: {
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
},
iniciais: { color: '#FFFFFF', fontWeight: fontes.bold },
});