const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProblemSchema = new Schema({
    statement: {
        type: String,
        required: true
    },
    algebraicExpression: {
        type: String,
        required: true
    },
    knowledgeArea: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    solution: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Problem', ProblemSchema);
