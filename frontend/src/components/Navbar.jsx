import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, PlusCircle, Sun, Moon, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <CalendarDays className="logo-icon" />
          <span>Evenza</span>
        </Link>

        <div className="navbar-links">
          <Link to="/events" className="navbar-text-link">Events</Link>

          {isAdmin && (
            <>
              <Link to="/admin" className="navbar-text-link">Dashboard</Link>
              <Link to="/admin/registrations" className="navbar-text-link">Registrations</Link>
              <Link to="/create" className="btn btn-primary btn-sm">
                <PlusCircle size={18} />
                Create Event
              </Link>
            </>
          )}

          <button onClick={toggleTheme} className="btn-icon theme-toggle" aria-label="Toggle Theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="navbar-user">
              <span className="navbar-username">
                <User size={16} />
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <LogIn size={18} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
