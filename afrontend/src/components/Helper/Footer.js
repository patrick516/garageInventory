import React from 'react';
import '../../assets/styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      &copy; Uas Motors GIDMS {currentYear}
    </footer>
  );
};

export default Footer;
