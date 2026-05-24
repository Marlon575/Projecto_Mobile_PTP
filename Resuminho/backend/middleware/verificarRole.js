

// router.post('/resumos', autenticar,rRole('revisor', 'admin'), criarResumo)

const verificarRole = (...rolesPermitidos) => {
return (req, res, next) => {

    // req.utilizador foi preenchido pelo middleware autenticar
    if (!req.utilizador) {
    return res.status(401).json({ mensagem: 'Não autenticado.' });
    }

    // Verifica se o role do utilizador está na lista de roles permitidos
    if (!rolesPermitidos.includes(req.utilizador.role)) {
    return res.status(403).json({
        mensagem: 'Não tens permissão para aceder a este recurso.',
    });
    }

    // Se tiver permissão, passa para o controller
    next();
};
};

module.exports = verificarRole;