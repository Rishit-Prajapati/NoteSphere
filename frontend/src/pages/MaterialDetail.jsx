import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Download, ThumbsUp, MessageSquare, Tag, FileText, Calendar, User, ArrowLeft, Loader2, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const MaterialDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await axios.get(`/api/materials/${id}`);
        setMaterial(res.data.data);
        if (user && res.data.data.upvotes?.includes(user.id)) {
          setLiked(true);
        }
      } catch (err) {
        navigate('/materials');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id, user, navigate]);

  const handleLike = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await axios.put(`/api/materials/${id}/like`);
      setMaterial(res.data.data);
      setLiked(!liked);
    } catch (err) {
      console.error('Error liking:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`/api/materials/${id}/comment`, { text: comment });
      setMaterial({ ...material, comments: res.data.data });
      setComment('');
    } catch (err) {
      console.error('Error commenting:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-screen"><Loader2 className="animate-spin" /></div>;
  if (!material) return null;

  return (
    <div className="detail-container container">
      <Link to="/materials" className="back-link">
        <ArrowLeft size={18} /> Back to Resources
      </Link>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="file-preview-card card glass">
            <div className="preview-header">
              <h1>{material.title}</h1>
              <div className="file-badge">{material.fileType?.split('/')[1]?.toUpperCase()}</div>
            </div>
            
            <div className="preview-content">
              {material.fileType?.includes('pdf') ? (
                <iframe 
                  src={`${material.fileUrl}#toolbar=0`} 
                  width="100%" 
                  height="600px" 
                  className="pdf-iframe"
                  title="PDF Preview"
                />
              ) : material.fileType?.includes('image') ? (
                <img src={material.fileUrl} alt={material.title} className="image-preview" />
              ) : (
                <div className="no-preview glass">
                  <FileText size={64} />
                  <p>Preview not available. Please download to view.</p>
                  <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    Open URL
                  </a>
                </div>
              )}
            </div>
          </div>

          <section className="comments-section card">
            <h2><MessageSquare size={20} /> Discussion ({material.comments?.length || 0})</h2>
            
            <form onSubmit={handleComment} className="comment-form">
              <textarea 
                placeholder={user ? "Write a comment..." : "Log in to join the discussion"} 
                disabled={!user || submitting}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="btn btn-primary" disabled={!user || submitting || !comment.trim()}>
                Post Comment
              </button>
            </form>

            <div className="comments-list">
              {material.comments?.map((c, i) => (
                <div key={i} className="comment-item glass">
                  <div className="comment-user">
                    <div className="avatar">{c.userName?.[0]}</div>
                    <div className="user-meta">
                      <strong>{c.userName}</strong>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="comment-text">{c.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="detail-sidebar">
          <div className="sidebar-card card glass">
            <a href={material.fileUrl} download className="btn btn-primary w-full download-btn">
              <Download size={20} /> Download File
            </a>
            
            <button 
              className={`btn w-full like-btn ${liked ? 'liked' : 'secondary'}`}
              onClick={handleLike}
            >
              <ThumbsUp size={20} /> {liked ? 'Liked' : 'Like Resource'}
            </button>

            <hr className="divider" />

            <div className="info-section">
              <h3>Resource Details</h3>
              <div className="info-item">
                <Tag size={18} />
                <div>
                  <label>Category</label>
                  <p>{material.category}</p>
                </div>
              </div>
              <div className="info-item">
                <User size={18} />
                <div>
                  <label>Uploaded By</label>
                  <p>{material.uploaderName}</p>
                </div>
              </div>
              <div className="info-item">
                <Calendar size={18} />
                <div>
                  <label>Year</label>
                  <p>{material.year}</p>
                </div>
              </div>
            </div>

            <button className="btn btn-secondary w-full" onClick={() => navigator.clipboard.writeText(window.location.href)}>
              <Share2 size={18} /> Share Link
            </button>
          </div>
        </aside>
      </div>

      <style>{`
        .detail-container { padding-top: 2rem; display: flex; flex-direction: column; gap: 2rem; }
        .back-link { display: flex; align-items: center; gap: 0.5rem; color: #64748b; font-weight: 500; }
        .detail-grid { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; align-items: start; }
        .preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .file-badge { background: var(--primary-light); color: var(--primary); padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.8rem; }
        .pdf-iframe { border-radius: 12px; border: 1px solid var(--card-border); }
        .comments-section { margin-top: 2rem; display: flex; flex-direction: column; gap: 2rem; }
        .comment-form { display: flex; flex-direction: column; gap: 1rem; }
        .comment-item { padding: 1.25rem; border-radius: 12px; margin-bottom: 1rem; }
        .comment-user { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem; }
        .avatar { width: 32px; height: 32px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .sidebar-card { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; position: sticky; top: 100px; }
        .like-btn.liked { background: var(--primary); color: white; }
        .divider { border: 0; border-top: 1px solid var(--card-border); margin: 0.5rem 0; }
        .info-section { display: flex; flex-direction: column; gap: 1.25rem; }
        .info-item { display: flex; gap: 1rem; }
        .info-item label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .w-full { width: 100%; }
        .loading-screen { height: 80vh; display: flex; align-items: center; justify-content: center; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr; } .sidebar-card { position: static; } }
      `}</style>
    </div>
  );
};

export default MaterialDetail;
