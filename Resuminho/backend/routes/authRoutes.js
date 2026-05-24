const express    = require('express');
const router     = express.Router();
const autenticar = require('../middleware/autenticar');
const {
registar,
login,
verificar,
} = require('../controllers/authController');


router.post('/registar', registar);  //regista utilizadores
router.post('/login', login);   // Login

// GET /auth/verificar — só utilizadores autenticados
// A app usa esta rota para saber se a sessão ainda é válida
router.get('/verificar', autenticar, verificar);

module.exports = router;