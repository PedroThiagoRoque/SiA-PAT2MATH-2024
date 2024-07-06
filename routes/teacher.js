const express = require('express');
const router = express.Router();
const { createClass, createProblem, listClasses, deleteClass, renderEditClassPage, editClass, listProblems, renderEditProblemPage, editProblem, deleteProblem } = require('../controllers/teacherController');
const auth = require('../middleware/auth');

// Rotas para Turmas
router.get('/dashboard', auth, listClasses);
router.get('/create-class', auth, (req, res) => res.render('teacher/create-class'));
router.get('/create-problem', auth, (req, res) => res.render('teacher/create-problem'));
router.post('/create-class', auth, createClass);
router.post('/create-problem', auth, createProblem);
router.get('/edit-class/:id', auth, renderEditClassPage);
router.post('/edit-class/:id', auth, editClass);
router.post('/delete-class/:id', auth, deleteClass);

// Rotas para Problemas
router.get('/list-problems', auth, listProblems);
router.get('/edit-problem/:id', auth, renderEditProblemPage);
router.post('/edit-problem/:id', auth, editProblem);
router.post('/delete-problem/:id', auth, deleteProblem);

module.exports = router;
