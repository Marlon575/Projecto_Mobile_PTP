import React, { useState } from 'react';
import {
  View, TextInput, StyleSheet,
  TouchableOpacity, Text,
} from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';

export default function BarraPesquisa({
  placeholder = 'Pesquisar resumos...',
  onPesquisar,
  onLimpar,
  valorInicial = '',
  autoFoco = false,
}) {
  const [texto, setTexto] = useState(valorInicial);
  const [focado, setFocado] = useState(false);

  const handleMudar = (valor) => {
    setTexto(valor);
    // Pesquisa em tempo real conforme o utilizador escreve
    if (onPesquisar) onPesquisar(valor);
  };

  const handleLimpar = () => {
    setTexto('');
    if (onLimpar) onLimpar();
    if (onPesquisar) onPesquisar('');
  };

  return (
    <View style={[
      styles.container,
      focado && styles.containerFocado,
    ]}>
      {/* Ícone de pesquisa */}
      <Text style={styles.icone}>🔍</Text>

      {/* Campo de texto */}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={cores.textoDesativado}
        value={texto}
        onChangeText={handleMudar}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        autoFocus={autoFoco}
        returnKeyType="search"
        onSubmitEditing={() => onPesquisar && onPesquisar(texto)}
        clearButtonMode="never"
      />

      {/* Botão de limpar — só aparece quando há texto */}
      {texto.length > 0 && (
        <TouchableOpacity
          style={styles.botaoLimpar}
          onPress={handleLimpar}
          activeOpacity={0.7}
        >
          <Text style={styles.botaoLimparTexto}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundoCartao,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: cores.separador,
    gap: 8,
  },
  containerFocado: {
    borderColor: cores.primaria,
    elevation: 2,
    shadowColor: cores.primaria,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  icone: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: fontes.normal,
    color: cores.textoPrimario,
    padding: 0,
  },
  botaoLimpar: {
    padding: 4,
  },
  botaoLimparTexto: {
    fontSize: 14,
    color: cores.textoSecundario,
    fontWeight: fontes.bold,
  },
});