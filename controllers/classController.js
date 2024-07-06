const Class = require('../models/Class');
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
      problems
    });

    await newClass.save();

    teacher.classes.push(newClass._id);
    await teacher.save();

    res.status(201).json(newClass);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  createClass
};
