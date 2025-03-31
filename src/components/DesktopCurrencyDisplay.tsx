import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import yuwonPointsIcon from '../assets/images/icons/yuwonpoints.png';
import creditCardIcon from '../assets/images/icons/rewards-noahcc.png';
// CSS is now imported via index.css

const DesktopCurrencyDisplay: React.FC = () => {
  const { points, credits } = useAppContext();

  return (
    <div className="desktop-currency-display">
      <div className="currency-item">
        <img src={yuwonPointsIcon} alt="Points" className="currency-icon" />
        <span className="currency-value">{points.toLocaleString()}</span>
      </div>
      <div className="currency-item">
        <img src={creditCardIcon} alt="Credits" className="currency-icon" />
        <span className="currency-value">{credits.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default DesktopCurrencyDisplay; 