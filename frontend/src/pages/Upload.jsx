import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, File, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/materials');
    }
  }, [user, navigate]);
  
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Notes');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [exam, setExam] = useState('');
  const [description, setDescription] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setError("File size too large. Max 10MB allowed.");
        setFile(null);
        return;
      }
      setFile(selected);
      setTitle(selected.name.split('.')[0]);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('subject', subject);
    formData.append('year', year);
    formData.append('exam', exam);
    formData.append('description', description);

    try {
      await axios.post('/api/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="upload-card card glass"
      >
        <div className="card-title">
          <UploadIcon className="icon" size={32} />
          <h1>Upload Resource</h1>
        </div>
        
        {success ? (
          <div className="success-state">
            <CheckCircle size={64} color="#10b981" />
            <h2>Upload Successful!</h2>
            <p>Your material has been submitted for moderation. You'll be redirected shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="upload-form">
            <div className="file-dropzone glass" onClick={() => document.getElementById('file-input').click()}>
              <input 
                id="file-input"
                type="file" 
                onChange={handleFileChange} 
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                hidden
              />
              {file ? (
                <div className="selected-file">
                  <File size={40} />
                  <p>{file.name}</p>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ) : (
                <div className="dropzone-text">
                  <UploadIcon size={40} />
                  <p>Click to select or drag and drop</p>
                  <span>Support PDF, DOCX, and Images (Max 10MB)</span>
                </div>
              )}
            </div>

            {error && <div className="error-box"><AlertCircle size={16} /> {error}</div>}

            <div className="form-sections">
              <div className="input-group">
                <label>Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Physics Semester 1 Notes" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option>Notes</option>
                    <option>PYQ Papers</option>
                    <option>Solutions</option>
                    <option>Assignments</option>
                    <option>Other Resources</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Subject</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mathematics" 
                    required 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Year</label>
                  <input 
                    type="number" 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Exam (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. JEE, NEET" 
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Description (Optional)</label>
                <textarea 
                  rows="3"
                  placeholder="Tell others what this file is about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <button 
              className="btn btn-primary w-full" 
              disabled={!file || uploading}
              type="submit"
            >
              {uploading ? (
                <div className="upload-progress">
                  <Loader2 className="animate-spin" /> Uploading...
                </div>
              ) : "Submit Material"}
            </button>
          </form>
        )}
      </motion.div>

      <style>{`
        .upload-container {
          padding-top: 2rem;
          max-width: 800px;
          margin-inline: auto;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .icon { color: var(--primary); }

        .file-dropzone {
          border: 2px dashed var(--card-border);
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          cursor: pointer;
          margin-bottom: 2rem;
        }

        .file-dropzone:hover { border-color: var(--primary); }

        .dropzone-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          color: #64748b;
        }

        .form-sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .error-box {
          background: #fee2e2;
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .success-state {
          text-align: center;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .input-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Upload;
