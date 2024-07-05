const Problem = require('../models/problem');

exports.createProblem = async (req, res) => {
    const { statement, algebraicExpression, knowledgeArea, difficulty, solution } = req.body;

    try {
        const newProblem = new Problem({
            statement,
            algebraicExpression,
            knowledgeArea,
            difficulty,
            solution,
            createdBy: req.user.id
        });

        const problem = await newProblem.save();
        res.json(problem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getProblems = async (req, res) => {
    try {
        const problems = await Problem.find().populate('createdBy', ['name', 'email']);
        res.json(problems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id).populate('createdBy', ['name', 'email']);
        if (!problem) return res.status(404).json({ msg: 'Problem not found' });

        res.json(problem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateProblem = async (req, res) => {
    const { statement, algebraicExpression, knowledgeArea, difficulty, solution } = req.body;

    try {
        let problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).json({ msg: 'Problem not found' });

        // Check if the user updating the problem is the creator
        if (problem.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        problem = await Problem.findByIdAndUpdate(
            req.params.id,
            { $set: { statement, algebraicExpression, knowledgeArea, difficulty, solution } },
            { new: true }
        );

        res.json(problem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).json({ msg: 'Problem not found' });

        // Check if the user deleting the problem is the creator
        if (problem.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await problem.remove();

        res.json({ msg: 'Problem removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
