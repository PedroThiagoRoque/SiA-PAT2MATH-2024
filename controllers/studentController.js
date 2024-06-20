const Student = require('../models/student');
const User = require('../models/user');

exports.getStudentDashboard = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id }).populate('enrolledCourses');
        if (!student) return res.status(404).json({ msg: 'Estudante não encontrado' });

        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getStudentPerformance = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ msg: 'Estudante não encontrado' });

        res.json(student.performance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
