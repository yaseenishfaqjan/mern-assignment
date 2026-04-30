import React, { useEffect, useState } from 'react';
import api from '../api';
import './CoursesPage.css';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [duration, setDuration] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setToast({ message: 'Error fetching courses', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', {
        title,
        description,
        instructor,
        duration: Number(duration)
      });
      // Clear form
      setTitle('');
      setDescription('');
      setInstructor('');
      setDuration('');
      
      setToast({ message: '✓ Course added successfully!', type: 'success' });
      // Refresh list
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
      setToast({ message: '✗ Something went wrong', type: 'error' });
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setToast({ message: '✓ Course deleted successfully!', type: 'success' });
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      setToast({ message: '✗ Something went wrong', type: 'error' });
    }
  };

  return (
    <div className="courses-page-container">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      {/* PAGE HEADER */}
      <div className="hero-banner">
        <h1>Courses Management</h1>
        <p>Manage and browse all available courses</p>
      </div>
      
      {/* ADD COURSE FORM */}
      <div className="add-course-section">
        <h2 className="section-title"><span className="icon">+</span> Add a New Course</h2>
        <form onSubmit={handleAddCourse} className="modern-form">
          <div className="form-grid-2">
            <div className="form-group-modern">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Intro to React" />
            </div>
            <div className="form-group-modern">
              <label>Instructor</label>
              <input type="text" value={instructor} onChange={(e) => setInstructor(e.target.value)} required placeholder="e.g. Jane Doe" />
            </div>
          </div>
          <div className="form-group-modern full-width">
            <label>Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will students learn?" />
          </div>
          <div className="form-group-modern full-width">
            <label>Duration (Hours)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required min="1" placeholder="e.g. 10" />
          </div>
          <button type="submit" className="btn-modern-submit">Add Course</button>
        </form>
      </div>

      {/* COURSE CARDS GRID */}
      <div className="courses-list-section">
        <div className="list-header">
          <h2>All Courses</h2>
          <span className="course-count-badge">{courses.length} courses</span>
        </div>
        
        {loading ? (
          <Spinner />
        ) : (
          <>
            {courses.length === 0 ? (
              <div className="global-empty-state">
                <div className="empty-icon">📭</div>
                <h3>No courses yet</h3>
                <p>Add your first course using the form above</p>
              </div>
            ) : (
              <div className="modern-card-grid">
                {courses.map((course) => (
                  <div key={course._id} className="modern-card">
                    <div className="card-accent-bar"></div>
                    <div className="card-body">
                      <div className="card-header">
                        <h3 className="course-title">{course.title}</h3>
                        <span className="duration-badge">{course.duration} hrs</span>
                      </div>
                      <div className="instructor-row">
                        <span role="img" aria-label="instructor">👨‍🏫</span> {course.instructor}
                      </div>
                      <p className="course-desc">{course.description}</p>
                      
                      <div className="card-actions">
                        <button onClick={() => handleDeleteCourse(course._id)} className="btn-modern-delete">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
