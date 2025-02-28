import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const SettingsPage = () => {
  const { user, loading } = useAuth();

  // If loading, show loading indicator
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1>Settings</h1>
            <p>Manage your account settings</p>
          </div>
          
          <div className="settings-content">
            <p>Settings features coming soon...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;