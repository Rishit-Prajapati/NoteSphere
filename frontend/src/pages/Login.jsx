import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-card glass"
      >
        <h2>Welcome Back to <span>NoteSphere</span></h2>
        <p>Log in to access your notes and continue your learning journey.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              placeholder="Email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Log In"}
          </button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </motion.div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, var(--primary-light), transparent),
                      radial-gradient(circle at bottom left, #f1f5f9, transparent);
        }

        .auth-card {
          width: 100%;
          max-width: 450px;
          padding: 3rem 2rem;
          border-radius: 20px;
          text-align: center;
        }

        .auth-card h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .auth-card h2 span {
          color: var(--primary);
        }

        .auth-card p {
          color: #64748b;
          margin-bottom: 2rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        input {
          padding-left: 3rem !important;
        }

        .error-message {
          background: #fee2e2;
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .auth-footer {
          margin-top: 2rem;
          font-size: 0.95rem;
        }

        .auth-footer a {
          color: var(--primary);
          font-weight: 600;
        }

        .w-full { width: 100%; }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
