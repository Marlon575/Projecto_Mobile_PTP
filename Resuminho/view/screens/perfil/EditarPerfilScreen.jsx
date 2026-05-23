import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView,
  TouchableOpacity, Text, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';
import Input from '../../components/comum/Input';
import Botao from '../../components/comum/Botao';
import Alerta from '../../components/comum/Alerta';
import Avatar from '../../components/comum/Avatar';
import Header from '../../components/layout/Header';
import { useAuthContext } from '../../../viewmodel/context/AuthContext';
import { actualizarPerfil, actualizarFoto } from '../../../viewmodel/services/perfilService';

export default function EditarPerfilScreen({ navigation }) {
  const { utilizador } = useAuthContext();
  const [nome, setNome] = useState(utilizador?.nome || '');
  const [passwordActual, setPasswordActual] = useState('');
  const [novaPassword, setNovaPassword] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [tipoMensagem, setTipoMensagem] = useState('sucesso');

  const escolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!resultado.canceled) {
      try {
        setCarregando(true);
        await actualizarFoto(resultado.assets[0].uri);
        setMensagem('Foto actualizada com sucesso!');
        setTipoMensagem('sucesso');
      } catch (erro) {
        setMensagem(erro.message);
        setTipoMensagem('erro');
      } finally {
        setCarregando(false);
      }
    }
  };

  const handleGuardar = async () => {
    try {
      setCarregando(true);
      const dados = { nome };
      if (novaPassword) {
        dados.passwordActual = passwordActual;
        dados.novaPassword = novaPassword;
      }
      await actualizarPerfil(dados);
      setMensagem('Perfil actualizado com sucesso!');
      setTipoMensagem('sucesso');
    } catch (erro) {
      setMensagem(erro.message);
      setTipoMensagem('erro');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header titulo="Editar Perfil" onVoltar={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Alerta tipo={tipoMensagem} mensagem={mensagem} onFechar={() => setMensagem(null)} />

        {/* Foto de perfil */}
        <View style={styles.fotoContainer}>
          <Avatar uri={utilizador?.foto} nome={utilizador?.nome} tamanho={90} />
          <TouchableOpacity style={styles.botaoFoto} onPress={escolherFoto}>
            <Text style={styles.botaoFotoTexto}>📷 Alterar foto</Text>
          </TouchableOpacity>
        </View>

        {/* Dados pessoais */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Dados Pessoais</Text>
          <Input label="Nome" placeholder="O teu nome"
            value={nome} onChangeText={setNome} autoCapitalize="words" />
        </View>

        {/* Alterar password */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Alterar Password</Text>
          <Input label="Password actual" placeholder="Password actual"
            value={passwordActual} onChangeText={setPasswordActual} secureTextEntry />
          <Input label="Nova password" placeholder="Nova password"
            value={novaPassword} onChangeText={setNovaPassword} secureTextEntry />
        </View>

        <Botao texto="Guardar Alterações" onPress={handleGuardar}
          carregando={carregando} icone="💾" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16 },
  fotoContainer: { alignItems: 'center', marginBottom: 24, gap: 12 },
  botaoFoto: {
    backgroundColor: cores.fundo,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: cores.primaria,
  },
  botaoFotoTexto: { color: cores.primaria, fontWeight: fontes.semibold },
  secao: { marginBottom: 20 },
  secaoTitulo: {
    fontSize: fontes.medio,
    fontWeight: fontes.bold,
    color: cores.textoPrimario,
    marginBottom: 12,
  },
});