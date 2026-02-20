import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import PMDashboard from './components/PMDashboard';
import AdminDashboard from './components/AdminDashboard';
import Layout from './components/Layout';
import Register from './components/Register';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('taskAppUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('taskAppUser');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('taskAppUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('taskAppUser');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-teal-600">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          {/* Role-based redirects */}
          <Route index element={
            user?.role === 'ADMIN' ? <Navigate to="/admin" /> :
              user?.role === 'PM' ? <Navigate to="/pm" /> :
                <Navigate to="/employee" />
          } />

          <Route path="employee" element={
            user?.role === 'EMPLOYEE' || user?.role === 'PM' || user?.role === 'ADMIN'
              ? <EmployeeDashboard user={user} />
              : <Navigate to="/" />
          } />

          <Route path="pm" element={
            user?.role === 'PM' || user?.role === 'ADMIN'
              ? <PMDashboard user={user} />
              : <Navigate to="/" />
          } />

          <Route path="admin" element={
            user?.role === 'ADMIN'
              ? <AdminDashboard user={user} />
              : <Navigate to="/" />
          } />
        </Route>
      </Routes>
    </Router>
  );
}
