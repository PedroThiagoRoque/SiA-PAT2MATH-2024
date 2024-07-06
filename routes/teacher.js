const express = require('express');
const router = express.Router();
const { createClass, createProblem } = require('../controllers/teacherController');
const auth = require('../middleware/auth');

// Rotas para Turmas
router.get('/dashboard', auth, (req, res) => res.render('teacher/dashboard'));
router.get('/create-class', auth, (req, res) => res.render('teacher/create-class'));
router.get('/create-problem', auth, (req, res) => res.render('teacher/create-problem'));
router.post('/create-class', auth, createClass);
router.post('/create-problem', auth, createProblem);

module.exports = router;
