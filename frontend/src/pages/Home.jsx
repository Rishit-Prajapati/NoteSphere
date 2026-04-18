import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, FileText, CheckCircle, Share2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { title: 'Notes', icon: <FileText size={24} />, count: '1.2k+', color: '#4f46e5' },
    { title: 'PYQ Papers', icon: <BookOpen size={24} />, count: '850+', color: '#0ea5e9' },
    { title: 'Solutions', icon: <CheckCircle size={24} />, count: '500+', color: '#10b981' },
    { title: 'Assignments', icon: <Share2 size={24} />, count: '300+', color: '#f59e0b' },
  ];

  return (
    <div className="home-container container">
      {/* Hero Section */}
      <section className="hero glass">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-content"
        >
          <h1>Note<span>Sphere</span></h1>
          <p>Your ultimate academic resource hub. Share notes, find PYQs, and excel together.</p>
          
          <div className="search-bar-container glass">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by subject, exam, or year..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link to={`/materials?search=${searchQuery}`} className="btn btn-primary">Search</Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="categories-grid">
        {categories.map((cat, index) => (
          <motion.div 
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="category-card card"
          >
            <div className="category-icon" style={{ color: cat.color }}>
              {cat.icon}
            </div>
            <h3>{cat.title}</h3>
            <p>{cat.count} Resources</p>
            <Link to={`/materials?category=${cat.title}`} className="btn btn-secondary">
              Browse
            </Link>
          </motion.div>
        ))}
      </section>

      <style>{`
        .home-container {
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        .hero {
          padding: 4rem 2rem;
          border-radius: 24px;
          text-align: center;
        }

        .hero h1 {
          font-size: clamp(2.5rem, 8vw, 4rem);
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .hero h1 span {
          color: var(--primary);
        }

        .hero p {
          font-size: 1.25rem;
          color: #64748b;
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-inline: auto;
        }

        .search-bar-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          max-width: 700px;
          margin: 0 auto;
          padding: 0.5rem;
          border-radius: 16px;
        }

        .search-icon {
          margin-left: 1rem;
          color: var(--primary);
        }

        .search-bar-container input {
          border: none;
          background: transparent;
          font-size: 1.1rem;
          flex: 1;
        }

        .search-bar-container input:focus {
          border: none;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .category-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .category-icon {
          padding: 1rem;
          background: var(--primary-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default Home;
