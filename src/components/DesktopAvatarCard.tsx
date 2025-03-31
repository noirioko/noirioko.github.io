import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import avatarYuwon from '../assets/images/avatar-yuwon.png';
import yuwonPointsIcon from '../assets/images/icons/yuwonpoints.png';
import creditCardIcon from '../assets/images/icons/rewards-noahcc.png';
// CSS is now imported via index.css

const DesktopAvatarCard: React.FC = () => {
  const { points, credits, activeHeadgear, ownedHeadgear } = useAppContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Helper function to get the headgear image path
  const getHeadgearImage = (): string | undefined => {
    if (!activeHeadgear) return undefined;
    
    const headgear = ownedHeadgear.find(h => h.id === activeHeadgear);
    return headgear?.imageUrl;
  };

  const headgearImage = getHeadgearImage();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`desktop-avatar-card ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="desktop-avatar-collapse-btn" 
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? '→' : '←'}
      </button>
      
      <Link to="/avatar" className="avatar-bar-link">
        <div className="desktop-avatar-container">
          <img src={avatarYuwon} alt="Your avatar" className="desktop-avatar-image" />
          {activeHeadgear && headgearImage && (
            <img src={headgearImage} alt="Headgear" className="desktop-avatar-headgear" />
          )}
        </div>
        <div className="desktop-avatar-name">Yuwon</div>
        <div className="desktop-avatar-title">Diary Keeper</div>
      </Link>
      
      <div className="desktop-sidebar-section">
        <div className="desktop-sidebar-label">YuwonPoints</div>
        <div className="desktop-sidebar-currency">
          <div className="desktop-currency-item points">
            <img src={yuwonPointsIcon} alt="YuwonPoints" className="desktop-currency-icon" />
            <div className="desktop-currency-value">{points.toLocaleString()}</div>
            <div className="desktop-currency-suffix">YP</div>
          </div>
        </div>
      </div>

      <div className="desktop-sidebar-section">
        <div className="desktop-sidebar-label">Noah's credit card</div>
        <div className="desktop-sidebar-currency">
          <div className="desktop-currency-item credits">
            <img src={creditCardIcon} alt="Noah's CC" className="desktop-currency-icon" />
            <div className="desktop-currency-value">{credits.toLocaleString()}</div>
            <div className="desktop-currency-suffix">NC</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopAvatarCard; 