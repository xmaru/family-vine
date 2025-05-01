import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AddPersonModal from "../components/modals/AddPersonModal"; // Import the modal component
import PeopleList from "../components/people/PeopleList"; // Import the PeopleList component

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If loading, show loading indicator
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1>Dashboard</h1>
            <p>Welcome to your Family Vine dashboard</p>
            <button className="btn btn-primary" onClick={handleOpenModal}>
              Add someone to your Family Tree
            </button>
          </div>

          <div className="dashboard-content">
            {/* People List */}
            <PeopleList />
          </div>
        </div>
      </main>
      <Footer />

      {/* Add Person Modal */}
      {isModalOpen && <AddPersonModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Dashboard;
