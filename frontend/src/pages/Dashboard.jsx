import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Upload, BookMarked, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [userUploads, setUserUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserUploads = async () => {
      try {
        const res = await axios.get('/api/materials/me');
        setUserUploads(res.data.data);
      } catch (err) {
        console.error('Error fetching uploads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserUploads();
  }, [user.id]);

  const stats = [
    { label: "Total Uploads", value: userUploads.length, icon: <Upload size={20} />, color: "#4f46e5" },
    { label: "Active Notes", value: userUploads.filter(u => u.status === 'approved').length, icon: <CheckCircle size={20} />, color: "#10b981" },
    { label: "Bookmarks", value: user.bookmarks?.length || 0, icon: <BookMarked size={20} />, color: "#0ea5e9" },
  ];

  return (
    <div className="dashboard-container container">
      <header className="dashboard-header">
        <div className="header-text">
          <h1>Welcome, {user.name}</h1>
          <p>Manage your academic resources and track your contributions.</p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          <Upload size={18} /> New Upload
        </Link>
      </header>

      {/* Stats Section */}
      <section className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card card">
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="dashboard-grid">
        {/* Recent Uploads */}
        <div className="dashboard-main card">
          <div className="card-header">
            <h2><Clock size={20} /> Your Recent Uploads</h2>
            <Link to="/materials">See All</Link>
          </div>
          
          <div className="uploads-list">
            {loading ? (
               <p>Loading uploads...</p>
            ) : userUploads.length === 0 ? (
              <div className="empty-state">
                <p>You haven't uploaded anything yet.</p>
                <Link to="/upload" className="btn btn-secondary">Start Sharing</Link>
              </div>
            ) : (
              userUploads.map(upload => (
                <div key={upload._id} className="upload-item glass">
                  <div className="upload-meta">
                    <h4>{upload.title}</h4>
                    <span>{upload.category} • {new Date(upload.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`status-badge ${upload.status}`}>
                    {upload.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Sidebar */}
        <div className="dashboard-sidebar card">
          <div className="user-info">
            <div className="user-avatar glass">
              <User size={40} />
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          <hr />
          <nav className="sidebar-nav">
             <Link to="/profile" className="nav-link">Account Settings</Link>
             {user.role === 'admin' && <Link to="/admin" className="nav-link admin-link">Admin Panel</Link>}
          </nav>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-text h1 { font-size: 2.2rem; }
        .header-text p { color: #64748b; margin-top: 0.25rem; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .stat-icon {
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info h3 { font-size: 1.75rem; }
        .stat-info p { font-size: 0.9rem; color: #64748b; }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .uploads-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .upload-item {
          padding: 1.25rem;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-badge {
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.pending { background: #fef3c7; color: #d97706; }
        .status-badge.approved { background: #dcfce7; color: #16a34a; }
        .status-badge.rejected { background: #fee2e2; color: #dc2626; }

        .user-avatar {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          background: var(--primary-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }

        .nav-link {
          padding: 0.75rem;
          border-radius: 8px;
          color: #64748b;
          font-weight: 500;
        }

        .nav-link:hover {
          background: var(--primary-light);
          color: var(--primary);
        }

        .admin-link {
          color: var(--primary);
          border: 1px solid var(--primary);
          margin-top: 1rem;
        }

        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
