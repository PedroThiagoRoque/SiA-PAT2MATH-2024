const Class = require('../models/Class');
const Problem = require('../models/Problem');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const mongoose = require('mongoose');


// Criar uma nova turma
const createClass = async (req, res) => {
  const { name, problems } = req.body;
  const teacherId = req.user.id;

  try {
    const teacher = await Teacher.findOne({ userId: teacherId });

    if (!teacher) {
      return res.status(400).json({ msg: 'Professor não encontrado' });
    }

    const problemsArray = problems ? problems.split(',').map(id => id.trim()).filter(id => id) : [];

    // Verificar se todos os IDs de problemas são válidos
    for (const problemId of problemsArray) {
      const problemExists = await Problem.findById(problemId);
      if (!problemExists) {
        return res.render('teacher/edit-class', {
          classItem: { _id: req.params.id, name, problems: problemsArray.join(', ') },
          errorMsg: `O problema com ID ${problemId} não existe.`
        });
      }
    }

    const newClass = new Class({
      name,
      teacher: teacher._id,
      problems: problemsArray
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

// Renderizar a página de edição da turma
const renderEditClassPage = async (req, res) => {
  const classId = req.params.id;

  try {
    const classItem = await Class.findById(classId);

    if (!classItem) {
      return res.status(400).json({ msg: 'Turma não encontrada' });
    }

    res.render('teacher/edit-class', { classItem, errorMsg: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Editar turma
// Função utilitária para validar ObjectIds
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

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

module.exports = {
  createClass,
  createProblem,
  listClasses,
  deleteClass,
  renderEditClassPage,
  editClass
};
