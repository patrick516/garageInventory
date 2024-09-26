import React from 'react';
import '../../assets/styles/Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = ({ onSearch }) => {
  return (
    <header className="header">
      <h1></h1>
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </header>
  );
};

export default Header;

