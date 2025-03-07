import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import FileUpload from "../components/documents/FileUpload";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const UploadPage = () => {
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
            <h1>Upload Document</h1>
            <p>Add a new document to your collection</p>
          </div>
          <FileUpload />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadPage;
