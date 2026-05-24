const Usuario = require('../models/Usuario');

// ── VER PERFIL ─────
// GET /perfil
const verPerfil = async (req, res) => {
try {
    // req.utilizador foi preenchido pelo middleware autenticar
    // O -senha já foi excluído no middleware
    res.json(req.utilizador);
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

// ── EDITAR PERFIL ────────
// PUT /perfil
const editarPerfil = async (req, res) => {
try {
    const { nome, curso, ano, foto } = req.body;

    // Só actualiza os campos que foram enviados
    const aActualizar = {};
    if (nome)  aActualizar.nome  = nome;
    if (curso) aActualizar.curso = curso;
    if (ano)   aActualizar.ano   = ano;
    if (foto)  aActualizar.foto  = foto;

    const utilizador = await Usuario.findByIdAndUpdate(
    req.utilizador._id,
    aActualizar,
      // new: true devolve o documento já actualizado
    { new: true, select: '-senha' }
    );

    res.json(utilizador);
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

// ── MUDAR SENHA ───────
// PUT /perfil/senha
const mudarSenha = async (req, res) => {
try {
    const { senhaActual, novaSenha } = req.body;

    // Busca o utilizador com a senha para poder comparar
    const utilizador = await Usuario.findById(req.utilizador._id);

    // Verifica se a senha actual está correcta
    const senhaCorrecta = await utilizador.compararSenha(senhaActual);
    if (!senhaCorrecta) {
    return res.status(400).json({ mensagem: 'Senha actual incorrecta.' });
    }

    // Actualiza a senha — o hook pre-save do model encripta automaticamente
    utilizador.senha = novaSenha;
    await utilizador.save();

    res.json({ mensagem: 'Senha alterada com sucesso.' });
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

module.exports = { verPerfil, editarPerfil, mudarSenha };