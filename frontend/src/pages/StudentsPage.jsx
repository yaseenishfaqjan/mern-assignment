import React, { useEffect, useState } from 'react';
import api from '../api';
import './StudentsPage.css';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setToast({ message: 'Error fetching students', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students', {
        name,
        email,
        age: Number(age)
      });
      // Clear form
      setName('');
      setEmail('');
      setAge('');
      setToast({ message: '✓ Student added successfully!', type: 'success' });
      // Refresh list
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      setToast({ message: '✗ Something went wrong', type: 'error' });
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      setToast({ message: '✓ Student deleted successfully!', type: 'success' });
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      setToast({ message: '✗ Something went wrong', type: 'error' });
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="students-page-container">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      {/* PAGE HEADER */}
      <div className="students-hero-banner">
        <h1>Students Management</h1>
        <p>Track and manage enrolled students</p>
      </div>
      
      {/* ADD STUDENT FORM */}
      <div className="add-student-section">
        <h2 className="section-title"><span className="icon">+</span> Add a New Student</h2>
        <form onSubmit={handleAddStudent} className="modern-form">
          <div className="form-grid-3">
            <div className="form-group-modern">
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. John Doe" />
            </div>
            <div className="form-group-modern">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@example.com" />
            </div>
            <div className="form-group-modern">
              <label>Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required min="1" placeholder="e.g. 21" />
            </div>
          </div>
          <button type="submit" className="btn-modern-submit">Add Student</button>
        </form>
      </div>

      {/* STUDENTS TABLE */}
      <div className="students-list-section">
        <div className="list-header">
          <h2>Enrolled Students</h2>
          <span className="student-count-badge">{students.length} students</span>
        </div>
        
        {loading ? (
          <Spinner />
        ) : (
          <div className="modern-table-container">
            {students.length === 0 ? (
              <div className="global-empty-state">
                <div className="empty-icon">👥</div>
                <h3>No students yet</h3>
                <p>Add your first student using the form above</p>
              </div>
            ) : (
              <table className="modern-students-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email Address</th>
                    <th>Age</th>
                    <th className="action-col"></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="name-col">
                        <div className="avatar-circle">
                          {getInitials(student.name)}
                        </div>
                        <span className="student-name">{student.name}</span>
                      </td>
                      <td className="email-col">{student.email}</td>
                      <td className="age-col">
                        <span className="age-badge">{student.age}</span>
                      </td>
                      <td className="action-col">
                        <button 
                          onClick={() => handleDeleteStudent(student._id)} 
                          className="btn-delete-row"
                          title="Delete Student"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
