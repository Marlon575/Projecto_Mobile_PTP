import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function PerfilScreen() {
  const user = {
    nome: "Tiago",
    pontos: 120,
    nivel: "Estudante",
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.pravatar.cc/150" }}
        style={styles.avatar}
      />

      <Text style={styles.nome}>{user.nome}</Text>

      <View style={styles.card}>
        <Text>Pontos: {user.pontos}</Text>
        <Text>Nível: {user.nivel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  nome: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  card: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    width: "100%",
  },
});