const express = require('express');
const router = express.Router();

// Controladores (Controllers)
const { registerUser, loginUser } = require('../controllers/authController');

// Rotas de Autenticação
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rotas para Renderizar Páginas
router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));

module.exports = router;
