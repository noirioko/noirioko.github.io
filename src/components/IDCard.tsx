import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import avatarYuwon from '../assets/images/avatar-yuwon.png';
import yuwonPointsIcon from '../assets/images/icons/yuwonpoints.png';
import creditCardIcon from '../assets/images/icons/rewards-noahcc.png';
import '../styles/new-profile-bar.css';

const IDCard: React.FC = () => {
  const { points, credits, activeHeadgear, ownedHeadgear } = useAppContext();
  
  // Helper function to get the headgear image path
  const getHeadgearImage = (): string | undefined => {
    if (!activeHeadgear) return undefined;
    
    const headgear = ownedHeadgear.find(h => h.id === activeHeadgear);
    return headgear?.imageUrl;
  };

  // Format currency to limit large values
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return '999,999+';
    }
    return value.toLocaleString();
  };

  const headgearImage = getHeadgearImage();

  return (
    <div className="id-card-wrapper">
      <div className="id-card">
        <div className="id-card-inner">
          <div className="id-avatar-section">
            <Link to="/avatar" className="id-avatar-link">
              <div className="id-avatar-container">
                <img 
                  src={avatarYuwon} 
                  alt="Your avatar" 
                  className="id-avatar-image" 
                />
                {activeHeadgear && headgearImage && (
                  <img 
                    src={headgearImage} 
                    alt="Headgear" 
                    className="id-avatar-headgear" 
                  />
                )}
              </div>
              <div className="id-avatar-name">Yuwon</div>
              <div className="id-avatar-title">Diary Keeper</div>
            </Link>
          </div>

          <div className="id-currency-section">
            <div className="id-currency-group">
              <div className="id-currency-label">YuwonPoints</div>
              <div className="id-currency-item id-yuyu-points">
                <img 
                  src={yuwonPointsIcon} 
                  alt="YuwonPoints" 
                  className="id-currency-icon" 
                />
                <div className="id-currency-value">{formatCurrency(points)}</div>
                <div className="id-currency-suffix">YP</div>
              </div>
            </div>
            
            <div className="id-currency-group">
              <div className="id-currency-label">Noah's Credit Card</div>
              <div className="id-currency-item id-noah-credits">
                <img 
                  src={creditCardIcon} 
                  alt="Noah's CC" 
                  className="id-currency-icon" 
                />
                <div className="id-currency-value">{formatCurrency(credits)}</div>
                <div className="id-currency-suffix">NC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCard; 