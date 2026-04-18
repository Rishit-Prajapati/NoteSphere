import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Profile = () => {
  const { user, setUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [updating, setUpdating] = useState(false);
  const [passUpdating, setPassUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await axios.put('/api/auth/updatedetails', { name });
      if (res.data.success) {
        setSuccess('Name updated successfully!');
        setUser(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update name');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setPassUpdating(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await axios.put('/api/auth/updatepassword', { currentPassword, newPassword });
      setSuccess('Password updated successfully!');
      setUser(res.data.user);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    } finally {
      setPassUpdating(false);
    }
  };

  return (
    <div className="profile-container container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="profile-content"
      >
        <header className="profile-header">
          <h1>Account <span>Settings</span></h1>
          <p>Update your profile information and security settings.</p>
        </header>

        {(success || error) && (
          <div className={`notification-box ${success ? 'success' : 'error'}`}>
            {success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {success || error}
          </div>
        )}

        <div className="settings-grid">
          {/* Personal Info */}
          <section className="settings-card card glass">
            <div className="card-header">
              <User className="icon" size={20} />
              <h2>Personal Information</h2>
            </div>
            
            <form onSubmit={handleUpdateName} className="settings-form">
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" value={user?.email} disabled className="disabled-input" />
                <span className="helper-text">Email cannot be changed</span>
              </div>
              
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name" 
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={updating || name === user?.name}>
                {updating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Update Name
              </button>
            </form>
          </section>

          {/* Security */}
          <section className="settings-card card glass">
            <div className="card-header">
              <Lock className="icon" size={20} />
              <h2>Security</h2>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="settings-form">
              <div className="input-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-secondary" disabled={passUpdating || !currentPassword || !newPassword}>
                {passUpdating ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                Change Password
              </button>
            </form>
          </section>
        </div>
      </motion.div>

      <style>{`
        .profile-container {
          padding-top: 3rem;
          max-width: 1000px;
          margin-inline: auto;
        }

        .profile-header {
          margin-bottom: 3rem;
        }

        .profile-header h1 { font-size: 2.5rem; }
        .profile-header h1 span { color: var(--primary); }
        .profile-header p { color: #64748b; margin-top: 0.5rem; }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .settings-card {
          padding: 2rem;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .card-header .icon { color: var(--primary); }
        .card-header h2 { font-size: 1.25rem; font-weight: 600; }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .helper-text {
          display: block;
          margin-top: 0.4rem;
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .disabled-input {
          background: rgba(0, 0, 0, 0.05);
          cursor: not-allowed;
          opacity: 0.7;
        }

        .notification-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          animation: slideDown 0.3s ease-out;
        }

        .notification-box.success {
          background: #dcfce7;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .notification-box.error {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .settings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
