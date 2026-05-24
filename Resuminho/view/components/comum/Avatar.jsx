import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// API pública DiceBear — gera avatar automático com as iniciais do utilizador
// Documentação: https://www.dicebear.com/how-to-use/http-api

export default function Avatar({ uri = null, nome = '', tamanho = 60 }) {

  // Monta a URL da API pública DiceBear
  // seed = nome do utilizador → gera sempre o mesmo avatar para o mesmo nome
  const urlDiceBear = `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(nome)}&size=${tamanho * 2}&backgroundColor=1e40af,7c3aed,be185d`;

  // Se tiver foto própria usa ela, senão consome a API DiceBear
const fonte = uri
    ? { uri }
    : { uri: urlDiceBear };

return (
    <View style={[
    estilos.contentor,
    { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }
    ]}>
    <Image
        source={fonte}
        style={[
        estilos.imagem,
        { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }
        ]}
    />
    </View>
);
}

const estilos = StyleSheet.create({
contentor: {
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
},
imagem: {
    resizeMode: 'cover',
},
});