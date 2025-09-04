import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import pages with explicit checks 
import Home from './pages/Home'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DocumentsPage from './pages/DocumentsPage';
import UploadPage from './pages/UploadPage';
import VisualizationPage from './pages/VisualizationPage';
import SettingsPage from './pages/SettingsPage';

// Check that page components are actually functions or classes
console.log('Home is a:', typeof Home);
console.log('Login is a:', typeof Login);
console.log('Register is a:', typeof Register);
console.log('Dashboard is a:', typeof Dashboard);
console.log('DocumentsPage is a:', typeof DocumentsPage);
console.log('UploadPage is a:', typeof UploadPage);
console.log('VisualizationPage is a:', typeof VisualizationPage);
console.log('SettingsPage is a:', typeof SettingsPage);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/visualization" element={<VisualizationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;