const Usuario     = require('../models/Usuario');
const { criarToken } = require('../config/jwt');

// ── REGISTAR ─────
// POST /auth/registar
const registar = async (req, res) => {
try {
    const { nome, email, senha, curso, ano } = req.body;

    // Verifica se já existe um utilizador com este email
    const jaExiste = await Usuario.findOne({ email });
    if (jaExiste) {
    return res.status(400).json({ mensagem: 'Email já registado.' });
    }

    // Cria o utilizador — a senha é encriptada automaticamente pelo model
    const utilizador = await Usuario.create({ nome, email, senha, curso, ano });

    // Cria o token JWT com o id e role do utilizador
    const token = criarToken({ id: utilizador._id, role: utilizador.role });

    res.status(201).json({
    token,
    utilizador: {
        _id:    utilizador._id,
        nome:   utilizador.nome,
        email:  utilizador.email,
        role:   utilizador.role,
        pontos: utilizador.pontos,
        curso:  utilizador.curso,
        ano:    utilizador.ano,
    },
    });

} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

// ── LOGIN ────────
// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Procura o utilizador pelo email
    const utilizador = await Usuario.findOne({ email });
    if (!utilizador) {
      return res.status(401).json({ mensagem: 'Email ou senha incorrectos.' });
    }

    // Compara a senha enviada com a senha encriptada na base de dados
    const senhaCorrecta = await utilizador.compararSenha(senha);
    if (!senhaCorrecta) {
      return res.status(401).json({ mensagem: 'Email ou senha incorrectos.' });
    }

    // Cria o token JWT
    const token = criarToken({ id: utilizador._id, role: utilizador.role });

    res.json({
      token,
      utilizador: {
        _id:    utilizador._id,
        nome:   utilizador.nome,
        email:  utilizador.email,
        role:   utilizador.role,
        pontos: utilizador.pontos,
        curso:  utilizador.curso,
        ano:    utilizador.ano,
      },
    });

  } catch (erro) {
    res.status(500).json({ mensagem: erro.message });
  }
};

// ── VERIFICAR TOKEN ─────────
// GET /auth/verificar — a app usa isto para saber se a sessão ainda é válida
const verificar = async (req, res) => {
  try {
    // req.utilizador foi preenchido pelo middleware autenticar
    res.json({ utilizador: req.utilizador });
  } catch (erro) {
    res.status(500).json({ mensagem: erro.message });
  }
};

module.exports = { registar, login, verificar };