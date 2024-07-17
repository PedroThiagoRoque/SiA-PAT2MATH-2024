const express = require('express');
const router = express.Router();
const { joinClass, listStudentClasses, accessExercise} = require('../controllers/studentController');
const { submitStep} = require('../controllers/studentController');
const auth = require('../middleware/auth');

// Rotas para Estudantes
router.get('/dashboard', auth, listStudentClasses);
router.post('/join-class', auth, joinClass);
router.get('/exercise/:classId/:problemId', auth, accessExercise);

// Rotas para verificação de passos e geração de dicas
router.post('/submit-step', auth, submitStep);

module.exports = router;
