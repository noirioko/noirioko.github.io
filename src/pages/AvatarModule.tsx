import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Headgear } from '../types';
import LargeAvatarDisplay from '../components/LargeAvatarDisplay';

const AvatarModule: React.FC = () => {
  const { ownedHeadgear, activeHeadgear, equipHeadgear } = useAppContext();

  // Handle equipping headgear
  const handleEquip = (headgearId: string) => {
    equipHeadgear(headgearId === activeHeadgear ? null : headgearId);
  };

  // Get rarity class for styling
  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'rarity-common';
      case 'rare': return 'rarity-rare';
      case 'epic': return 'rarity-epic';
      case 'legendary': return 'rarity-legendary';
      default: return '';
    }
  };

  return (
    <div className="avatar-module">
      <header className="module-header">
        <h2>Vanity Page</h2>
      </header>
      
      {/* Large Avatar Display */}
      <LargeAvatarDisplay />
      
      <div className="headgear-inventory">
        <h2>Your Headgear Collection</h2>
        <div className="headgear-grid">
          {ownedHeadgear.length === 0 ? (
            <p className="empty-collection">
              You don't own any headgear yet. Visit the <Link to="/rewards">Rewards section</Link> to browse the Cat Ears Shop!
            </p>
          ) : (
            ownedHeadgear.map((headgear: Headgear) => (
              <div key={headgear.id} className={`headgear-item card ${getRarityClass(headgear.rarity)}`}>
                <div className="headgear-image-container">
                  <img src={headgear.imageUrl} alt={headgear.name} className="headgear-image" />
                  <div className="headgear-rarity">{headgear.rarity}</div>
                </div>
                <h4 className="headgear-name">{headgear.name}</h4>
                <p className="headgear-description">{headgear.description}</p>
                <button 
                  className={`headgear-equip-button ${activeHeadgear === headgear.id ? 'equipped' : ''}`}
                  onClick={() => handleEquip(headgear.id)}
                >
                  {activeHeadgear === headgear.id ? 'Equipped' : 'Equip'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarModule; 