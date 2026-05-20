const express = require('express');
const router = express.Router();

const adminController = require('../../viewmodel/controllers/adminController');
const { verifyToken, isAdmin } = require('../../viewmodel/middleware/authMiddleware');

// ─── UTILIZADORES ────────
router.get('/utilizadores', verifyToken, isAdmin, adminController.listarUtilizadores);
router.put('/utilizadores/:id/bloquear', verifyToken, isAdmin, adminController.bloquearUtilizador);
router.delete('/utilizadores/:id', verifyToken, isAdmin, adminController.eliminarUtilizador);

// ─── REVISORES ───────
router.get('/revisores', verifyToken, isAdmin, adminController.listarRevisores);
router.put('/revisores/:id/nomear', verifyToken, isAdmin, adminController.nomearRevisor);
router.put('/revisores/:id/remover', verifyToken, isAdmin, adminController.removerRevisor);

// ─── CURSOS ──────
router.get('/cursos', verifyToken, isAdmin, adminController.listarCursos);
router.post('/cursos', verifyToken, isAdmin, adminController.criarCurso);
router.put('/cursos/:id', verifyToken, isAdmin, adminController.actualizarCurso);
router.delete('/cursos/:id', verifyToken, isAdmin, adminController.eliminarCurso);

// ─── DISCIPLINAS ────
router.get('/disciplinas', verifyToken, isAdmin, adminController.listarDisciplinas);
router.get('/disciplinas/curso/:cursoId', verifyToken, isAdmin, adminController.listarDisciplinasPorCurso);
router.post('/disciplinas', verifyToken, isAdmin, adminController.criarDisciplina);
router.put('/disciplinas/:id', verifyToken, isAdmin, adminController.actualizarDisciplina);
router.delete('/disciplinas/:id', verifyToken, isAdmin, adminController.eliminarDisciplina);

// ─── ESTATÍSTICAS ──────
router.get('/estatisticas', verifyToken, isAdmin, adminController.obterEstatisticas);

module.exports = router;