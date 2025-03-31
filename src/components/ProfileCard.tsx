import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import avatarYuwon from '../assets/images/avatar-yuwon.png';
import '../styles/profile.css';

const ProfileCard: React.FC = () => {
  const { points, credits, activeHeadgear, ownedHeadgear } = useAppContext();
  
  // Helper function to get the headgear image path
  const getHeadgearImage = (): string | undefined => {
    if (!activeHeadgear) return undefined;
    
    const headgear = ownedHeadgear.find(h => h.id === activeHeadgear);
    return headgear?.imageUrl;
  };

  const headgearImage = getHeadgearImage();

  return (
    <div className="profile-card">
      <div className="avatar-container">
        <img src={avatarYuwon} alt="Your avatar" className="avatar-image" />
        {activeHeadgear && headgearImage && (
          <img src={headgearImage} alt="Headgear" className="avatar-headgear" />
        )}
      </div>
      <h3 className="character-name">Yuwon</h3>
      
      <div className="currency-container">
        <div className="currency yuyu-points">
          <div className="currency-label">YuyuPoints</div>
          <div className="currency-bar">
            <div className="currency-value">{points.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="currency noah-credits">
          <div className="currency-label">Noah's CC</div>
          <div className="currency-bar">
            <div className="currency-value">{credits.toLocaleString()}</div>
          </div>
        </div>
      </div>
      
      <div className="avatar-actions">
        <Link to="/rewards" className="avatar-action-link">Customize Avatar</Link>
      </div>
    </div>
  );
};

export default ProfileCard; 