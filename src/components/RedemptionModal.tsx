import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import '../styles/redemption-modal.css';

interface RedemptionModalProps {
  reward: {
    id: string;
    title: string;
    description: string;
  };
  onClose: () => void;
}

const RedemptionModal: React.FC<RedemptionModalProps> = ({ reward, onClose }) => {
  const [note, setNote] = useState('');
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  // Update window dimensions when window resizes
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Stop confetti after 5 seconds
  useEffect(() => {
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(confettiTimer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you could save the note to the redemption history if needed
    onClose();
  };

  // Tailor the prompt based on the reward
  const getPrompt = () => {
    if (reward.title.toLowerCase().includes('boba')) {
      return 'What flavor do you want to try?';
    }
    if (reward.title.toLowerCase().includes('gelato')) {
      return 'What flavor do you want to eat?';
    }
    return 'How do you want to enjoy this reward?';
  };

  return (
    <div className="redemption-modal-overlay">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      <div className="redemption-modal">
        <div className="redemption-modal-content">
          <h2 className="celebration-text">🎉 Congratulations! 🎉</h2>
          <h3>You redeemed: {reward.title}!</h3>
          <p>{reward.description}</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="reward-note">{getPrompt()}</label>
              <input
                id="reward-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter your preference..."
                className="reward-note-input"
                autoFocus
              />
            </div>
            <div className="modal-buttons">
              <button
                type="button"
                onClick={onClose}
                className="secondary-button"
              >
                Maybe later
              </button>
              <button type="submit" className="primary-button">
                Enjoy now!
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RedemptionModal; 