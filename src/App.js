import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login    from './components/Login';
import Home     from './components/Home';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ token ? <Home/> : <Navigate to="/login" /> } />
        <Route path="/register" element={<Register/>} />
        <Route path="/login"    element={<Login/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
