const Student = require('../models/Student');
const Course = require('../models/Course');

exports.enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    // Validate if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Validate if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Prevent duplicate enrollments
    if (student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Student is already enrolled in this course' });
    }

    student.enrolledCourses.push(courseId);
    await student.save();

    res.status(200).json({ message: 'Successfully enrolled', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unenrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if enrolled before removing
    if (!student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Student is not enrolled in this course' });
    }

    student.enrolledCourses = student.enrolledCourses.filter(
      id => id.toString() !== courseId.toString()
    );
    await student.save();

    res.status(200).json({ message: 'Successfully unenrolled', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('enrolledCourses');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
