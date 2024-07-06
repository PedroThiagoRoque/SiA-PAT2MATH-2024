const express = require('express');
const router = express.Router();
const { joinClass } = require('../controllers/studentController');
const auth = require('../middleware/auth');

// Rotas para Estudantes
router.get('/dashboard', auth, (req, res) => res.render('student/dashboard'));
router.post('/join-class', auth, joinClass);

module.exports = router;
