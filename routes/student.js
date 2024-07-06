const express = require('express');
const router = express.Router();
const { joinClass, listStudentClasses, accessExercise } = require('../controllers/studentController');
const auth = require('../middleware/auth');

// Rotas para Estudantes
router.get('/dashboard', auth, listStudentClasses);
router.post('/join-class', auth, joinClass);
router.get('/exercise/:classId/:problemId', auth, accessExercise);

module.exports = router;
