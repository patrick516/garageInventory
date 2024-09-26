// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/HomePage.css';
import logo from '../assets/images/uasLogo.jpg'; 

function HomePage() {
  return (
    <div className="home-page">
    <img src={require('../assets/images/uasLogo.jpg')} alt="Logo" className="logo" />
      <h4>GARAGE INVENTORY DATA MANAGEMENT SYSTEM</h4>
      
      <div className="link-container">
        <Link to="/login" className="link">Admin</Link>
        <Link to="/customer" className="link">Customer</Link>
      </div>
    </div>
  );
}

export default HomePage;
