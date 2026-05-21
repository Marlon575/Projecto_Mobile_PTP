// Camada de acesso à base de dados para o módulo de admin.
// Todas as queries ao MongoDB ficam aqui.
// O controller chama estas funções e recebe os resultados.

const Usuario = require('../../model/models/Usuario');
// Importa o modelo de utilizador do MongoDB
// O modelo define a estrutura dos documentos na colecção

const Curso = require('../../model/models/Curso');
// Modelo de curso — cada curso tem nome e descrição

const Disciplina = require('../../model/models/Disciplina');
// Modelo de disciplina — cada disciplina pertence a um curso

const Resumo = require('../../model/models/Resumo');
// Modelo de resumo — usado apenas para contar nas estatísticas

// ─── UTILIZADORES ──

const listarTodosUtilizadores = async () => {
  return await Usuario.find().select('-senha').sort({ createdAt: -1 });
  // .find() sem filtro devolve todos os documentos
  // .select('-senha') exclui o campo senha da resposta por segurança
  // .sort({ createdAt: -1 }) ordena do mais recente para o mais antigo
};

const bloquearUtilizador = async (id, bloqueado) => {
  return await Usuario.findByIdAndUpdate(
    id,
    { bloqueado },
    // { bloqueado } é o mesmo que { bloqueado: bloqueado }
    { new: true }
    // { new: true } faz o MongoDB devolver o documento já actualizado
  ).select('-senha');
};

const eliminarUtilizador = async (id) => {
  return await Usuario.findByIdAndDelete(id);
  // Remove permanentemente o utilizador da base de dados
};

// ─── REVISORES ──────
const listarTodosRevisores = async () => {
  return await Usuario.find({ papel: 'revisor' }).select('-senha');
  // Filtra só os utilizadores com papel de revisor
};

const nomearRevisor = async (id, anoNomeacao) => {
  return await Usuario.findByIdAndUpdate(
    id,
    {
      papel: 'revisor',
      anoNomeacao: anoNomeacao || new Date().getFullYear(),
      // Se não vier ano, usa o ano actual
    },
    { new: true }
  ).select('-senha');
};

const removerRevisor = async (id) => {
  return await Usuario.findByIdAndUpdate(
    id,
    { papel: 'estudante', anoNomeacao: null },
    // Remove o papel de revisor voltando a estudante
    { new: true }
  ).select('-senha');
};

// ─── CURSOS ──────

const listarTodosCursos = async () => {
  return await Curso.find().sort({ nome: 1 });
  // .sort({ nome: 1 }) ordena alfabeticamente
};

const criarCurso = async (dados) => {
  const curso = new Curso(dados);
  // Cria uma instância do modelo com os dados recebidos
  return await curso.save();
  // Guarda na base de dados e devolve o documento criado
};

const actualizarCurso = async (id, dados) => {
  return await Curso.findByIdAndUpdate(id, dados, { new: true });
};

const eliminarCurso = async (id) => {
  await Disciplina.deleteMany({ curso: id });
  // Elimina todas as disciplinas do curso antes de eliminar o curso
  return await Curso.findByIdAndDelete(id);
};

// ─── DISCIPLINAS ─────────────────────────────────────────────────────────────

const listarTodasDisciplinas = async () => {
  return await Disciplina.find().populate('curso', 'nome').sort({ nome: 1 });
  // .populate('curso', 'nome') substitui o ID do curso pelo seu nome
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

// ─── ESTATÍSTICAS ───────
const obterEstatisticasGerais = async () => {
  const [
    totalUtilizadores,
    totalRevisores,
    totalCursos,
    totalDisciplinas,
    totalResumos,
    resumosPendentes,
    resumosAprovados,
  ] = await Promise.all([
    // Promise.all corre todas as queries em paralelo — muito mais rápido
    Usuario.countDocuments(),
    Usuario.countDocuments({ papel: 'revisor' }),
    Curso.countDocuments(),
    Disciplina.countDocuments(),
    Resumo.countDocuments(),
    Resumo.countDocuments({ estado: 'pendente' }),
    Resumo.countDocuments({ estado: 'aprovado' }),
  ]);

  return {
    totalUtilizadores,
    totalRevisores,
    totalCursos,
    totalDisciplinas,
    totalResumos,
    resumosPendentes,
    resumosAprovados,
  };
};

module.exports = {
  listarTodosUtilizadores,
  bloquearUtilizador,
  eliminarUtilizador,
  listarTodosRevisores,
  nomearRevisor,
  removerRevisor,
  listarTodosCursos,
  criarCurso,
  actualizarCurso,
  eliminarCurso,
  listarTodasDisciplinas,
  listarDisciplinasPorCurso,
  criarDisciplina,
  actualizarDisciplina,
  eliminarDisciplina,
  obterEstatisticasGerais,
};