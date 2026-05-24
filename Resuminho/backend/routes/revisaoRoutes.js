const express       = require('express');
const router        = express.Router();
const autenticar    = require('../middleware/autenticar');
const verificarRole = require('../middleware/verificarRole');
const {
listarPendentes,
decidir,
} = require('../controllers/revisaoController');

// GET /revisao/pendentes — lista resumos que precisam de revisão
router.get('/pendentes', autenticar, verificarRole('revisor', 'admin'), listarPendentes);

// POST /revisao/:id/decidir — aprovar ou rejeitar um resumo
router.post('/:id/decidir', autenticar, verificarRole('revisor', 'admin'), decidir);

module.exports = router;