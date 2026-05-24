const express    = require('express');
const router     = express.Router();
const autenticar = require('../middleware/autenticar');
const {
avaliar,
listarAvaliacoes,
} = require('../controllers/avaliacaoController');

// POST /avaliacoes — avaliar um resumo com estrelas
router.post('/', autenticar, avaliar);

// GET /avaliacoes/:resumoId — ver avaliações de um resumo
router.get('/:resumoId', autenticar, listarAvaliacoes);

module.exports = router;