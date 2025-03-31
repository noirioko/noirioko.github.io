import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faMoon, faSun, faInfoCircle, faStar, faBroom, faBook, faMagic, faHatWizard, faGift, faPencilAlt, faStickyNote, faLaptopCode, faPaintBrush, faEnvelope, faHeart } from '@fortawesome/free-solid-svg-icons';
import './styles/index.css';
import Home from './pages/Home';
import CleaningModule from './pages/CleaningModule';
import RewardsModule from './pages/RewardsModule';
import DiaryModule from './pages/DiaryModule';
import SkincareModule from './pages/SkincareModule';
import AvatarModule from './pages/AvatarModule';
import BlogModule from './pages/BlogModule';
import FinanceModule from './pages/FinanceModule';
import ProfileCard from './components/ProfileCard';
import IDCard from './components/IDCard';
import CheatButton from './components/CheatButton';
import { useAppContext } from './contexts/AppContext';
import logoImage from './assets/images/yuyulitelogo.png';
import cleaningIcon from './assets/images/yuwon_clean_icon.png';
import diaryIcon from './assets/images/minkyu_diary_icon.png';
import skincareIcon from './assets/images/jaehyun_skincare_icon.png';
import rewardsIcon from './assets/images/noah_rewards_icon.png';
import homeIcon from './assets/images/yuwon_veryhappy.png';
import vanityIcon from './assets/images/yuwon_vanity_icon.png';
import blogIcon from './assets/images/yuwon_blog_icon.png';
import financeIcon from './assets/images/finance_icon.png';

// Import the Desktop Avatar Card component
import DesktopAvatarCard from './components/DesktopAvatarCard';

// About page component
const AboutPage: React.FC = () => {
  return (
    <div className="about-page" style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 6px 20px rgba(255, 182, 193, 0.2)', border: '2px solid #f9f9f9' }}>
      <h1 style={{ textAlign: 'center', color: '#ffb6c1', marginBottom: '2rem', position: 'relative' }}>
        <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '10px' }} /> About YuyuPlanner Lite <FontAwesomeIcon icon={faInfoCircle} style={{ marginLeft: '10px' }} />
      </h1>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img src={logoImage} alt="YuyuPlanner Logo" style={{ width: '200px', height: 'auto', margin: '0 auto 1.5rem' }} />
      </div>
      
      <div className="about-content card" style={{ padding: '2.5rem', borderRadius: '25px', backgroundColor: 'white', boxShadow: '0 8px 30px rgba(255, 182, 193, 0.2)', border: '2px solid #f9f9f9', position: 'relative' }}>
        <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#6d6875' }}>YuyuPlanner Lite is a lightweight version of YuyuPlanner, a kawaii productivity planner designed to help you organize tasks, maintain routines, and enjoy the process with cute visuals and very simple gamification! <FontAwesomeIcon icon={faHeart} style={{ color: '#ff6b81' }} /></p>
        
        <h2 style={{ color: '#ff9cc2', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem', position: 'relative', display: 'inline-block' }}>
          <FontAwesomeIcon icon={faStar} style={{ marginRight: '10px' }} /> Features
        </h2>
        <ul style={{ paddingLeft: '0.5rem', listStyleType: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.8rem' }}>
          <li style={{ marginBottom: '0.8rem', backgroundColor: '#f8f8ff', padding: '0.8rem 1.2rem', borderRadius: '15px', transition: 'all 0.3s', fontSize: '1rem', borderLeft: '3px solid #ffb6c1' }}>
            <FontAwesomeIcon icon={faBroom} style={{ marginRight: '10px', width: '16px', height: '16px' }} /> Task management with point rewards
          </li>
          <li style={{ marginBottom: '0.8rem', backgroundColor: '#f8f8ff', padding: '0.8rem 1.2rem', borderRadius: '15px', transition: 'all 0.3s', fontSize: '1rem', borderLeft: '3px solid #ffb6c1' }}>
            <FontAwesomeIcon icon={faBook} style={{ marginRight: '10px', width: '16px', height: '16px' }} /> Diary entries for daily reflection
          </li>
          <li style={{ marginBottom: '0.8rem', backgroundColor: '#f8f8ff', padding: '0.8rem 1.2rem', borderRadius: '15px', transition: 'all 0.3s', fontSize: '1rem', borderLeft: '3px solid #ffb6c1' }}>
            <FontAwesomeIcon icon={faMagic} style={{ marginRight: '10px', width: '16px', height: '16px' }} /> Skincare routine tracker
          </li>
          <li style={{ marginBottom: '0.8rem', backgroundColor: '#f8f8ff', padding: '0.8rem 1.2rem', borderRadius: '15px', transition: 'all 0.3s', fontSize: '1rem', borderLeft: '3px solid #ffb6c1' }}>
            <FontAwesomeIcon icon={faHatWizard} style={{ marginRight: '10px', width: '16px', height: '16px' }} /> Customizable avatar with collectible headgear
          </li>
          <li style={{ marginBottom: '0.8rem', backgroundColor: '#f8f8ff', padding: '0.8rem 1.2rem', borderRadius: '15px', transition: 'all 0.3s', fontSize: '1rem', borderLeft: '3px solid #ffb6c1' }}>
            <FontAwesomeIcon icon={faGift} style={{ marginRight: '10px', width: '16px', height: '16px' }} /> Reward system with redeemable items
          </li>
          <li style={{ marginBottom: '0.8rem', backgroundColor: '#f8f8ff', padding: '0.8rem 1.2rem', borderRadius: '15px', transition: 'all 0.3s', fontSize: '1rem', borderLeft: '3px solid #ffb6c1' }}>
            <FontAwesomeIcon icon={faPencilAlt} style={{ marginRight: '10px', width: '16px', height: '16px' }} /> Blog posts to share your thoughts
          </li>
          <li style={{ marginBottom: '0.8rem', backgroundColor: '#f8f8ff', padding: '0.8rem 1.2rem', borderRadius: '15px', transition: 'all 0.3s', fontSize: '1rem', borderLeft: '3px solid #ffb6c1' }}>
            <FontAwesomeIcon icon={faStickyNote} style={{ marginRight: '10px', width: '16px', height: '16px' }} /> Whiteboard for quick notes
          </li>
        </ul>
        
        <h2 style={{ color: '#ff9cc2', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem', position: 'relative', display: 'inline-block' }}>
          <FontAwesomeIcon icon={faLaptopCode} style={{ marginRight: '10px', width: '16px', height: '16px' }} /> Made With
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }} className="tech-stack">
          <div style={{ background: 'linear-gradient(to right, #ffb6c1, #ff9cc2)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 3px 8px rgba(255, 182, 193, 0.3)' }} className="tech-item">React</div>
          <div style={{ background: 'linear-gradient(to right, #ffb6c1, #ff9cc2)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 3px 8px rgba(255, 182, 193, 0.3)' }} className="tech-item">TypeScript</div>
          <div style={{ background: 'linear-gradient(to right, #ffb6c1, #ff9cc2)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 3px 8px rgba(255, 182, 193, 0.3)' }} className="tech-item">CSS</div>
          <div style={{ background: 'linear-gradient(to right, #ffb6c1, #ff9cc2)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 3px 8px rgba(255, 182, 193, 0.3)' }} className="tech-item">Love</div>
        </div>

        <h2 style={{ color: '#ff9cc2', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem', position: 'relative', display: 'inline-block' }}>
          <FontAwesomeIcon icon={faPaintBrush} style={{ marginRight: '10px', width: '16px', height: '16px' }} /> Artists
        </h2>
        <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#6d6875', marginBottom: '1.5rem' }}>All artworks have been drawn by real human artists:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '180px', backgroundColor: '#f8f8ff', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
            <img src={require('./assets/images/icons/hawon-avatar.jpg')} alt="Hawon" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffb6c1', boxShadow: '0 3px 8px rgba(255, 182, 193, 0.3)', marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.3rem 0', color: '#ff9cc2', fontSize: '1.2rem', textAlign: 'center' }}>Hawon</h3>
            <p style={{ margin: '0', color: '#6d6875', fontSize: '0.95rem', textAlign: 'center' }}>Lead Character Artist & UI Designer</p>
          </div>
        </div>

        <h2 style={{ color: '#ff9cc2', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem', position: 'relative', display: 'inline-block' }}>
          <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '10px', width: '16px', height: '16px' }} /> Support & Feedback
        </h2>
        <div style={{ backgroundColor: '#f8f8ff', padding: '1.2rem', borderRadius: '15px', marginBottom: '1.5rem', borderLeft: '3px solid #ffb6c1' }}>
          <p style={{ margin: '0 0 0.8rem 0', lineHeight: '1.6', fontSize: '1.05rem', color: '#6d6875' }}>Got any feedback? Send it to:</p>
          <a href="mailto:limseraart@gmail.com" style={{ color: '#ff9cc2', fontWeight: '600', textDecoration: 'none', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <FontAwesomeIcon icon={faEnvelope} style={{ width: '16px', height: '16px' }} /> limseraart@gmail.com
          </a>
          <p style={{ margin: '0.8rem 0 0 0', fontSize: '0.95rem', color: '#6d6875' }}>Or request a feature for future updates!</p>
        </div>
        
        <h2 style={{ color: '#ff9cc2', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem', position: 'relative', display: 'inline-block' }}>
          <FontAwesomeIcon icon={faHeart} style={{ marginRight: '10px', width: '16px', height: '16px' }} /> Thank You
        </h2>
        <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#6d6875' }}>Thanks for using YuyuPlanner Lite! We hope it brings joy and productivity to your daily routines.</p>
        
        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#999', borderTop: '1px dashed #f0f0f0', paddingTop: '1.2rem' }} className="about-version">
          <span>Version 1.0.0</span>
        </div>
      </div>
    </div>
  );
};

// Component to conditionally render IDCard except on Avatar page
const ConditionalIDCard = () => {
  const location = useLocation();
  const isAvatarPage = location.pathname === '/avatar';
  
  if (isAvatarPage) {
    return null;
  }
  
  return <IDCard />;
}

// Component to conditionally render DesktopAvatarCard except on Avatar page
const ConditionalDesktopAvatarCard = () => {
  const location = useLocation();
  const isAvatarPage = location.pathname === '/avatar';
  
  if (isAvatarPage) {
    return null;
  }
  
  return <DesktopAvatarCard />;
}

// ++ REVISED Settings Component with Dark Mode & About ++ 
const SimpleSettings = () => {
  const appContext = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Apply dark mode on mount and when it changes
  useEffect(() => {
    if (appContext.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [appContext.darkMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    if (appContext.dispatch) {
      appContext.dispatch({ type: 'TOGGLE_DARK_MODE' });
    }
    setIsOpen(false);
  };

  // Navigate to About page
  const goToAbout = () => {
    navigate('/about');
    setIsOpen(false);
  };

  const handleReset = () => {
    appContext.resetAllData();
    setShowResetConfirm(false);
    setIsOpen(false); 
  };

  return (
    <div className="settings-wrapper" ref={containerRef}>
      {/* Using div instead of button to avoid button styling */}
      <div 
        className="settings-circle"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-label="Settings"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faGear} />
      </div>

      {isOpen && (
        <div className="settings-menu"> 
          <div 
            className="settings-menu-item"
            onClick={toggleDarkMode}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleDarkMode()}
          >
            <FontAwesomeIcon icon={appContext.darkMode ? faSun : faMoon} className="menu-icon" />
            <span>{appContext.darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          
          <div 
            className="settings-menu-item"
            onClick={goToAbout}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && goToAbout()}
          >
            <FontAwesomeIcon icon={faInfoCircle} className="menu-icon" />
            <span>About</span>
          </div>
          
          <div 
            className="settings-menu-item"
            onClick={() => {
              setShowResetConfirm(true);
              setIsOpen(false);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setShowResetConfirm(true);
                setIsOpen(false);
              }
            }}
          >
            <span>Reset Data</span>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal (using portal is fine here) */}
      {showResetConfirm && createPortal(
        <div className="reset-confirmation">
          <div className="reset-modal card">
            <h3>Reset All Data?</h3>
            <p>This will delete all your tasks, rewards, diary entries, and points. This action cannot be undone.</p>
            <div className="reset-buttons">
              <button onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button className="danger" onClick={handleReset}>Reset Everything</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

/* Bottom Navigation Bar */
const AppNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  let startY = 0;
  let isDragging = false;
  
  // Check if a nav item is active
  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };
  
  useEffect(() => {
    const navElement = navRef.current;
    
    if (!navElement) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
        isDragging = true;
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY; // Positive when dragging up
      
      // If dragging up (deltaY > 0), consider expanding
      if (deltaY > 30 && !isExpanded) {
        setIsExpanded(true);
        isDragging = false;
      }
      
      // If dragging down (deltaY < 0), consider collapsing
      if (deltaY < -30 && isExpanded) {
        setIsExpanded(false);
        isDragging = false;
      }
    };
    
    const handleTouchEnd = () => {
      isDragging = false;
    };
    
    // Tap on the pull indicator to toggle
    const handlePullIndicatorClick = (e: MouseEvent) => {
      // Only toggle if clicking the top 20px area (where the pull indicator is)
      const rect = navElement.getBoundingClientRect();
      if (e.clientY < rect.top + 20) {
        setIsExpanded(!isExpanded);
      }
    };
    
    navElement.addEventListener('touchstart', handleTouchStart);
    navElement.addEventListener('touchmove', handleTouchMove);
    navElement.addEventListener('touchend', handleTouchEnd);
    navElement.addEventListener('click', handlePullIndicatorClick);
    
    return () => {
      navElement.removeEventListener('touchstart', handleTouchStart);
      navElement.removeEventListener('touchmove', handleTouchMove);
      navElement.removeEventListener('touchend', handleTouchEnd);
      navElement.removeEventListener('click', handlePullIndicatorClick);
    };
  }, [isExpanded]);
  
  // Handle item click
  const handleItemClick = () => {
    // Close the menu when an item is clicked
    if (isExpanded) {
      setIsExpanded(false);
    }
  };
  
  return (
    <nav 
      ref={navRef}
      className={`bottom-nav ${isExpanded ? 'expanded' : ''}`}
    >
      <Link to="/cleaning" className={`nav-item ${isActive('/cleaning') ? 'active' : ''}`} onClick={handleItemClick}>
        <img src={cleaningIcon} alt="Cleaning" className="nav-icon" />
        <span className="nav-label">Cleaning</span>
      </Link>
      <Link to="/diary" className={`nav-item ${isActive('/diary') ? 'active' : ''}`} onClick={handleItemClick}>
        <img src={diaryIcon} alt="Diary" className="nav-icon" />
        <span className="nav-label">Diary</span>
      </Link>
      <Link to="/avatar" className={`nav-item ${isActive('/avatar') ? 'active' : ''}`} onClick={handleItemClick}>
        <img src={vanityIcon} alt="Vanity" className="nav-icon" />
        <span className="nav-label">Vanity</span>
      </Link>
      <Link to="/skincare" className={`nav-item ${isActive('/skincare') ? 'active' : ''}`} onClick={handleItemClick}>
        <img src={skincareIcon} alt="Skincare" className="nav-icon" />
        <span className="nav-label">Skincare</span>
      </Link>
      <Link to="/rewards" className={`nav-item ${isActive('/rewards') ? 'active' : ''}`} onClick={handleItemClick}>
        <img src={rewardsIcon} alt="Rewards" className="nav-icon" />
        <span className="nav-label">Rewards</span>
      </Link>
      <Link to="/blog" className={`nav-item nav-blog ${isActive('/blog') ? 'active' : ''}`} onClick={handleItemClick}>
        <img src={blogIcon} alt="Blog" className="nav-icon" />
        <span className="nav-label">Blog</span>
      </Link>
      <Link to="/finance" className={`nav-item nav-finance ${isActive('/finance') ? 'active' : ''}`} onClick={handleItemClick}>
        <img src={financeIcon} alt="Finance" className="nav-icon" />
        <span className="nav-label">Finance</span>
      </Link>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        {/* <header className="App-header">
          <div className="header-content">
            <div className="logo-container">
              <Link to="/" className="logo-link">
                <img src={logoImage} alt="YuyuPoints Logo" className="app-logo" />
                <h1 className="visually-hidden">YuyuPoints</h1>
              </Link>
            </div>
            <div className="header-actions">
              <SimpleSettings /> 
            </div>
          </div>
        </header> */}

        {/* ++ NEW Slim Header ++ */}
        <header className="app-header-new">
          <div className="header-content-wrapper">
            <div className="logo-container-new">
              <Link to="/" className="logo-link-new">
                <img src={logoImage} alt="YuyuPoints Logo" className="app-logo-new" />
              </Link>
            </div>
            <div className="header-actions-new">
              {/* Currency now in avatar sidebar */}
              <div className="settings-container-rebuilt">
                <SimpleSettings />
              </div>
            </div>
          </div>
        </header>
        {/* ++ END NEW Slim Header ++ */}

        {/* ID Card - appears on mobile and all pages except Avatar page */}
        <ConditionalIDCard />

        {/* Desktop Avatar Card - appears only on desktop and not on the Avatar page */}
        <ConditionalDesktopAvatarCard />

        <main className="App-main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cleaning" element={<CleaningModule />} />
            <Route path="/diary" element={<DiaryModule />} />
            <Route path="/skincare" element={<SkincareModule />} />
            <Route path="/rewards" element={<RewardsModule />} />
            <Route path="/avatar" element={<AvatarModule />} />
            <Route path="/profile" element={<ProfileCard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogModule />} />
            <Route path="/finance" element={<FinanceModule />} />
          </Routes>
        </main>
        
        {/* Cheat Button */}
        <CheatButton />
        
        {/* Bottom Navigation Bar - Always visible */}
        <AppNavigation />
      </div>
    </Router>
  );
}

export default App;
