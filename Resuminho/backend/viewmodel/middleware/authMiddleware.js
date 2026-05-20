const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  // Bearer TOKEN → split pega só o TOKEN

  if (!token) {
    return res.status(401).json({ 
      sucesso: false, 
      mensagem: 'Acesso negado. Token não fornecido.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next(); // passa para o próximo middleware ou rota
  } catch (erro) {
    return res.status(403).json({ 
      sucesso: false, 
      mensagem: 'Token inválido ou expirado.' 
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.usuario.papel !== 'admin') {
    return res.status(403).json({ 
      sucesso: false, 
      mensagem: 'Acesso restrito a administradores.' 
    });
  }
  next();
};

module.exports = { verifyToken, isAdmin };