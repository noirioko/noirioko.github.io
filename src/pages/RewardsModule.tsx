import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Reward, RedeemEvent } from '../types';
import HeadgearShop from '../components/HeadgearShop';
import RedemptionModal from '../components/RedemptionModal';
import '../styles/rewards.css';

// Import icons for rewards
import bobaTeaIcon from '../assets/images/icons/rewards-boba.png';
import gelatoIcon from '../assets/images/icons/rewards-gelato.png';
import creditCardIcon from '../assets/images/icons/rewards-noahcc.png';
import customRewardIcon from '../assets/images/icons/rewards-custom.png';
import yuwonPointsIcon from '../assets/images/icons/yuwonpoints.png';
import catEarsShopIcon from '../assets/images/catears-shop.png';
import rewardsShopIcon from '../assets/images/rewards-shop.png';
import sleepIcon from '../assets/images/icons/rewards-sleep.png';

// Preset reward templates
const presetRewards: Reward[] = [
  {
    id: 'preset-boba-tea',
    title: 'Boba Tea',
    description: 'Treat yourself to a delicious boba tea!',
    cost: 500,
    createdAt: new Date().toISOString(),
    claimed: false,
    currency: 'points',
    type: 'activity',
    redeemHistory: [],
    iconUrl: bobaTeaIcon
  },
  {
    id: 'preset-gelato',
    title: 'Gelato',
    description: 'Enjoy a refreshing gelato of your favorite flavor!',
    cost: 600,
    createdAt: new Date().toISOString(),
    claimed: false,
    currency: 'points',
    type: 'activity',
    redeemHistory: [],
    iconUrl: gelatoIcon
  },
  {
    id: 'preset-sleep',
    title: 'Sleep',
    description: 'Take a well-deserved nap or a good night\'s sleep!',
    cost: 500,
    createdAt: new Date().toISOString(),
    claimed: false,
    currency: 'points',
    type: 'activity',
    redeemHistory: [],
    iconUrl: sleepIcon
  },
  {
    id: 'preset-noah-card',
    title: "Noah's Credit Card",
    description: 'What Yuwon wants, Yuwon gets! Exchange 100,000 YuyuPoints for 10,000 Noah Credits!',
    cost: 100000,
    createdAt: new Date().toISOString(),
    claimed: false,
    currency: 'points',
    type: 'currency_exchange', // Special type for this reward
    redeemHistory: [],
    iconUrl: creditCardIcon,
    effect: { // Define the effect of redeeming this reward
      type: 'grant_currency',
      currency: 'credits',
      amount: 10000
    }
  }
];

const RewardsModule: React.FC = () => {
  const { points, credits, rewards, redeemReward, addReward } = useAppContext();
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardDescription, setNewRewardDescription] = useState('');
  const [newRewardPoints, setNewRewardPoints] = useState('');
  const [newRewardCurrency, setNewRewardCurrency] = useState<'points' | 'credits'>('points');
  const [newRewardIconUrl, setNewRewardIconUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHeadgearShop, setShowHeadgearShop] = useState(false);
  const [redeemedReward, setRedeemedReward] = useState<Reward | null>(null);
  const initialized = useRef(false);

  // Add preset rewards on first load if they don't exist
  useEffect(() => {
    if (initialized.current) return;

    if (localStorage.getItem('hasInitializedRewards') === 'true' && rewards.length === 0) {
      console.log("No rewards found but initialization flag is set. Clearing flag...");
      localStorage.removeItem('hasInitializedRewards');
    }

    if (localStorage.getItem('hasInitializedRewards') === 'true') {
      initialized.current = true;
      return;
    }

    const existingRewardIds = new Set(rewards.map(r => r.id));

    let addedAnyReward = false;
    presetRewards.forEach(presetReward => {
      if (!existingRewardIds.has(presetReward.id)) {
        addReward(presetReward);
        addedAnyReward = true;
      }
    });

    if (addedAnyReward || existingRewardIds.size > 0) {
      localStorage.setItem('hasInitializedRewards', 'true');
    }
    initialized.current = true;
  }, []); // Run only on mount

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    const pointsValue = parseInt(newRewardPoints);
    if (newRewardName.trim() && !isNaN(pointsValue) && pointsValue > 0) {
      const newReward: Reward = {
        id: Date.now().toString(),
        title: newRewardName.trim(),
        description: newRewardDescription.trim() || `Custom reward: ${newRewardName.trim()}`,
        cost: pointsValue,
        createdAt: new Date().toISOString(),
        claimed: false,
        currency: newRewardCurrency,
        type: 'activity',
        redeemHistory: [],
        iconUrl: newRewardIconUrl || customRewardIcon
      };
      addReward(newReward);
      setNewRewardName('');
      setNewRewardDescription('');
      setNewRewardPoints('');
      setNewRewardIconUrl('');
    }
  };

  // Handle reward redemption with modal
  const handleRedeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward) {
      redeemReward(rewardId);
      setRedeemedReward(reward);
    }
  };

  // Format date function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Safe way to check redeemHistory length
  const getRedeemHistoryLength = (reward: Reward): number => {
    return reward.redeemHistory && Array.isArray(reward.redeemHistory) 
      ? reward.redeemHistory.length 
      : 0;
  };

  // Handle icon file upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setNewRewardIconUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFileUpload(file);
      }
    }
  }, []);

  // Handle click to upload
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        handleFileUpload(file);
      }
    }
  };

  // Add deduplication of rewards before rendering them
  const uniqueRewards = rewards.filter((reward, index, self) => self.findIndex(r => r.id === reward.id) === index);

  return (
    <div className="rewards-module">
      {redeemedReward && (
        <RedemptionModal 
          reward={redeemedReward} 
          onClose={() => setRedeemedReward(null)} 
        />
      )}

      <header className="module-header">
        <h2>Rewards</h2>
      </header>

      <div className="shop-icons-container">
        <div 
          className={`shop-icon-button ${!showHeadgearShop ? 'active' : ''}`}
          onClick={() => {
            setShowHeadgearShop(false);
            setShowHistory(false);
          }}
        >
          <div className="shop-icon-circle">
            <img src={rewardsShopIcon} alt="Rewards Shop" />
          </div>
          <div className="shop-icon-button-label">Rewards Shop</div>
        </div>
        
        <div 
          className={`shop-icon-button ${showHeadgearShop ? 'active' : ''}`}
          onClick={() => {
            setShowHeadgearShop(true);
            setShowHistory(false);
          }}
        >
          <div className="shop-icon-circle">
            <img src={catEarsShopIcon} alt="Cat Ears Shop" />
          </div>
          <div className="shop-icon-button-label">Cat Ears Shop</div>
        </div>
      </div>

      {showHeadgearShop ? (
        <div className="headgear-shop-container">
          <HeadgearShop />
        </div>
      ) : !showHistory ? (
        <div className="rewards-container">
          <div className="shop-header">
            <h3>Available Rewards</h3>
            <div className="shop-header-actions">
              <button 
                className={`toggle-history-button ${showHistory ? 'active' : ''}`}
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Available Rewards' : 'Redemption History'}
              </button>
              {rewards.length === 0 && (
                <button 
                  className="reset-rewards-button"
                  style={{ marginLeft: '8px' }}
                  onClick={() => {
                    localStorage.removeItem('hasInitializedRewards');
                    window.location.reload();
                  }}
                >
                  Restore Defaults
                </button>
              )}
            </div>
          </div>
          
          {rewards.length === 0 ? (
            <p>No rewards added yet. Add some below!</p>
          ) : (
            <div className="rewards-grid">
              {uniqueRewards.map(reward => {
                const redeemCount = getRedeemHistoryLength(reward);
                const canAfford = reward.currency === 'points' 
                  ? points >= reward.cost 
                  : credits >= reward.cost;
                  
                return (
                  <div key={reward.id} className="reward-card card">
                    {reward.iconUrl && (
                      <img src={reward.iconUrl} alt={reward.title} className="reward-icon" />
                    )}
                    <h4>{reward.title}</h4>
                    <div className="reward-description">{reward.description}</div>
                    <div className="reward-points">
                      <img 
                        src={reward.currency === 'points' ? yuwonPointsIcon : creditCardIcon} 
                        alt={reward.currency === 'points' ? 'YuWon' : "Noah's CC"} 
                        className="currency-icon" 
                      />
                      {reward.cost.toLocaleString()}
                    </div>
                    <div className="redemption-count">
                      {redeemCount > 0
                        ? `Redeemed ${redeemCount} ${redeemCount === 1 ? 'time' : 'times'}`
                        : 'Not yet redeemed'}
                    </div>
                    <button 
                      onClick={() => handleRedeemReward(reward.id)}
                      disabled={!canAfford}
                      className={!canAfford ? 'disabled' : ''}
                    >
                      Redeem
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bottom-padding" style={{ paddingBottom: '1rem' }}></div>
          
          <div className="add-reward-section">
            <h3>Add Custom Reward</h3>
            <form onSubmit={handleAddReward} className="add-reward-form card">
              <div className="form-field">
                <label htmlFor="reward-name">Reward Name</label>
                <input
                  id="reward-name"
                  type="text"
                  value={newRewardName}
                  onChange={(e) => setNewRewardName(e.target.value)}
                  placeholder="Enter reward name"
                  required
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="reward-description">Description</label>
                <textarea
                  id="reward-description"
                  value={newRewardDescription}
                  onChange={(e) => setNewRewardDescription(e.target.value)}
                  placeholder="Enter reward description"
                  required
                />
              </div>
              
              {/* Combined Cost and Currency Field - REMOVE OLD JSX */}
              {/* 
              <div className="form-field form-field-cost-currency">
                <label htmlFor="reward-cost">Cost & Currency</label>
                <div className="cost-currency-input-group">
                  <input
                    id="reward-cost"
                    type="number"
                    value={newRewardPoints}
                    onChange={(e) => setNewRewardPoints(e.target.value)}
                    min="1"
                    required
                  />
                  <div className="currency-selector">
                    <div 
                      className={`currency-option ${newRewardCurrency === 'points' ? 'active' : ''}`}
                      onClick={() => setNewRewardCurrency('points')}
                    >
                      <img src={yuwonPointsIcon} alt="YuWon Points" title="YuWon Points" />
                    </div>
                    <div 
                      className={`currency-option ${newRewardCurrency === 'credits' ? 'active' : ''}`}
                      onClick={() => setNewRewardCurrency('credits')}
                    >
                      <img src={creditCardIcon} alt="Noah Credits" title="Noah Credits" />
                    </div>
                  </div>
                </div>
              </div>
              */}
              
              {/* ++ NEW Clean Cost/Currency Input ++ */}
              <div className="form-field form-field-cost-currency-new">
                <label htmlFor="reward-cost-new">Cost & Currency</label>
                <div className="cost-currency-group-new"> {/* Flex container */}
                  <input
                    className="cost-input-new"
                    id="reward-cost-new"
                    type="number"
                    value={newRewardPoints}
                    onChange={(e) => setNewRewardPoints(e.target.value)}
                    placeholder="Cost"
                    min="1"
                    required
                  />
                  <div className="currency-options-new"> {/* Button container */}
                    <button 
                      type="button" /* Prevent form submission */
                      className={`currency-button-new ${newRewardCurrency === 'points' ? 'selected' : ''}`}
                      onClick={() => setNewRewardCurrency('points')}
                      title="YuWon Points"
                    >
                      <img src={yuwonPointsIcon} alt="Points" />
                    </button>
                    <button 
                      type="button" /* Prevent form submission */
                      className={`currency-button-new ${newRewardCurrency === 'credits' ? 'selected' : ''}`}
                      onClick={() => setNewRewardCurrency('credits')}
                      title="Noah Credits"
                    >
                      <img src={creditCardIcon} alt="Credits" />
                    </button>
                  </div>
                </div>
              </div>
              {/* ++ END NEW Clean Cost/Currency Input ++ */}
              
              <div className="form-field">
                <label htmlFor="reward-icon">Icon Image</label>
                <div 
                  className={`icon-upload-area ${isDragging ? 'dragging' : ''} ${newRewardIconUrl ? 'has-image' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('icon-file-input')?.click()}
                >
                  {newRewardIconUrl ? (
                    <div className="icon-preview">
                      <img src={newRewardIconUrl} alt="Icon preview" />
                      <button 
                        type="button" 
                        className="remove-icon-btn"
                        onClick={(e) => { e.stopPropagation(); setNewRewardIconUrl(''); }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon">📁</div>
                      <p>Drag and drop an image here or click to upload</p>
                    </>
                  )}
                  <input
                    id="icon-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              
              <button type="submit" className="add-reward-button">Add Reward</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="rewards-container">
          <div className="shop-header">
            <h3>Redemption History</h3>
            <div className="shop-header-actions">
              <button 
                className={`toggle-history-button ${!showHistory ? 'active' : ''}`}
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Available Rewards' : 'Redemption History'}
              </button>
            </div>
          </div>
          
          {rewards.some(reward => getRedeemHistoryLength(reward) > 0) ? (
            <div className="rewards-history-list">
              {rewards
                .filter(reward => getRedeemHistoryLength(reward) > 0)
                .map(reward => {
                  const redeemHistory = reward.redeemHistory || [];
                  return (
                    <div key={reward.id} className="reward-history-item card">
                      <h4>{reward.title}</h4>
                      <p className="redemption-count">
                        Redeemed {redeemHistory.length} {redeemHistory.length === 1 ? 'time' : 'times'}
                      </p>
                      <ul className="redemption-dates">
                        {redeemHistory.map((event: RedeemEvent) => (
                          <li key={event.id} className="redemption-date-item">
                            {formatDate(event.date)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="card">
              <p>No rewards have been redeemed yet.</p>
            </div>
          )}
          
          <div className="bottom-padding" style={{ paddingBottom: '80px' }}></div>
        </div>
      )}
    </div>
  );
};

export default RewardsModule; 