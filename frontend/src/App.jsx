import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Materials from './pages/Materials';
import MaterialDetail from './pages/MaterialDetail';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
        <p>Loading NoteSphere...</p>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/materials/:id" element={<MaterialDetail />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
