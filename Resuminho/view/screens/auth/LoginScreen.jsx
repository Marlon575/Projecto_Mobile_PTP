import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';
import Input from '../../components/comum/Input';
import Botao from '../../components/comum/Botao';
import Alerta from '../../components/comum/Alerta';
import useAuth from '../../../viewmodel/hooks/useAuth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { fazerLogin, carregando, erro, errosForm, limparErros } = useAuth();

  const handleLogin = async () => {
    const sucesso = await fazerLogin(email, password);
    if (sucesso) navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.cabecalho}>
          <Text style={styles.logo}>📚</Text>
          <Text style={styles.titulo}>Resuminho</Text>
          <Text style={styles.subtitulo}>A plataforma de resumos da UJAC</Text>
        </View>

        <View style={styles.formulario}>
          <Alerta tipo="erro" mensagem={erro} onFechar={limparErros} />

          <Input
            label="Email"
            placeholder="o.teu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            erro={errosForm.email}
          />
          <Input
            label="Password"
            placeholder="A tua password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            erro={errosForm.password}
          />

          <Botao
            texto="Entrar"
            onPress={handleLogin}
            carregando={carregando}
            icone="🔐"
          />

          <TouchableOpacity
            style={styles.linkRegisto}
            onPress={() => navigation.navigate('Registo')}
          >
            <Text style={styles.linkRegistoTexto}>
              Não tens conta?{' '}
              <Text style={styles.linkRegistoDestaque}>Regista-te aqui</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  cabecalho: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 64, marginBottom: 12 },
  titulo: {
    fontSize: fontes.display,
    fontWeight: fontes.extrabold,
    color: cores.primaria,
  },
  subtitulo: {
    fontSize: fontes.normal,
    color: cores.textoSecundario,
    marginTop: 4,
    textAlign: 'center',
  },
  formulario: {
    backgroundColor: cores.fundoCartao,
    borderRadius: 16,
    padding: 24,
    elevation: 2,
  },
  linkRegisto: { marginTop: 16, alignItems: 'center' },
  linkRegistoTexto: { fontSize: fontes.normal, color: cores.textoSecundario },
  linkRegistoDestaque: { color: cores.primaria, fontWeight: fontes.bold },
});