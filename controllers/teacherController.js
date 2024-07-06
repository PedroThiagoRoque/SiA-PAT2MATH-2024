const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// Função utilitária para validar ObjectIds
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Ordem personalizada das dificuldades
const difficultyOrder = ['easy', 'medium', 'hard'];

// Função de comparação para ordenar por dificuldade
const compareDifficulty = (a, b) => {
  return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
};

// Criar uma nova turma
const createClass = async (req, res) => {
  const { name, problems } = req.body;
  const teacherId = req.user.id;

  try {
    const teacher = await Teacher.findOne({ userId: teacherId });

    if (!teacher) {
      return res.status(400).json({ msg: 'Professor não encontrado' });
    }

    const newClass = new Class({
      name,
      teacher: teacher._id,
      problems: problems ? problems.split(',').map(id => id.trim()) : []
    });

    await newClass.save();

    teacher.classes.push(newClass._id);
    await teacher.save();

    res.redirect('/api/teacher/dashboard');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Criar um novo problema
const createProblem = async (req, res) => {
  const { title, statement, equation, result, difficulty } = req.body;
  const teacherId = req.user.id;

  try {
    const teacher = await Teacher.findOne({ userId: teacherId });

    if (!teacher) {
      return res.status(400).json({ msg: 'Professor não encontrado' });
    }

    const newProblem = new Problem({
      title,
      statement,
      equation,
      result,
      difficulty,
      createdBy: teacher._id
    });

    await newProblem.save();

    res.redirect('/api/teacher/dashboard');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Listar turmas do professor
const listClasses = async (req, res) => {
  const teacherId = req.user.id;

  try {
    const teacher = await Teacher.findOne({ userId: teacherId }).populate({
      path: 'classes',
      populate: {
        path: 'students',
        model: 'Student',
        populate: {
          path: 'userId',
          model: 'User'
        }
      }
    });

    if (!teacher) {
      return res.status(400).json({ msg: 'Professor não encontrado' });
    }

    res.render('teacher/dashboard', { classes: teacher.classes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Renderizar a página de edição da turma
const renderEditClassPage = async (req, res) => {
  const classId = req.params.id;

  try {
    const classItem = await Class.findById(classId);

    if (!classItem) {
      return res.status(400).json({ msg: 'Turma não encontrada' });
    }

    res.render('teacher/edit-class', { classItem });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Editar turma
const editClass = async (req, res) => {
  const classId = req.params.id;
  const { name, problems } = req.body;

  try {
    const classItem = await Class.findById(classId);

    if (!classItem) {
      return res.status(400).json({ msg: 'Turma não encontrada' });
    }

    const problemsArray = problems ? problems.split(',').map(id => id.trim()).filter(id => id) : [];

    // Validar IDs dos problemas
    const invalidProblems = problemsArray.filter(id => !isValidObjectId(id));
    if (invalidProblems.length > 0) {
      return res.render('teacher/edit-class', {
        classItem,
        errorMessage: `Os seguintes IDs de problemas são inválidos: ${invalidProblems.join(', ')}`
      });
    }

    classItem.name = name;
    classItem.problems = problemsArray;
    await classItem.save();

    res.redirect('/api/teacher/dashboard');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Excluir turma
const deleteClass = async (req, res) => {
  const classId = req.params.id;

  try {
    await Class.findByIdAndDelete(classId);
    res.redirect('/api/teacher/dashboard');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Listar problemas
const listProblems = async (req, res) => {
  const userId = req.user.id;

  try {
    // Buscar o ID do professor usando o ID do usuário
    const teacher = await Teacher.findOne({ userId: userId });
    if (!teacher) {
      return res.status(400).json({ msg: 'Professor não encontrado' });
    }

    const teacherId = teacher._id;

    const myProblems = await Problem.find({ createdBy: teacherId }).exec();
    const otherProblems = await Problem.find({ createdBy: { $ne: teacherId } }).exec();

    // Ordenar problemas por dificuldade usando a função de comparação personalizada
    myProblems.sort(compareDifficulty);
    otherProblems.sort(compareDifficulty);

    res.render('teacher/list-problems', { myProblems, otherProblems });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};



// Renderizar a página de edição do problema
const renderEditProblemPage = async (req, res) => {
  const problemId = req.params.id;

  try {
    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(400).json({ msg: 'Problema não encontrado' });
    }

    res.render('teacher/edit-problem', { problem });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Editar problema
const editProblem = async (req, res) => {
  const problemId = req.params.id;
  const { title, statement, equation, result, difficulty } = req.body;

  try {
    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(400).json({ msg: 'Problema não encontrado' });
    }

    problem.title = title;
    problem.statement = statement;
    problem.equation = equation;
    problem.result = result;
    problem.difficulty = difficulty;
    await problem.save();

    res.redirect('/api/teacher/list-problems');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Excluir problema
const deleteProblem = async (req, res) => {
  const problemId = req.params.id;

  try {
    await Problem.findByIdAndDelete(problemId);
    res.redirect('/api/teacher/list-problems');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  createClass,
  createProblem,
  listClasses,
  deleteClass,
  renderEditClassPage,
  editClass,
  listProblems,
  renderEditProblemPage,
  editProblem,
  deleteProblem
};
