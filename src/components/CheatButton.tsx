import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

const CheatButton: React.FC = () => {
  const { addPoints, addCredits } = useAppContext();
  const [showMenu, setShowMenu] = useState(false);

  const handleAddYuwonPoints = () => {
    addPoints(100000, 'Cheat: Added 100,000 Yuwon Points');
    setShowMenu(false);
  };

  const handleAddNoahCredits = () => {
    addCredits(10000, 'Cheat: Added 10,000 Noah Credits');
    setShowMenu(false);
  };

  const handleAddBoth = () => {
    addPoints(200000, 'Cheat: Added 200,000 Yuwon Points');
    addCredits(20000, 'Cheat: Added 20,000 Noah Credits');
    setShowMenu(false);
  };

  return (
    <div className="cheat-button-container">
      <button 
        className="cheat-button" 
        onClick={() => setShowMenu(!showMenu)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          backgroundColor: '#ff69b4',
          color: 'white',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px',
          border: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          zIndex: 1000,
          cursor: 'pointer'
        }}
      >
        💰
      </button>
      
      {showMenu && (
        <div className="cheat-menu"
          style={{
            position: 'fixed',
            bottom: '140px',
            right: '20px',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <button 
            onClick={handleAddYuwonPoints}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            +100,000 Yuwon Points
          </button>
          <button 
            onClick={handleAddNoahCredits}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            +10,000 Noah Credits
          </button>
          <button 
            onClick={handleAddBoth}
            style={{
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            +200,000 Both
          </button>
        </div>
      )}
    </div>
  );
};

export default CheatButton; 