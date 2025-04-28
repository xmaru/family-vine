import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Dashboard = () => {
  const { user, loading } = useAuth();

  // If loading, show loading indicator
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // // If user is not logged in, redirect to login page
  // if (!user) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1>Dashboard</h1>
            <p>Welcome to your Family Vine dashboard</p>
          </div>

          <div className="dashboard-content">
            <p>Dashboard content will go here</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
