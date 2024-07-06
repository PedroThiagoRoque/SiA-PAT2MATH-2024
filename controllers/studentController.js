const mongoose = require('mongoose');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Problem = require('../models/Problem');

// Função para calcular o progresso
const calculateProgress = (student, classItem) => {
  const totalProblems = classItem.problems.length;
  const solvedProblems = student.solvedProblems ? student.solvedProblems.filter(problemId => classItem.problems.includes(problemId.toString())).length : 0;
  return totalProblems ? (solvedProblems / totalProblems) * 100 : 0;
};

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

// Listar turmas do estudante e calcular progresso
const listStudentClasses = async (req, res) => {
  const studentId = req.user.id;

  try {
    const student = await Student.findOne({ userId: studentId }).populate({
      path: 'classes',
      populate: [
        {
          path: 'teacher',
          populate: {
            path: 'userId',
            model: 'User'
          }
        },
        {
          path: 'problems',
          model: 'Problem'
        }
      ]
    });

    if (!student) {
      return res.status(400).json({ msg: 'Estudante não encontrado' });
    }

    const classesWithProgress = student.classes.map(classItem => {
      return {
        ...classItem._doc,
        progress: calculateProgress(student, classItem)
      };
    });

    res.render('student/dashboard', { classes: classesWithProgress });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Acessar tela de exercícios
const accessExercise = async (req, res) => {
  const { classId, problemId } = req.params;
  const studentId = req.user.id;

  try {
    const classItem = await Class.findById(classId).populate('problems');
    const problem = await Problem.findById(problemId);

    if (!classItem || !problem) {
      return res.status(400).json({ msg: 'Turma ou Problema não encontrado' });
    }

    res.render('student/exercise', { classItem, problem });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  joinClass,
  listStudentClasses,
  accessExercise
};
