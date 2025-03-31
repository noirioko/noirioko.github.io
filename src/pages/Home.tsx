import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
// Import components
import Whiteboard from '../components/Whiteboard';
// Import the icons
import cleaningIcon from '../assets/images/yuwon_clean_icon.png';
import diaryIcon from '../assets/images/minkyu_diary_icon.png';
import skincareIcon from '../assets/images/jaehyun_skincare_icon.png';
import rewardsIcon from '../assets/images/noah_rewards_icon.png';
import vanityIcon from '../assets/images/yuwon_vanity_icon.png';
import blogIcon from '../assets/images/yuwon_blog_icon.png'; // Using the blog icon

const Home: React.FC = () => {
  const { points } = useAppContext();

  return (
    <div className="home-container">
      <header className="module-header">
        <h2>YuyuPlanner Lite</h2>
      </header>

      <p className="home-intro">Choose a module below to get started:</p>

      <div className="module-cards">
        <Link to="/cleaning" className="module-card">
          <img src={cleaningIcon} alt="Cleaning" className="module-card-icon" />
          <div className="module-card-content">
            <h2>Cleaning</h2>
            <p>Track chores and cleaning tasks</p>
          </div>
        </Link>

        <Link to="/diary" className="module-card">
          <img src={diaryIcon} alt="Diary" className="module-card-icon" />
          <div className="module-card-content">
            <h2>Diary</h2>
            <p>Record your thoughts and moods</p>
          </div>
        </Link>

        <Link to="/skincare" className="module-card">
          <img src={skincareIcon} alt="Skincare" className="module-card-icon" />
          <div className="module-card-content">
            <h2>Skincare</h2>
            <p>Track your daily skincare routines</p>
          </div>
        </Link>

        <Link to="/rewards" className="module-card">
          <img src={rewardsIcon} alt="Rewards" className="module-card-icon" />
          <div className="module-card-content">
            <h2>Rewards</h2>
            <p>Redeem points for rewards and shop for cat ears</p>
          </div>
        </Link>
        
        <Link to="/avatar" className="module-card">
          <img src={vanityIcon} alt="Vanity" className="module-card-icon" />
          <div className="module-card-content">
            <h2>Vanity</h2>
            <p>View and customize your avatar</p>
          </div>
        </Link>
        
        <Link to="/blog" className="module-card">
          <img src={blogIcon} alt="Blog" className="module-card-icon" />
          <div className="module-card-content">
            <h2>Blog</h2>
            <p>Share posts and express yourself</p>
          </div>
        </Link>
      </div>
      
      {/* Add whiteboard at the bottom */}
      <Whiteboard />
    </div>
  );
};

export default Home; 