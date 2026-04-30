const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

router.post('/enroll', enrollmentController.enrollStudent);
router.delete('/enroll', enrollmentController.unenrollStudent);
router.get('/students/:id/courses', enrollmentController.getStudentCourses);

module.exports = router;
