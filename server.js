const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

// Conectar ao Banco de Dados
connectDB();

// Middleware para parsear JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configurar EJS como mecanismo de visualização
app.set('view engine', 'ejs');

// Definir diretório de arquivos estáticos
app.use(express.static('public'));

// Definir rotas da API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));

// Definir rotas para renderizar as views
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/student-hub', (req, res) => res.render('studentHub'));
app.get('/teacher-dashboard', (req, res) => res.render('teacherDashboard'));
app.get('/problem-interface', (req, res) => res.render('problemInterface'));

// Adicionar rotas para views
app.use('/', require('./routes/viewRoutes'));

// Página inicial
app.get('/', (req, res) => res.render('index'));

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
