const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }
  ],
  solvedProblems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }
  ]
});

module.exports = mongoose.model('Student', StudentSchema);
