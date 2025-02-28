import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FileList from '../components/documents/FileList';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const DocumentsPage = () => {
  const { user, loading } = useContext(AuthContext);

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
            <div className="page-title">
              <h1>My Documents</h1>
              <p>Manage your uploaded documents</p>
            </div>
            <div className="page-actions">
              <Link to="/upload" className="btn btn-primary">
                Upload New Document
              </Link>
            </div>
          </div>
          
          <FileList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentsPage;