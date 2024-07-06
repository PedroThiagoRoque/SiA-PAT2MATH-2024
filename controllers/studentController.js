const Class = require('../models/Class');
const Student = require('../models/Student');

// Entrar em uma turma
const joinClass = async (req, res) => {
  const { classCode } = req.body;
  const studentId = req.user.id;

  try {
    const student = await Student.findOne({ userId: studentId });

    if (!student) {
      return res.status(400).json({ msg: 'Estudante não encontrado' });
    }

    const classToJoin = await Class.findOne({ classCode });

    if (!classToJoin) {
      return res.status(400).json({ msg: 'Turma não encontrada' });
    }

    if (classToJoin.students.includes(student._id)) {
      return res.status(400).json({ msg: 'Você já está nesta turma' });
    }

    classToJoin.students.push(student._id);
    await classToJoin.save();

    student.classes.push(classToJoin._id);
    await student.save();

    res.redirect('/api/student/dashboard');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Listar turmas do estudante
const listStudentClasses = async (req, res) => {
  const studentId = req.user.id;

  try {
    const student = await Student.findOne({ userId: studentId }).populate({
      path: 'classes',
      populate: {
        path: 'teacher',
        populate: {
          path: 'userId',
          model: 'User'
        }
      }
    });

    if (!student) {
      return res.status(400).json({ msg: 'Estudante não encontrado' });
    }

    res.render('student/dashboard', { classes: student.classes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  joinClass,
  listStudentClasses
};
