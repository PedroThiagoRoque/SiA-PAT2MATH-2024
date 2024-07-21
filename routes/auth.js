const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');

// Rota para exibir a página de login
router.get('/login', (req, res) => {
  const errorMessage = req.query.error;
  res.render('login', { errorMessage });
});

// Rota para processar o login
router.post('/login', loginUser);

// Rota para exibir a página de registro (adicionada para completude)
router.get('/register', (req, res) => {
  res.render('register'); // Certifique-se de que existe uma view chamada register.ejs
});

// Rota para processar o registro
router.post('/register', registerUser);

module.exports = router;
