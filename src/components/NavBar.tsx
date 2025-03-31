import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 480);
  
  // Helper function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 480;
      setIsMobileView(mobile);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // The always visible items
  const renderHomeLink = () => (
    <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
      <span className="nav-icon">🏠</span>
      <span className="nav-label">Home</span>
    </Link>
  );
  
  const renderDiaryLink = () => (
    <Link to="/diary" className={`nav-item ${isActive('/diary') ? 'active' : ''}`}>
      <span className="nav-icon">📝</span>
      <span className="nav-label">Diary</span>
    </Link>
  );
  
  const renderRewardsLink = () => (
    <Link to="/rewards" className={`nav-item ${isActive('/rewards') ? 'active' : ''}`}>
      <span className="nav-icon">🎁</span>
      <span className="nav-label">Rewards</span>
    </Link>
  );
  
  const renderCleaningLink = () => (
    <Link to="/cleaning" className={`nav-item ${isActive('/cleaning') ? 'active' : ''}`}>
      <span className="nav-icon">🧹</span>
      <span className="nav-label">Cleaning</span>
    </Link>
  );
  
  const renderSkincareLink = () => (
    <Link to="/skincare" className={`nav-item ${isActive('/skincare') ? 'active' : ''}`}>
      <span className="nav-icon">✨</span>
      <span className="nav-label">Skincare</span>
    </Link>
  );
  
  // Only shown on Desktop
  const renderBlogLink = () => {
    if (isMobileView) return null;
    
    return (
      <Link to="/blog" className={`nav-item ${isActive('/blog') ? 'active' : ''}`}>
        <span className="nav-icon">📰</span>
        <span className="nav-label">Blog</span>
      </Link>
    );
  };
  
  // Only shown on Desktop
  const renderFinanceLink = () => {
    if (isMobileView) return null;
    
    return (
      <Link to="/finance" className={`nav-item ${isActive('/finance') ? 'active' : ''}`}>
        <span className="nav-icon">💰</span>
        <span className="nav-label">Finance</span>
      </Link>
    );
  };

  return (
    <nav className="bottom-nav">
      {renderHomeLink()}
      {renderDiaryLink()}
      {renderRewardsLink()}
      {renderCleaningLink()}
      {renderSkincareLink()}
      {renderBlogLink()}
      {renderFinanceLink()}
    </nav>
  );
};

export default NavBar; 