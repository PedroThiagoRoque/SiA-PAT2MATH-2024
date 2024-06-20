const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Problem = require('../models/problem');

exports.getStudentHub = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id }).populate('enrolledCourses');
        if (!student) return res.status(404).json({ msg: 'Student not found' });
        res.render('studentHub', { student });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTeacherDashboard = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ userId: req.user.id }).populate('managedCourses students');
        if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
        res.render('teacherDashboard', { teacher });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getProblemInterface = async (req, res) => {
    try {
        const problems = await Problem.find();
        res.render('problemInterface', { problems });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
