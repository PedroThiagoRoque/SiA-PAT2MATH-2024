const mongoose = require('mongoose');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Problem = require('../models/Problem');
const { solveEquation } = require('../modules/expert');

// Calcular progresso
const calculateProgress = (student, classItem) => {
  const solvedProblems = student.solvedProblems.map(p => p.toString());
  const totalProblems = classItem.problems.length;
  const solvedCount = classItem.problems.filter(problem => solvedProblems.includes(problem.toString())).length;
  return totalProblems === 0 ? 0 : Math.round((solvedCount / totalProblems) * 100);
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
    }).populate('solvedProblems');

    if (!student) {
      return res.status(400).json({ msg: 'Estudante não encontrado' });
    }

    const classesWithProgress = student.classes.map(classItem => {
      return {
        ...classItem._doc,
        progress: calculateProgress(student, classItem)
      };
    });

    res.render('student/dashboard', { classes: classesWithProgress, solvedProblems: student.solvedProblems });
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

///////////////////////////////////

// Submeter passo de resolução
const submitStep = async (req, res) => {
  const { nextStep, finalAnswer, problemId} = req.body;
  const userId = req.user.id; 

  try {
    let steps = solveEquation(nextStep);
    let valid = false;
    let isFinalAnswer = false;

    // Verificar se o passo inserido é o resultado final
    if (steps.length === 0 && nextStep === finalAnswer) {
      valid = true;
      isFinalAnswer = true;
      steps = [nextStep];
    } else {
      const lastStep = steps[steps.length - 1];
      if (lastStep === finalAnswer) {
        valid = lastStep === finalAnswer;
      }
    }

    if (isFinalAnswer) {
      // Adicionar o problema ao perfil do usuário
      await Student.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { solvedProblems: problemId } }
      );
    }

    res.json({ steps, valid, isFinalAnswer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ steps: [], valid: false, isFinalAnswer: false });
  }
};


module.exports = {
  joinClass,
  listStudentClasses,
  accessExercise,
  submitStep,
  calculateProgress
};
