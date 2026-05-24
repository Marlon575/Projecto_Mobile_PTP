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

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [ano, setAno] = useState('1');
  const { fazerRegisto, carregando, erro, errosForm, limparErros } = useAuth();

  const handleRegisto = async () => {
  await fazerRegisto(nome, email, password, confirmar, { ano });
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>Criar Conta</Text>
          <Text style={styles.subtitulo}>Junta-te à comunidade Resuminho</Text>
        </View>

        <View style={styles.formulario}>
          <Alerta tipo="erro" mensagem={erro} onFechar={limparErros} />

          <Input label="Nome completo" placeholder="O teu nome"
            value={nome} onChangeText={setNome}
            autoCapitalize="words" erro={errosForm.nome} />
          <Input label="Email" placeholder="o.teu@email.com"
            value={email} onChangeText={setEmail}
            keyboardType="email-address" erro={errosForm.email} />
          <Input label="Ano curricular" placeholder="Ex: 1"
            value={ano} onChangeText={setAno}
            keyboardType="numeric" />
          <Input label="Password" placeholder="Mínimo 6 caracteres"
            value={password} onChangeText={setPassword}
            secureTextEntry erro={errosForm.password} />
          <Input label="Confirmar password" placeholder="Repete a password"
            value={confirmar} onChangeText={setConfirmar}
            secureTextEntry erro={errosForm.confirmar} />

          <Botao texto="Criar Conta" onPress={handleRegisto}
            carregando={carregando} icone="✨" />

          <TouchableOpacity
            style={styles.linkLogin}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkLoginTexto}>
              Já tens conta?{' '}
              <Text style={styles.linkLoginDestaque}>Entra aqui</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, padding: 24 },
  cabecalho: { alignItems: 'center', marginVertical: 30 },
  titulo: {
    fontSize: fontes.display,
    fontWeight: fontes.extrabold,
    color: cores.primaria,
  },
  subtitulo: {
    fontSize: fontes.normal,
    color: cores.textoSecundario,
    marginTop: 4,
  },
  formulario: {
    backgroundColor: cores.fundoCartao,
    borderRadius: 16,
    padding: 24,
    elevation: 2,
    marginBottom: 24,
  },
  linkLogin: { marginTop: 16, alignItems: 'center' },
  linkLoginTexto: { fontSize: fontes.normal, color: cores.textoSecundario },
  linkLoginDestaque: { color: cores.primaria, fontWeight: fontes.bold },
});