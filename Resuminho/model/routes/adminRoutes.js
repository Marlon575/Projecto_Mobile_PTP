// Define os endereços URL do módulo de administração.
// Cada rota tem: método HTTP + caminho + middleware + função do controller.

const express = require('express');
const router = express.Router();

const adminController = require('../../viewmodel/controllers/adminController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
// verifyToken — verifica se o JWT é válido
// isAdmin — verifica se o utilizador e admin
// Ajusta o caminho se o teu grupo colocou o middleware noutro sítio

// ─── UTILIZADORES ─────────

router.get('/utilizadores', verifyToken, isAdmin, adminController.listarUtilizadores);
// GET /admin/utilizadores — lista todos os utilizadores

router.put('/utilizadores/:id/bloquear', verifyToken, isAdmin, adminController.bloquearUtilizador);
// PUT /admin/utilizadores/123/bloquear — bloqueia ou desbloqueia

router.delete('/utilizadores/:id', verifyToken, isAdmin, adminController.eliminarUtilizador);
// DELETE /admin/utilizadores/123 — elimina permanentemente

// ─── REVISORES ──────
router.get('/revisores', verifyToken, isAdmin, adminController.listarRevisores);
router.put('/revisores/:id/nomear', verifyToken, isAdmin, adminController.nomearRevisor);
router.put('/revisores/:id/remover', verifyToken, isAdmin, adminController.removerRevisor);

// ─── CURSOS ──────────

router.get('/cursos', verifyToken, isAdmin, adminController.listarCursos);
router.post('/cursos', verifyToken, isAdmin, adminController.criarCurso);
router.put('/cursos/:id', verifyToken, isAdmin, adminController.actualizarCurso);
router.delete('/cursos/:id', verifyToken, isAdmin, adminController.eliminarCurso);

// ─── DISCIPLINAS ─────────
router.get('/disciplinas', verifyToken, isAdmin, adminController.listarDisciplinas);
router.get('/disciplinas/curso/:cursoId', verifyToken, isAdmin, adminController.listarDisciplinasPorCurso);
router.post('/disciplinas', verifyToken, isAdmin, adminController.criarDisciplina);
router.put('/disciplinas/:id', verifyToken, isAdmin, adminController.actualizarDisciplina);
router.delete('/disciplinas/:id', verifyToken, isAdmin, adminController.eliminarDisciplina);

// ─── ESTATÍSTICAS ─────────
router.get('/estatisticas', verifyToken, isAdmin, adminController.obterEstatisticas);

module.exports = router;