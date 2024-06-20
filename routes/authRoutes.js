const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Rota para registro de usuário
router.post('/register', register);

// Rota para login de usuário
router.post('/login', login);

module.exports = router;
