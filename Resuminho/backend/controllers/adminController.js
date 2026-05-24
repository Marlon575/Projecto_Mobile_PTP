const Usuario = require('../models/Usuario');

// ── LISTAR UTILIZADORES ─────
// GET /admin/utilizadores
const listarUtilizadores = async (req, res) => {
try {
    const utilizadores = await Usuario.find()
    .select('-senha')
    .sort({ createdAt: -1 });

    res.json(utilizadores);
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

// ── NOMEAR REVISOR ───────
// PUT /admin/revisores/:id
const nomearRevisor = async (req, res) => {
try {
    const utilizador = await Usuario.findByIdAndUpdate(
    req.params.id,
    { role: 'revisor' },
    { new: true, select: '-senha' }
    );

    if (!utilizador) {
    return res.status(404).json({ mensagem: 'Utilizador não encontrado.' });
    }

    res.json({
    mensagem: `${utilizador.nome} é agora revisor.`,
    utilizador,
    });
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

// ── REMOVER REVISOR ──────
// DELETE /admin/revisores/:id
const removerRevisor = async (req, res) => {
try {
    const utilizador = await Usuario.findByIdAndUpdate(
    req.params.id,
    { role: 'estudante' },
    { new: true, select: '-senha' }
    );

    if (!utilizador) {
    return res.status(404).json({ mensagem: 'Utilizador não encontrado.' });
    }

    res.json({
    mensagem: `${utilizador.nome} voltou a ser estudante.`,
    utilizador,
    });
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

// ── BLOQUEAR UTILIZADOR ───────
// PUT /admin/bloquear/:id
const bloquearUtilizador = async (req, res) => {
try {
    // Impede o admin de se bloquear a si próprio
    if (req.params.id === req.utilizador._id.toString()) {
    return res.status(400).json({ mensagem: 'Não te podes bloquear a ti próprio.' });
    }

    const utilizador = await Usuario.findById(req.params.id);

    if (!utilizador) {
    return res.status(404).json({ mensagem: 'Utilizador não encontrado.' });
    }

    // Alterna entre bloqueado e desbloqueado
    utilizador.bloqueado = !utilizador.bloqueado;
    await utilizador.save();

    res.json({
    mensagem: utilizador.bloqueado
        ? `${utilizador.nome} foi bloqueado.`
        : `${utilizador.nome} foi desbloqueado.`,
    });
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

module.exports = {
listarUtilizadores,
nomearRevisor,
removerRevisor,
bloquearUtilizador,
};