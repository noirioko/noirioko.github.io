import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import avatarYuwon from '../assets/images/avatar-yuwon.png';
import yuwonPointsIcon from '../assets/images/icons/yuwonpoints.png';
import creditCardIcon from '../assets/images/icons/rewards-noahcc.png';
// No need to import CSS as it's in profile.css

const LargeAvatarDisplay: React.FC = () => {
  const { activeHeadgear, ownedHeadgear, points, credits } = useAppContext();
  
  // Helper function to get the headgear image path
  const getHeadgearImage = (): string | undefined => {
    if (!activeHeadgear) return undefined;
    
    const headgear = ownedHeadgear.find(h => h.id === activeHeadgear);
    return headgear?.imageUrl;
  };

  const headgearImage = getHeadgearImage();

  return (
    <div className="large-avatar-display">
      <div className="large-avatar-container">
        <img src={avatarYuwon} alt="Your avatar" className="large-avatar-image" />
        {activeHeadgear && headgearImage && (
          <img src={headgearImage} alt="Headgear" className="large-avatar-headgear" />
        )}
      </div>
      <div className="large-avatar-name">Yuwon</div>
      <div className="large-avatar-title">Diary Keeper</div>
      
      {/* Currency Display */}
      <div className="avatar-currency-display">
        <div className="avatar-currency-item">
          <img src={yuwonPointsIcon} alt="Points" className="avatar-currency-icon" />
          <span className="avatar-currency-value">{points.toLocaleString()}</span>
        </div>
        <div className="avatar-currency-item">
          <img src={creditCardIcon} alt="Credits" className="avatar-currency-icon" />
          <span className="avatar-currency-value">{credits.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default LargeAvatarDisplay; 