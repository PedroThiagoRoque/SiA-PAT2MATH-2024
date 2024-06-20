const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Course = require('../models/course');

exports.getTeacherDashboard = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ userId: req.user.id }).populate('managedCourses');
        if (!teacher) return res.status(404).json({ msg: 'Professor não encontrado' });

        res.json(teacher);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTeacherStudents = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ userId: req.user.id }).populate('students');
        if (!teacher) return res.status(404).json({ msg: 'Professor não encontrado' });

        res.json(teacher.students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
