const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getTeacherDashboard, getTeacherStudents } = require('../controllers/teacherController');

router.get('/dashboard', auth, getTeacherDashboard);
router.get('/students', auth, getTeacherStudents);

module.exports = router;
