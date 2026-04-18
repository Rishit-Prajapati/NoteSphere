import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import MaterialCard from '../components/MaterialCard';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, [category]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/materials', {
        params: { category, search: searchQuery }
      });
      setMaterials(res.data.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMaterials();
  };

  return (
    <div className="materials-container container">
      <header className="materials-header">
        <h1>Explore <span>Resources</span></h1>
        <p>Browse thousands of study materials shared by peers.</p>
      </header>

      {/* Search and Quick Filters */}
      <section className="search-section">
        <form onSubmit={handleSearch} className="search-box glass">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by title, subject, or author..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" className={`filter-toggle ${filtersOpen ? 'active' : ''}`} onClick={() => setFiltersOpen(!filtersOpen)}>
            <SlidersHorizontal size={20} />
          </button>
        </form>

        <div className="quick-categories">
          {["All", "Notes", "PYQ Papers", "Solutions", "Assignments"].map(cat => (
            <button 
              key={cat} 
              className={`cat-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Advanced Filters */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="advanced-filters glass"
          >
            <div className="filter-grid">
              <div className="filter-group">
                <label>Sort By</label>
                <select>
                  <option>Newest First</option>
                  <option>Most Popular</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Grid */}
      <section className="results-section">
        {loading ? (
          <div className="loading-state">
            <Loader2 className="animate-spin" size={40} />
            <p>Fetching resources...</p>
          </div>
        ) : materials.length === 0 ? (
          <div className="empty-state">
            <h2>No materials found</h2>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="materials-grid">
            {materials.map((material, index) => (
              <MaterialCard key={material._id} material={material} index={index} />
            ))}
          </div>
        )}
      </section>

      <style>{`
        .materials-container {
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .materials-header h1 { font-size: 2.5rem; }
        .materials-header h1 span { color: var(--primary); }
        .materials-header p { color: #64748b; margin-top: 0.5rem; }

        .search-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 16px;
        }

        .search-box input {
          border: none;
          background: transparent;
          font-size: 1.1rem;
          flex: 1;
        }

        .search-box input:focus { outline: none; }

        .filter-toggle {
          padding: 0.75rem;
          border-radius: 12px;
          color: #64748b;
        }

        .filter-toggle.active {
          background: var(--primary);
          color: white;
        }

        .quick-categories {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .cat-btn {
          padding: 0.6rem 1.25rem;
          border-radius: 20px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          font-size: 0.9rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .cat-btn.active {
          background: var(--primary);
          color: white;
        }

        .advanced-filters {
          padding: 2rem;
          border-radius: 16px;
          overflow: hidden;
        }

        .loading-state {
          text-align: center;
          padding: 5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #64748b;
        }

        .materials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

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

export default Materials;
