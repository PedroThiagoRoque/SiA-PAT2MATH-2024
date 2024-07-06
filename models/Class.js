const mongoose = require('mongoose');
const crypto = require('crypto');

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],
  problems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }
  ],
  classCode: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(16).toString('hex') // Gera um código único de até 32 bytes
  }
});

module.exports = mongoose.model('Class', ClassSchema);
