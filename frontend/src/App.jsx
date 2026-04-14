import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

function App() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center'}}>Loading...</div>;

  if (!user && location.pathname !== '/auth') {
    return <Navigate to="/auth" />;
  }
  if (user && location.pathname === '/auth') {
    return <Navigate to="/" />;
  }

  return (
    <div className="app">
      {user && <Sidebar />}
      <div className="main">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
