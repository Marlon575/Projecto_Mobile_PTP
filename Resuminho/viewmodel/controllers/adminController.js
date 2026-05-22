// Recebe pedidos HTTP das rotas, chama o service correspondente
// E devolve respostas JSON ao frontend.
// Toda a lógica de base de dados fica no adminService — aqui só tratamos HTTP.

const adminService = require('../services/adminService');

// ─── UTILIZADORES ───────

const listarUtilizadores = async (req, res) => {
  try {
    const utilizadores = await adminService.listarTodosUtilizadores();
    res.status(200).json({ sucesso: true, dados: utilizadores });
    // 200 = OK — pedido bem sucedido
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
    // 500 = Internal Server Error — erro inesperado no servidor
  }
};

const bloquearUtilizador = async (req, res) => {
  try {
    const { id } = req.params;
    // req.params extrai o :id da URL — ex: /admin/utilizadores/123/bloquear
    const { bloqueado } = req.body;
    // req.body extrai os dados enviados no corpo do pedido

    if (typeof bloqueado !== 'boolean') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Campo bloqueado deve ser true ou false',
      });
      // 400 = Bad Request — o cliente enviou dados inválidos
    }

    const utilizador = await adminService.bloquearUtilizador(id, bloqueado);

    if (!utilizador) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Utilizador não encontrado',
      });
      // 404 = Not Found — o ID não existe na base de dados
    }

    const estado = bloqueado ? 'bloqueado' : 'desbloqueado';
    res.status(200).json({
      sucesso: true,
      mensagem: `Utilizador ${estado} com sucesso`,
      dados: utilizador,
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

const eliminarUtilizador = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await adminService.eliminarUtilizador(id);

    if (!resultado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Utilizador não encontrado',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Utilizador eliminado com sucesso',
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

// ─── REVISORES ────────────────────────────────────────────────────────────────

const listarRevisores = async (req, res) => {
  try {
    const revisores = await adminService.listarTodosRevisores();
    res.status(200).json({ sucesso: true, dados: revisores });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

const nomearRevisor = async (req, res) => {
  try {
    const { id } = req.params;
    const { anoNomeacao } = req.body;
    // anoNomeacao é opcional — se não vier usa o ano actual

    const utilizador = await adminService.nomearRevisor(id, anoNomeacao);

    if (!utilizador) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Utilizador não encontrado',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Utilizador nomeado revisor com sucesso',
      dados: utilizador,
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

const removerRevisor = async (req, res) => {
  try {
    const { id } = req.params;
    const utilizador = await adminService.removerRevisor(id);

    if (!utilizador) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Utilizador não encontrado',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Papel de revisor removido com sucesso',
      dados: utilizador,
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

// ─── CURSOS ──────────────────────────────────────────────────────────────────

const listarCursos = async (req, res) => {
  try {
    const cursos = await adminService.listarTodosCursos();
    res.status(200).json({ sucesso: true, dados: cursos });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

const criarCurso = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome do curso é obrigatório',
      });
    }

    const curso = await adminService.criarCurso({ nome, descricao });
    res.status(201).json({
      sucesso: true,
      mensagem: 'Curso criado com sucesso',
      dados: curso,
    });
    // 201 = Created — recurso criado com sucesso
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

const actualizarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await adminService.actualizarCurso(id, req.body);

    if (!curso) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Curso não encontrado',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Curso actualizado com sucesso',
      dados: curso,
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await adminService.eliminarCurso(id);

    if (!resultado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Curso não encontrado',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Curso e disciplinas eliminados com sucesso',
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

// ─── DISCIPLINAS ─────────────────────────────────────────────────────────────

const listarDisciplinas = async (req, res) => {
  try {
    const disciplinas = await adminService.listarTodasDisciplinas();
    res.status(200).json({ sucesso: true, dados: disciplinas });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

const listarDisciplinasPorCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const disciplinas = await adminService.listarDisciplinasPorCurso(cursoId);
    res.status(200).json({ sucesso: true, dados: disciplinas });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

const criarDisciplina = async (req, res) => {
  try {
    const { nome, curso, ano } = req.body;

    if (!nome || !curso) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome e curso são obrigatórios',
      });
    }

    const disciplina = await adminService.criarDisciplina({ nome, curso, ano });
    res.status(201).json({
      sucesso: true,
      mensagem: 'Disciplina criada com sucesso',
      dados: disciplina,
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

const actualizarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    const disciplina = await adminService.actualizarDisciplina(id, req.body);

    if (!disciplina) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Disciplina não encontrada',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Disciplina actualizada com sucesso',
      dados: disciplina,
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

const eliminarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await adminService.eliminarDisciplina(id);

    if (!resultado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Disciplina não encontrada',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Disciplina eliminada com sucesso',
    });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

// ─── ESTATÍSTICAS ────────────────────────────────────────────────────────────

const obterEstatisticas = async (req, res) => {
  try {
    const estatisticas = await adminService.obterEstatisticasGerais();
    res.status(200).json({ sucesso: true, dados: estatisticas });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
};

module.exports = {
  listarUtilizadores,
  bloquearUtilizador,
  eliminarUtilizador,
  listarRevisores,
  nomearRevisor,
  removerRevisor,
  listarCursos,
  criarCurso,
  actualizarCurso,
  eliminarCurso,
  listarDisciplinas,
  listarDisciplinasPorCurso,
  criarDisciplina,
  actualizarDisciplina,
  eliminarDisciplina,
  obterEstatisticas,
};