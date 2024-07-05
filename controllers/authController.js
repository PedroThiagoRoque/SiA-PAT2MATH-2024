const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Usuário já existe.' });

        user = new User({ name, email, password, role });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;

            res.cookie('token', token, { httpOnly: true });

            if (user.role === 'student') {
                res.redirect('/student-hub');
            } else if (user.role === 'teacher') {
                res.redirect('/teacher-dashboard');
            } else {
                res.status(400).json({ msg: 'Invalid user role' });
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
