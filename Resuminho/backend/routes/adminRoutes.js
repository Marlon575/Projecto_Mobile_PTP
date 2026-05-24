const express       = require('express');
const router        = express.Router();
const autenticar    = require('../middleware/autenticar');
const verificarRole = require('../middleware/verificarRole');

const {
listarUtilizadores,
nomearRevisor,
removerRevisor,
bloquearUtilizador,
} = require('../controllers/adminController');

// Todas as rotas de admin exigem autenticação e role admin
router.use(autenticar, verificarRole('admin'));

// GET /admin/utilizadores — lista todos os utilizadores
router.get('/utilizadores', listarUtilizadores);

// PUT /admin/revisores/:id — nomear revisor
router.put('/revisores/:id', nomearRevisor);

// DELETE /admin/revisores/:id — remover revisor
router.delete('/revisores/:id', removerRevisor);

// PUT /admin/bloquear/:id — bloquear utilizador
router.put('/bloquear/:id', bloquearUtilizador);

module.exports = router;