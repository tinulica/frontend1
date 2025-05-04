// index.jsx
// Register global error handlers before anything else
window.addEventListener('error', event => {
  console.error('[Global Error]', {
    message: event.message,
    source: `${event.filename}:${event.lineno}:${event.colno}`,
    error: event.error
  });
  // Prevent the error from logging twice (optional)
  // event.preventDefault();
});

window.addEventListener('unhandledrejection', event => {
  console.error('[Unhandled Promise Rejection]', event.reason);
  // Prevent default handling (optional)
  // event.preventDefault();
});

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './global.css';

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
