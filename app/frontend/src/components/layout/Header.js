import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/components/Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="app-header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <h1>Family Vine</h1>
          </Link>
        </div>
        
        <nav className={`main-nav ${menuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/documents" className="nav-link">Documents</Link>
              <Link to="/visualization" className="nav-link">Visualize</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
        
        {user && (
          <div className="user-menu">
            <div className="user-info" onClick={toggleMenu}>
              <span className="username">{user.username || user.email}</span>
            </div>
            <div className={`dropdown-menu ${menuOpen ? 'active' : ''}`}>
              <Link to="/settings" className="dropdown-item">Settings</Link>
              <button className="dropdown-item logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
        
        <div className="mobile-menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;