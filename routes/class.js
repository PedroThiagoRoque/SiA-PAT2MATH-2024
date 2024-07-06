const express = require('express');
const router = express.Router();
const { createClass } = require('../controllers/classController');
const auth = require('../middleware/auth'); // Middleware de autenticação

// Rotas para Turmas
router.post('/create', auth, createClass);

module.exports = router;
