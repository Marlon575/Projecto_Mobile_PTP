import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    curso: "",
    ano: "",
    senha: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegister = () => {
    console.log("Register:", form);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput placeholder="Nome" style={styles.input} onChangeText={(v) => handleChange("nome", v)} />
      <TextInput placeholder="Email" style={styles.input} onChangeText={(v) => handleChange("email", v)} />
      <TextInput placeholder="Curso" style={styles.input} onChangeText={(v) => handleChange("curso", v)} />
      <TextInput placeholder="Ano Curricular" style={styles.input} onChangeText={(v) => handleChange("ano", v)} />
      <TextInput placeholder="Senha" secureTextEntry style={styles.input} onChangeText={(v) => handleChange("senha", v)} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Já tenho conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4b0073",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { marginTop: 15, color: "#4b007a", textAlign: "center" },
});