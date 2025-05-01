import React from "react";
import { Link } from "react-router-dom";
import "../Home.css"; // Assuming you have a CSS file for styling

const Home = () => {
  return (
    <div className="home-page">
      <header className="hero">
        <div className="hero-content">
          <h1>Family Vine</h1>
          <p>
            Weave your family's story through photos, videos, and relationships
          </p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">
              Get Started
            </Link>
            <a href="#features" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </header>

      <section id="features" className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>File Upload</h3>
            <p>Easy drag-and-drop interface for uploading your media</p>
          </div>
          <div className="feature-card">
            <h3>Metadata Tagging</h3>
            <p>
              Tag files with the 5W information (Who, What, Where, Why, When)
            </p>
          </div>
          <div className="feature-card">
            <h3>Relationship Management</h3>
            <p>Define relationships between people in your family</p>
          </div>
          <div className="feature-card">
            <h3>Visualization</h3>
            <p>Interactive graph showing relationships and timeline view</p>
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 Family Vine</p>
      </footer>
    </div>
  );
};

export default Home;
