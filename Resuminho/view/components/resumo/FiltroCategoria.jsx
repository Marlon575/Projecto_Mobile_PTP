import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Modal,
} from 'react-native';
import cores from '../../constants/cores';
import fontes from '../../constants/fontes';
import disciplinas from '../../constants/disciplinas';

export default function FiltroCategoria({ onFiltrar, filtroActivo = {} }) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(
    filtroActivo.curso || null
  );
  const [disciplinaSeleccionada, setDisciplinaSeleccionada] = useState(
    filtroActivo.disciplina || null
  );

  const cursoActual = disciplinas.find(c => c.id === cursoSeleccionado);

  const aplicarFiltro = (curso, disciplina) => {
    onFiltrar && onFiltrar({ curso, disciplina });
    setModalVisivel(false);
  };

  const limparFiltro = () => {
    setCursoSeleccionado(null);
    setDisciplinaSeleccionada(null);
    aplicarFiltro(null, null);
  };

  const temFiltro = cursoSeleccionado || disciplinaSeleccionada;

  return (
    <View>
      {/* Botão de abrir filtro */}
      <TouchableOpacity
        style={[styles.botaoFiltro, temFiltro && styles.botaoFiltroActivo]}
        onPress={() => setModalVisivel(true)}
      >
        <Text style={styles.botaoFiltroIcone}>🔍</Text>
        <Text style={[
          styles.botaoFiltroTexto,
          temFiltro && styles.botaoFiltroTextoActivo,
        ]}>
          {disciplinaSeleccionada
            ? cursoActual?.disciplinas.find(d => d.id === disciplinaSeleccionada)?.nome
            : cursoActual?.sigla || 'Filtrar'}
        </Text>
        {temFiltro && (
          <TouchableOpacity onPress={limparFiltro} style={styles.botaoLimpar}>
            <Text style={styles.botaoLimparTexto}>✕</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Modal de selecção */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalConteudo}>
            <View style={styles.modalCabecalho}>
              <Text style={styles.modalTitulo}>Filtrar Resumos</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Text style={styles.fechar}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de cursos */}
            <Text style={styles.labelSecao}>Curso</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chips}>
                {disciplinas.map(curso => (
                  <TouchableOpacity
                    key={curso.id}
                    style={[
                      styles.chip,
                      cursoSeleccionado === curso.id && styles.chipActivo,
                    ]}
                    onPress={() => {
                      setCursoSeleccionado(
                        cursoSeleccionado === curso.id ? null : curso.id
                      );
                      setDisciplinaSeleccionada(null);
                    }}
                  >
                    <Text style={[
                      styles.chipTexto,
                      cursoSeleccionado === curso.id && styles.chipTextoActivo,
                    ]}>
                      {curso.sigla}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Lista de disciplinas do curso seleccionado */}
            {cursoActual && (
              <>
                <Text style={styles.labelSecao}>Disciplina</Text>
                <ScrollView style={styles.listaDisciplinas}>
                  {cursoActual.disciplinas.map(disc => (
                    <TouchableOpacity
                      key={disc.id}
                      style={[
                        styles.itemDisciplina,
                        disciplinaSeleccionada === disc.id && styles.itemDisciplinaActivo,
                      ]}
                      onPress={() => setDisciplinaSeleccionada(
                        disciplinaSeleccionada === disc.id ? null : disc.id
                      )}
                    >
                      <Text style={[
                        styles.itemDisciplinaTexto,
                        disciplinaSeleccionada === disc.id && styles.itemDisciplinaTextoActivo,
                      ]}>
                        {disc.nome}
                      </Text>
                      <Text style={styles.itemDisciplinaAno}>{disc.ano}º Ano</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {/* Botões de acção */}
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.botaoLimparModal} onPress={limparFiltro}>
                <Text style={styles.botaoLimparModalTexto}>Limpar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoAplicar}
                onPress={() => aplicarFiltro(cursoSeleccionado, disciplinaSeleccionada)}
              >
                <Text style={styles.botaoAplicarTexto}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  botaoFiltro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundoCartao,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: cores.separador,
    gap: 6,
  },
  botaoFiltroActivo: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  botaoFiltroIcone: { fontSize: 14 },
  botaoFiltroTexto: {
    fontSize: fontes.normal,
    color: cores.textoPrimario,
  },
  botaoFiltroTextoActivo: { color: '#FFFFFF' },
  botaoLimpar: {
    marginLeft: 4,
    padding: 2,
  },
  botaoLimparTexto: { color: '#FFFFFF', fontSize: 12 },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalConteudo: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '75%',
  },
  modalCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitulo: {
    fontSize: fontes.grande,
    fontWeight: fontes.bold,
    color: cores.textoPrimario,
  },
  fechar: { fontSize: 18, color: cores.textoSecundario },
  labelSecao: {
    fontSize: fontes.normal,
    fontWeight: fontes.semibold,
    color: cores.textoSecundario,
    marginBottom: 8,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chips: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: cores.fundo,
    borderWidth: 1,
    borderColor: cores.separador,
  },
  chipActivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  chipTexto: { fontSize: fontes.normal, color: cores.textoPrimario },
  chipTextoActivo: { color: '#FFFFFF', fontWeight: fontes.semibold },
  listaDisciplinas: { maxHeight: 200 },
  itemDisciplina: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  itemDisciplinaActivo: { backgroundColor: '#E3F2FD' },
  itemDisciplinaTexto: { fontSize: fontes.normal, color: cores.textoPrimario },
  itemDisciplinaTextoActivo: {
    color: cores.primaria,
    fontWeight: fontes.semibold,
  },
  itemDisciplinaAno: { fontSize: fontes.pequeno, color: cores.textoSecundario },
  modalBotoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  botaoLimparModal: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: cores.fundo,
  },
  botaoLimparModalTexto: {
    color: cores.textoPrimario,
    fontWeight: fontes.semibold,
  },
  botaoAplicar: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: cores.primaria,
  },
  botaoAplicarTexto: { color: '#FFFFFF', fontWeight: fontes.bold },
});