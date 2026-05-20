const Usuario = require('../../model/models/Usuario');
const Curso = require('../../model/models/Curso');
const Disciplina = require('../../model/models/Disciplina');
const Resumo = require('../../model/models/Resumo');

// ─── UTILIZADORES ──────
const listarTodosUtilizadores = async () => {
  return await Usuario.find().select('-password').sort({ createdAt: -1 });
};

const bloquearUtilizador = async (id, bloqueado) => {
  return await Usuario.findByIdAndUpdate(
    id, { bloqueado }, { new: true }
  ).select('-password');
};

const eliminarUtilizador = async (id) => {
  return await Usuario.findByIdAndDelete(id);
};

// ─── REVISORES ─────

const listarTodosRevisores = async () => {
  return await Usuario.find({ papel: 'revisor' }).select('-password');
};

const nomearRevisor = async (id, anoNomeacao) => {
  return await Usuario.findByIdAndUpdate(
    id,
    { papel: 'revisor', anoNomeacao: anoNomeacao || new Date().getFullYear() },
    { new: true }
  ).select('-password');
};

const removerRevisor = async (id) => {
  return await Usuario.findByIdAndUpdate(
    id,
    { papel: 'estudante', anoNomeacao: null },
    { new: true }
  ).select('-password');
};

// ─── CURSOS ──────

const listarTodosCursos = async () => {
  return await Curso.find().sort({ nome: 1 });
};

const criarCurso = async (dados) => {
  const curso = new Curso(dados);
  return await curso.save();
};

const actualizarCurso = async (id, dados) => {
  return await Curso.findByIdAndUpdate(id, dados, { new: true });
};

const eliminarCurso = async (id) => {
  await Disciplina.deleteMany({ curso: id });
  return await Curso.findByIdAndDelete(id);
};

// ─── DISCIPLINAS ───

const listarTodasDisciplinas = async () => {
  return await Disciplina.find().populate('curso', 'nome').sort({ nome: 1 });
};

const listarDisciplinasPorCurso = async (cursoId) => {
  return await Disciplina.find({ curso: cursoId }).sort({ ano: 1, nome: 1 });
};

const criarDisciplina = async (dados) => {
  const disciplina = new Disciplina(dados);
  return await disciplina.save();
};

const actualizarDisciplina = async (id, dados) => {
  return await Disciplina.findByIdAndUpdate(id, dados, { new: true });
};

const eliminarDisciplina = async (id) => {
  return await Disciplina.findByIdAndDelete(id);
};

// ─── ESTATÍSTICAS ──

const obterEstatisticasGerais = async () => {
  const [
    totalUtilizadores, totalRevisores, totalCursos,
    totalDisciplinas, totalResumos, resumosPendentes, resumosAprovados,
  ] = await Promise.all([
    Usuario.countDocuments(),
    Usuario.countDocuments({ papel: 'revisor' }),
    Curso.countDocuments(),
    Disciplina.countDocuments(),
    Resumo.countDocuments(),
    Resumo.countDocuments({ estado: 'pendente' }),
    Resumo.countDocuments({ estado: 'aprovado' }),
  ]);

  return {
    totalUtilizadores, totalRevisores, totalCursos,
    totalDisciplinas, totalResumos, resumosPendentes, resumosAprovados,
  };
};

module.exports = {
  listarTodosUtilizadores, bloquearUtilizador, eliminarUtilizador,
  listarTodosRevisores, nomearRevisor, removerRevisor,
  listarTodosCursos, criarCurso, actualizarCurso, eliminarCurso,
  listarTodasDisciplinas, listarDisciplinasPorCurso, criarDisciplina,
  actualizarDisciplina, eliminarDisciplina, obterEstatisticasGerais,
};