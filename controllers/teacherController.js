const Class = require('../models/Class');
const Problem = require('../models/Problem');
const Teacher = require('../models/Teacher');

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

module.exports = {
  createClass,
  createProblem
};
