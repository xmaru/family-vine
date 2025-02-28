import React from 'react';
import '../../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container footer-container">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Family Vine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;