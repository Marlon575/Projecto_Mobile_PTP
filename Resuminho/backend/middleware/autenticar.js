const { verificarToken } = require('../config/jwt');
const Usuario = require('../models/Usuario');

const autenticar = async (req, res, next) => {
try {
    // O token vem no cabeçalho Authorization: Bearer <token>
    const cabecalho = req.headers.authorization;

    if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
    }

    
    const token = cabecalho.split(' ')[1];

    // Verifica se o token é válido 
    const dados = verificarToken(token);

    // Vai buscar o utilizador à base de dados pelo id que está no token
    // O "-senha" exclui a senha da resposta por segurança
    const utilizador = await Usuario.findById(dados.id).select('-senha');

    if (!utilizador) {
    return res.status(401).json({ mensagem: 'Utilizador não encontrado.' });
    }

    // Guarda o utilizador no req para usar nos controllers seguintes
    req.utilizador = utilizador;
    next();

} catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
}
};

module.exports = autenticar;