import React, { useState, useEffect } from 'react';
import api from '../api';
import './EnrollPage.css';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

const EnrollPage = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingEnrolled, setLoadingEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({ message: '', type: '' });

  // Fetch all students and courses on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          api.get('/students'),
          api.get('/courses')
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setToast({ message: '✗ Failed to load data', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch enrolled courses dynamically when a student is selected
  useEffect(() => {
    if (!selectedStudent) {
      setEnrolledCourses([]);
      return;
    }

    const fetchEnrolledCourses = async () => {
      setLoadingEnrolled(true);
      try {
        const res = await api.get(`/students/${selectedStudent}/courses`);
        setEnrolledCourses(res.data.enrolledCourses || []);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setToast({ message: '✗ Error fetching enrollments', type: 'error' });
      } finally {
        setLoadingEnrolled(false);
      }
    };

    fetchEnrolledCourses();
  }, [selectedStudent]);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourse) return;

    try {
      await api.post('/enroll', {
        studentId: selectedStudent,
        courseId: selectedCourse,
      });
      setToast({ message: '✓ Course added successfully!', type: 'success' });
      
      // Refresh enrolled courses
      const refreshRes = await api.get(`/students/${selectedStudent}/courses`);
      setEnrolledCourses(refreshRes.data.enrolledCourses || []);
      // Reset course dropdown
      setSelectedCourse('');
    } catch (err) {
      setToast({ message: '✗ Something went wrong', type: 'error' });
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm('Are you sure you want to unenroll from this course?')) return;

    try {
      await api.delete('/enroll', {
        data: {
          studentId: selectedStudent,
          courseId: courseId
        }
      });
      setToast({ message: '✓ Successfully unenrolled!', type: 'success' });
      
      // Refresh enrolled courses after deletion
      const refreshRes = await api.get(`/students/${selectedStudent}/courses`);
      setEnrolledCourses(refreshRes.data.enrolledCourses || []);
    } catch (err) {
      setToast({ message: '✗ Something went wrong', type: 'error' });
    }
  };

  // Helper to find selected student name
  const getSelectedStudentName = () => {
    const student = students.find(s => s._id === selectedStudent);
    return student ? student.name : '';
  };

  if (loading) {
    return (
      <div className="enroll-page-container">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="enroll-page-container">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <div className="enroll-grid">
        
        {/* LEFT CARD - ENROLLMENT FORM */}
        <div className="enroll-card">
          <h2 className="enroll-title">🎯 Enroll a Student</h2>

          <form onSubmit={handleEnroll} className="enrollment-form">
            <div className="form-group-enroll">
              <label>Select Student</label>
              <div className="select-wrapper">
                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
                  <option value="" disabled>-- Choose a Student --</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
                </select>
              </div>
            </div>
            <div className="form-group-enroll">
              <label>Select Course</label>
              <div className="select-wrapper">
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
                  <option value="" disabled>-- Choose a Course --</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-gradient-submit" 
              disabled={!selectedStudent || !selectedCourse}
            >
              Enroll Now
            </button>
          </form>
        </div>

        {/* RIGHT CARD - ENROLLED COURSES */}
        <div className="enroll-card right-card">
          <div className="right-header">
            <h2 className="enroll-title">📚 Enrolled Courses</h2>
            {selectedStudent && (
              <span className="student-chip">{getSelectedStudentName()}</span>
            )}
          </div>

          {!selectedStudent ? (
            <div className="empty-state">
              <div className="empty-icon">🔎</div>
              <p>Select a student to view their courses</p>
            </div>
          ) : loadingEnrolled ? (
            <Spinner />
          ) : enrolledCourses.length === 0 ? (
            <div className="global-empty-state">
              <div className="empty-icon">🎒</div>
              <h3>Not enrolled</h3>
              <p>Not enrolled in any course yet</p>
            </div>
          ) : (
            <div className="mini-cards-list">
              {enrolledCourses.map((course) => (
                <div key={course._id} className="mini-course-card">
                  <div className="mini-card-content">
                    <h4 className="mini-course-title">{course.title}</h4>
                    <div className="mini-course-tags">
                      <span className="tag">👨‍🏫 {course.instructor}</span>
                      <span className="tag tag-blue">⏳ {course.duration} hrs</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleUnenroll(course._id)}
                    className="btn-remove-mini"
                    title="Remove Course"
                  >
                    Remove ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollPage;
