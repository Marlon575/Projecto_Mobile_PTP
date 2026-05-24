const jwt = require('jsonwebtoken');

// Cria um token JWT com os dados do utilizador
// Expira em 7 dias — o utilizador fica ligado uma semana sem precisar de login
const criarToken = (payload) => {
return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Verifica se o token é válido e devolve os dados dentro dele
// Lança erro se o token for inválido ou tiver expirado
const verificarToken = (token) => {
return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { criarToken, verificarToken };