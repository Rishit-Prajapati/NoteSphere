import { Link } from 'react-router-dom';
import { FileText, ThumbsUp, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const MaterialCard = ({ material, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="material-card-container card"
    >
      <Link to={`/materials/${material._id}`}>
        <div className="card-top glass">
          <FileText size={40} className="file-icon" />
          <div className="file-type-badge">
            {material.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}
          </div>
        </div>
        
        <div className="card-body">
          <h3 className="material-title">{material.title}</h3>
          <p className="material-subject">{material.subject}</p>
          
          <div className="material-meta">
            <div className="meta-item">
              <Tag size={14} />
              <span>{material.category}</span>
            </div>
            <div className="meta-item">
              <Calendar size={14} />
              <span>{material.year}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="card-footer">
        <div className="interaction">
          <ThumbsUp size={16} />
          <span>{material.likes || 0}</span>
        </div>
        <div className="uploader">
          <span>By {material.uploaderName}</span>
        </div>
      </div>

      <style>{`
        .material-card-container {
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .card-top {
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: var(--primary-light);
          color: var(--primary);
        }

        .file-icon {
          opacity: 0.8;
          transition: transform 0.3s ease;
        }

        .file-type-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: white;
          color: var(--primary);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          box-shadow: var(--shadow);
        }

        .card-body {
          padding: 1.25rem;
          flex-grow: 1;
        }

        .material-title {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .material-subject {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .material-meta {
          display: flex;
          gap: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .card-footer {
          padding: 0.75rem 1.25rem;
          border-top: 1px solid var(--card-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0, 0, 0, 0.02);
        }

        .interaction {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: #64748b;
        }

        .uploader {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .material-card-container:hover .file-icon {
          transform: scale(1.1);
          color: var(--primary);
        }
      `}</style>
    </motion.div>
  );
};

export default MaterialCard;
