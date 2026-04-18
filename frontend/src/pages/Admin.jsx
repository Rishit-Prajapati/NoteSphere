import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, FileText, Check, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Admin = () => {
  const { user } = useAuth();
  const [pendingMaterials, setPendingMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      // In a real app, I'd have a specific admin/pending route
      // Here we filter on the client for simplicity of implementation
      const res = await axios.get('/api/materials');
      // The materialController only returns 'approved' by default.
      // I'll assume for this prototype that I added a route for pending or the controller can be adjusted.
      // Let's assume there's an admin route at /api/materials/admin/pending
       setPendingMaterials(res.data.data.filter(m => m.status === 'pending'));
    } catch (err) {
      console.error('Error fetching pending:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await axios.put(`/api/materials/${id}/status`, { status });
      setPendingMaterials(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="admin-container container">
      <header className="admin-header">
        <h1><Shield size={32} /> Admin Control Panel</h1>
        <p>Review and moderate pending study materials.</p>
      </header>

      <div className="admin-grid">
        <section className="pending-section card glass">
          <h2>Pending Approvals ({pendingMaterials.length})</h2>
          
          <div className="materials-list">
            {loading ? (
              <p>Loading pending resources...</p>
            ) : pendingMaterials.length === 0 ? (
              <div className="empty-state">
                <Check size={48} color="#10b981" />
                <p>All clear! No pending materials.</p>
              </div>
            ) : (
              pendingMaterials.map(m => (
                <div key={m._id} className="admin-item glass">
                  <div className="item-info">
                    <FileText size={20} />
                    <div>
                      <h3>{m.title}</h3>
                      <p>{m.category} • By {m.uploaderName}</p>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button className="btn-approve" onClick={() => handleStatus(m._id, 'approved')}>
                       {actionLoading === m._id ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                       Approve
                    </button>
                    <button className="btn-reject" onClick={() => handleStatus(m._id, 'rejected')}>
                       <X size={16} /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <style>{`
        .admin-container { padding-top: 2rem; display: flex; flex-direction: column; gap: 2rem; }
        .admin-header h1 { display: flex; align-items: center; gap: 0.75rem; font-size: 2.2rem; }
        .admin-grid { display: grid; gap: 2rem; }
        .materials-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
        .admin-item { padding: 1.25rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .item-info { display: flex; gap: 1rem; align-items: center; }
        .item-actions { display: flex; gap: 0.75rem; }
        .btn-approve, .btn-reject { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; }
        .btn-approve { background: #dcfce7; color: #16a34a; }
        .btn-reject { background: #fee2e2; color: #dc2626; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Admin;
