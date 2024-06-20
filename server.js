const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Conectar ao Banco de Dados
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Definir rotas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));

// Página inicial
app.get('/', (req, res) => res.render('index'));

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
