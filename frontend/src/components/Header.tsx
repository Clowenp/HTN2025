import React, { useState } from 'react';
import './Header.css';
import Checkbox from './Checkbox';
import Toggle from './Toggle';

interface HeaderProps {
  onSearch: (query: string, deepSearch: boolean) => void;
  searchQuery: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery }) => {
  const [deepSearch, setDeepSearch] = useState(false);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value, deepSearch);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by onChange for real-time search
  };
  
  const onToggle = () => {
    setDeepSearch((prev: boolean) => !prev);
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <a href="/" className="logo-link">
            <img className="logo" src="/assets/images/logo.png" alt="PhotoMind" />
          </a>
        </div>
        
        <div className="search-section">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-container">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder={`Search photos ${deepSearch ? 'using natural language' : 'by tags'}...`}
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <Toggle onToggle={onToggle} />
              <p style={{ width: "200px", marginLeft: "1rem" }}>Use deep search</p>
            </div>
          </form>
        </div>

        <div className="user-section">
          <button className="user-menu-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
