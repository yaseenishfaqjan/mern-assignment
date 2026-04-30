import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CoursesPage from './pages/CoursesPage';
import StudentsPage from './pages/StudentsPage';
import EnrollPage from './pages/EnrollPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<CoursesPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/enroll" element={<EnrollPage />} />
      </Routes>
    </Router>
  );
}

export default App;
