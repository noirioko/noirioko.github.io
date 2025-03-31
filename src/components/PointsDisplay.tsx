import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const PointsDisplay: React.FC = () => {
  const { points } = useAppContext();

  return (
    <div className="points-display">
      <span className="points-value">{points}</span>
      <span className="points-label">points</span>
    </div>
  );
};

export default PointsDisplay; 