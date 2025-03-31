import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Headgear } from '../types';
import '../styles/headgear-shop.css';

// Import headgear images
import hgWhiteCatEars from '../assets/images/headgear/hg_whitecatears.png';
import hgBlack from '../assets/images/headgear/hg_black.png';
import hgCalico from '../assets/images/headgear/hg_calico.png';
import hgChesire from '../assets/images/headgear/hg_chesire.png';
import hgStripe from '../assets/images/headgear/hg_stripe.png';
import hgStripeOrange from '../assets/images/headgear/hg_stripeorange.png';
import hgStripeGray from '../assets/images/headgear/hg_stripegray.png';
import hgWhiteBlue from '../assets/images/headgear/hg_whiteblue.png';
import hgMaid from '../assets/images/headgear/hg_maid.png';
import yuwonPointsIcon from '../assets/images/icons/yuwonpoints.png';
import creditCardIcon from '../assets/images/icons/rewards-noahcc.png';

// Sample headgear data - this would come from a database or API in a real app
const sampleHeadgear: Headgear[] = [
  {
    id: 'white-cat-ears',
    name: 'White Cat Ears',
    imageUrl: hgWhiteCatEars,
    cost: 50,
    currency: 'points',
    rarity: 'common',
    description: 'Cute white cat ears to show your playful side!'
  },
  {
    id: 'black-cat-ears',
    name: 'Black Cat Ears',
    imageUrl: hgBlack,
    cost: 100,
    currency: 'points',
    rarity: 'rare',
    description: 'Sleek black cat ears for a mysterious look'
  },
  {
    id: 'calico-cat-ears',
    name: 'Calico Cat Ears',
    imageUrl: hgCalico,
    cost: 150,
    currency: 'points',
    rarity: 'epic',
    description: 'Multicolored calico cat ears - so cute!'
  },
  {
    id: 'cheshire-cat-ears',
    name: 'Cheshire Cat Ears',
    imageUrl: hgChesire,
    cost: 200,
    currency: 'credits',
    rarity: 'legendary',
    description: 'Magical Cheshire cat ears that bring mischief!'
  },
  {
    id: 'striped-cat-ears',
    name: 'Striped Cat Ears',
    imageUrl: hgStripe,
    cost: 75,
    currency: 'points',
    rarity: 'rare',
    description: 'Stylish striped cat ears!'
  },
  {
    id: 'orange-striped-ears',
    name: 'Orange Striped Ears',
    imageUrl: hgStripeOrange,
    cost: 100,
    currency: 'credits',
    rarity: 'epic',
    description: 'Orange striped cat ears - just like a tiger!'
  },
  {
    id: 'gray-striped-ears',
    name: 'Gray Striped Ears',
    imageUrl: hgStripeGray,
    cost: 75,
    currency: 'credits',
    rarity: 'rare',
    description: 'Gray striped cat ears - subtle and cute!'
  },
  {
    id: 'blue-white-ears',
    name: 'Blue & White Ears',
    imageUrl: hgWhiteBlue,
    cost: 150,
    currency: 'credits',
    rarity: 'legendary',
    description: 'Premium blue and white cat ears that sparkle in the light!'
  },
  {
    id: 'maid-headgear',
    name: 'Maid Headband',
    imageUrl: hgMaid,
    cost: 200,
    currency: 'points',
    rarity: 'legendary',
    description: 'Elegant maid headband for your serving aesthetic!'
  }
];

// Helper to sort headgear by rarity
const sortHeadgearByRarity = (headgear: Headgear[]): Headgear[] => {
  const rarityOrder: { [key: string]: number } = {
    legendary: 1,
    epic: 2,
    rare: 3,
    common: 4
  };
  
  return [...headgear].sort((a, b) => {
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });
};

const HeadgearShop: React.FC = () => {
  const { points, credits, addHeadgear, hasHeadgear, equipHeadgear, activeHeadgear, ownedHeadgear, spendPoints, spendCredits } = useAppContext();
  const [viewMode, setViewMode] = useState<'shop' | 'inventory'>('shop');
  const [availableHeadgear, setAvailableHeadgear] = useState<Headgear[]>([]);

  // Load headgear data
  useEffect(() => {
    // In a real app, this would fetch from an API or database
    // For demo, we're using the sample data
    setAvailableHeadgear(sortHeadgearByRarity(sampleHeadgear));
  }, []);

  // Handle headgear purchase
  const handlePurchase = (headgear: Headgear) => {
    if (hasHeadgear(headgear.id)) {
      alert('You already own this headgear!');
      return;
    }

    let success = false;
    if (headgear.currency === 'points') {
      success = spendPoints(headgear.cost, `Purchased ${headgear.name}`);
    } else {
      success = spendCredits(headgear.cost, `Purchased ${headgear.name}`);
    }

    if (success) {
      addHeadgear(headgear);
      alert(`Successfully purchased ${headgear.name}!`);
    } else {
      alert(`Not enough ${headgear.currency} to purchase ${headgear.name}`);
    }
  };

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

  // Get sorted headgear for inventory view
  const sortedOwnedHeadgear = sortHeadgearByRarity(ownedHeadgear);

  return (
    <div className="headgear-shop">
      <div className="shop-header">
        <h3>Cat Ears Shop</h3>
        <div className="shop-tabs">
          <button 
            className={`shop-tab ${viewMode === 'shop' ? 'active' : ''}`}
            onClick={() => setViewMode('shop')}
          >
            Shop
          </button>
          <button 
            className={`shop-tab ${viewMode === 'inventory' ? 'active' : ''}`}
            onClick={() => setViewMode('inventory')}
          >
            My Collection
          </button>
        </div>
      </div>

      <div className="shop-currency-status">
        <div className="currency-display">
          <img src={yuwonPointsIcon} alt="YuwonPoints" className="currency-icon" />
          <span className="currency-value">{points.toLocaleString()}</span>
        </div>
        <div className="currency-display">
          <img src={creditCardIcon} alt="Noah's CC" className="currency-icon" />
          <span className="currency-value">{credits.toLocaleString()}</span>
        </div>
      </div>

      {viewMode === 'shop' ? (
        <div className="headgear-grid">
          {availableHeadgear.map(headgear => (
            <div key={headgear.id} className={`headgear-item card ${getRarityClass(headgear.rarity)}`}>
              <div className="headgear-image-container">
                <img src={headgear.imageUrl} alt={headgear.name} className="headgear-image" />
                <div className="headgear-rarity">{headgear.rarity}</div>
              </div>
              <h4 className="headgear-name">{headgear.name}</h4>
              <p className="headgear-description">{headgear.description}</p>
              <div className="headgear-cost">
                <img 
                  src={headgear.currency === 'points' ? yuwonPointsIcon : creditCardIcon} 
                  alt={headgear.currency === 'points' ? 'YuwonPoints' : "Noah's CC"} 
                  className="currency-icon" 
                />
                {headgear.cost.toLocaleString()}
              </div>
              {hasHeadgear(headgear.id) ? (
                <button 
                  className="headgear-owned-button"
                  disabled
                >
                  Owned
                </button>
              ) : (
                <button 
                  className="headgear-buy-button"
                  onClick={() => handlePurchase(headgear)}
                  disabled={(headgear.currency === 'points' && points < headgear.cost) || 
                           (headgear.currency === 'credits' && credits < headgear.cost)}
                >
                  Buy Now
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="headgear-inventory">
          <h4>Your Headgear Collection</h4>
          <div className="headgear-grid">
            {sortedOwnedHeadgear.length === 0 ? (
              <p className="empty-collection">You don't own any headgear yet. Buy some from the shop!</p>
            ) : (
              sortedOwnedHeadgear.map((headgear: Headgear) => (
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
      )}
    </div>
  );
};

export default HeadgearShop; 