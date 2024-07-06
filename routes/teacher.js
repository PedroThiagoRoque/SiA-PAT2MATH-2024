const express = require('express');
const router = express.Router();
const { createClass, createProblem, listClasses, deleteClass, renderEditClassPage, editClass } = require('../controllers/teacherController');
const auth = require('../middleware/auth');

// Rotas para Turmas
router.get('/dashboard', auth, listClasses);
router.get('/create-class', auth, (req, res) => res.render('teacher/create-class'));
router.get('/create-problem', auth, (req, res) => res.render('teacher/create-problem'));
router.post('/create-class', auth, createClass);
router.post('/create-problem', auth, createProblem);
router.get('/edit-class/:id', auth, renderEditClassPage);
router.post('/edit-class/:id', auth, editClass);
router.get('/delete-class/:id', auth, deleteClass);

module.exports = router;
