const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
    createProblem,
    getProblems,
    getProblemById,
    updateProblem,
    deleteProblem
} = require('../controllers/problemController');

router.post('/', auth, createProblem);
router.get('/', auth, getProblems);
router.get('/:id', auth, getProblemById);
router.put('/:id', auth, updateProblem);
router.delete('/:id', auth, deleteProblem);

module.exports = router;
