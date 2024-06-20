const express = require('express');
const router = express.Router();
const { getStudentHub, getTeacherDashboard, getProblemInterface } = require('../controllers/viewController');
const auth = require('../middlewares/authMiddleware');

router.get('/student-hub', auth, getStudentHub);
router.get('/teacher-dashboard', auth, getTeacherDashboard);
router.get('/problem-interface', auth, getProblemInterface);

module.exports = router;
