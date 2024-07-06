const express = require('express');
const router = express.Router();
const { joinClass, listStudentClasses } = require('../controllers/studentController');
const auth = require('../middleware/auth');

// Rotas para Estudantes
router.get('/dashboard', auth, listStudentClasses);
router.post('/join-class', auth, joinClass);

module.exports = router;
