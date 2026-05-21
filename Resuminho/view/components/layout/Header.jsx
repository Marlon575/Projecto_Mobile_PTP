import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import cores from "../../constants/cores";
import fontes from "../../constants/fontes";

export default function Header({
  titulo,
  subtitulo,
  onVoltar, // se definido, mostra botão de voltar
  acaoDireita, // componente ou botão no lado direito
  transparent = false,
}) {
  return (
    <>
      <StatusBar
        backgroundColor={transparent ? "transparent" : cores.primaria}
        barStyle="light-content"
      />
      <View
        style={[styles.container, transparent && styles.containerTransparente]}
      >
        {/* Botão de voltar */}
        <View style={styles.esquerda}>
          {onVoltar && (
            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={onVoltar}
              activeOpacity={0.7}
            >
              <Text style={styles.botaoVoltarTexto}>←</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Título e subtítulo */}
        <View style={styles.centro}>
          <Text style={styles.titulo} numberOfLines={1}>
            {titulo}
          </Text>
          {subtitulo && (
            <Text style={styles.subtitulo} numberOfLines={1}>
              {subtitulo}
            </Text>
          )}
        </View>

        {/* Acção do lado direito */}
        <View style={styles.direita}>
          {acaoDireita || <View style={styles.espacador} />}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: cores.primaria,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  containerTransparente: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  esquerda: {
    width: 40,
    alignItems: "flex-start",
  },
  centro: {
    flex: 1,
    alignItems: "center",
  },
  direita: {
    width: 40,
    alignItems: "flex-end",
  },
  botaoVoltar: {
    padding: 4,
  },
  botaoVoltarTexto: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: fontes.bold,
  },
  titulo: {
    fontSize: fontes.grande,
    fontWeight: fontes.bold,
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: fontes.pequeno,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 2,
  },
  espacador: {
    width: 40,
  },
});
