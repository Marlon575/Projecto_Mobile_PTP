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


// Qualquer utilizador autenticado vê os seus resumos
router.get('/meus', autenticar, meusResumos);

// GET /resumos/:id — qualquer utilizador autenticado
router.get('/:id', autenticar, obterResumo);

// Qualquer utilizador autenticado pode submeter
router.post('/', autenticar, upload.single('pdf'), publicarResumo);

// PUT /resumos/:id/download — qualquer utilizador autenticado
router.put('/:id/download', autenticar, registarDownload);

module.exports = router;