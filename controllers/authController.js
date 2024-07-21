const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Registrar Usuário
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Verificar se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Usuário já registrado' });
    }

    user = new User({
      name,
      email,
      password,
      role
    });

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Criar registros específicos para estudantes ou professores
    if (role === 'student') {
      const student = new Student({ userId: user._id });
      await student.save();
    } else if (role === 'teacher') {
      const teacher = new Teacher({ userId: user._id });
      await teacher.save();
    }

    // Criar o token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { httpOnly: true });
        res.redirect(role === 'student' ? '/api/student/dashboard' : '/api/teacher/dashboard');
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Login de Usuário
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    let user = await User.findOne({ email });
    if (!user) {
      return res.redirect('/api/auth/login?error=Credenciais inválidas');
    }

    // Comparar a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect('/api/auth/login?error=Credenciais inválidas');
    }

    // Criar o token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { httpOnly: true });
        res.redirect(user.role === 'student' ? '/api/student/dashboard' : '/api/teacher/dashboard');
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  registerUser,
  loginUser
};
