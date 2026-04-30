import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="emoji" role="img" aria-label="graduation cap">🎓</span>
          <span className="logo-text">EduPlatform</span>
        </Link>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end>Courses</NavLink>
        <NavLink to="/students">Students</NavLink>
        <NavLink to="/enroll">Enroll</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
