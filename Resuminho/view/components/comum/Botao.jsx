import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';

export default function Input({
label, placeholder, value, onChangeText,
erro, secureTextEntry = false, keyboardType = 'default',
autoCapitalize = 'none', multiline = false, editable = true,
}) {
const [focado, setFocado] = useState(false);
const [mostrarPassword, setMostrarPassword] = useState(false);

return (
    <View style={styles.container}>
    {label && <Text style={styles.label}>{label}</Text>}
    <View style={[
        styles.inputContainer,
        focado && styles.inputFocado,
        erro && styles.inputErro,
        !editable && styles.inputDesativado,
    ]}>
        <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={cores.textoDesativado}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !mostrarPassword}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        editable={editable}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        />
        {secureTextEntry && (
        <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
            <Text style={styles.olho}>{mostrarPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
        )}
    </View>
    {erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
);
}

const styles = StyleSheet.create({
container: { marginBottom: 14 },
label: {
    fontSize: fontes.normal,
    fontWeight: fontes.semibold,
    color: cores.textoPrimario,
    marginBottom: 6,
},
inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundoCartao,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.separador,
    paddingHorizontal: 12,
},
inputFocado: { borderColor: cores.primaria },
inputErro: { borderColor: cores.erro },
inputDesativado: { backgroundColor: cores.fundo, opacity: 0.7 },
input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: fontes.normal,
    color: cores.textoPrimario,
},
olho: { fontSize: 18, padding: 4 },
erro: {
    fontSize: fontes.pequeno,
    color: cores.erro,
    marginTop: 4,
},
});