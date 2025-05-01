import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EntriesPage from './pages/EntriesPage';
import './App.css';

  
function RequireAuth({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/" />;
}
function App() {
  return <Dashboard />;
}
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard/*"
          element={
            <RequireAuth>
              <div className="dashboard-container">
                <Sidebar />
                <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="" element={<Dashboard />} />
                      <Route path="entries" element={<EntriesPage />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}
