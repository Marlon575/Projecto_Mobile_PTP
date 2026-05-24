const express    = require('express');
const router     = express.Router();
const autenticar = require('../middleware/autenticar');
const {
verPerfil,
editarPerfil,
mudarSenha,
} = require('../controllers/perfilController');

// GET /perfil — ver o perfil do utilizador autenticado
router.get('/', autenticar, verPerfil);

// PUT /perfil — edita o perfil  nome, curso, ano e foto
router.put('/', autenticar, editarPerfil);

// PUT /perfil/senha — mudar a senha
router.put('/senha', autenticar, mudarSenha);

module.exports = router;