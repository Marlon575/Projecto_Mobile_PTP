const express        = require('express');
const router         = express.Router();
const autenticar     = require('../middleware/autenticar');
const verificarRole  = require('../middleware/verificarRole');
const upload         = require('../middleware/uploadFicheiro');
const {
listarResumos,
obterResumo,
publicarResumo,
registarDownload,
meusResumos,
} = require('../controllers/resumoController');

// GET /resumos — qualquer utilizador autenticado pode listar
router.get('/', autenticar, listarResumos);

router.get('/meus', autenticar, verificarRole('revisor', 'admin'), meusResumos);

// GET /resumos/:id — qualquer utilizador autenticado
router.get('/:id', autenticar, obterResumo);

// POST /resumos — só revisores podem publicar
// upload.single('pdf') — processa o ficheiro PDF enviado no campo "pdf"
router.post('/', autenticar, verificarRole('revisor', 'admin'), upload.single('pdf'), publicarResumo);

// PUT /resumos/:id/download — qualquer utilizador autenticado
router.put('/:id/download', autenticar, registarDownload);

module.exports = router;