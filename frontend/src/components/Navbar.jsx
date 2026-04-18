import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Upload, BookMarked, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-profile-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <nav className="navbar glass">
      <div className="nav-container container">
        <Link to="/" className="nav-logo">
          Note<span>Sphere</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/materials">Browse</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-item">
                <BookMarked size={18} /> Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/upload" className="btn btn-primary btn-sm">
                  <Upload size={18} /> Upload
                </Link>
              )}
              <div className="user-profile-container">
                <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
                  <User size={20} />
                </div>
                {showDropdown && (
                  <div className="dropdown glass show">
                    <p>{user.name}</p>
                    <hr />
                    <button onClick={logout} className="logout-btn">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
          <button onClick={toggleTheme} className="theme-toggle">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0.75rem 0;
          margin: 0.5rem 1rem;
          border-radius: 12px;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--foreground);
        }

        .nav-logo span {
          color: var(--primary);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }

        .theme-toggle {
          color: var(--foreground);
          padding: 0.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-profile-container {
          position: relative;
        }

        .user-profile {
          cursor: pointer;
          padding: 0.5rem;
          background: var(--primary-light);
          border-radius: 50%;
          color: var(--primary);
          transition: all 0.3s ease;
        }

        .user-profile:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        .dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.75rem;
          padding: 1.25rem;
          width: 220px;
          border-radius: 16px;
          text-align: left;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transform-origin: top right;
          animation: dropIn 0.2s ease-out;
        }

        @keyframes dropIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .dropdown p {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }

        .dropdown hr {
          border: 0;
          border-top: 1px solid var(--card-border);
          margin: 0.5rem 0;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ef4444;
          padding: 0.5rem 0;
          font-weight: 500;
          border-radius: 6px;
        }
        
        .logout-btn:hover {
          background: #fee2e2;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
