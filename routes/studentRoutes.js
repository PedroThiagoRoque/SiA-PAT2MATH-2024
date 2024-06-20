const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getStudentDashboard, getStudentPerformance } = require('../controllers/studentController');

router.get('/dashboard', auth, getStudentDashboard);
router.get('/performance', auth, getStudentPerformance);

module.exports = router;
