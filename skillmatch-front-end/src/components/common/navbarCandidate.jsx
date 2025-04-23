// Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../../styles/pages/Navbar/navbarCandidate.css';
import userAvatar from '../../assets/userAvatar.jpg'; 
import {Link} from "react-router"
const NavbarCandidate = () => {
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const trainingRef = useRef(null);
  const companyRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (trainingRef.current && !trainingRef.current.contains(event.target)) {
        setIsTrainingOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target)) {
        setIsCompanyOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">SkillMatch</div>
          <nav className="navbar-nav">
            <a href="/" className="nav-item">Home</a>
            
            <div 
              className="nav-item dropdown"
              ref={trainingRef}
              onMouseEnter={() => setIsTrainingOpen(true)}
              onMouseLeave={() => setIsTrainingOpen(false)}
            >
              <span>Training <i className="dropdown-icon">▼</i></span>
              {isTrainingOpen && (
                <div className="dropdown-menu">
                  <a href="/training/start" className="dropdown-item">
                    <i className="menu-icon start-icon"></i>
                    Start training
                  </a>
                  <a href="/training/challenges" className="dropdown-item">
                    <i className="menu-icon challenge-icon"></i>
                    Challenges
                  </a>
                </div>
              )}
            </div>
            
            <div 
              className="nav-item dropdown"
              ref={companyRef}
              onMouseEnter={() => setIsCompanyOpen(true)}
              onMouseLeave={() => setIsCompanyOpen(false)}
            >
              <span>Company <i className="dropdown-icon">▼</i></span>
              {isCompanyOpen && (
                <div className="dropdown-menu">
                  <a href="/companies/list" className="dropdown-item">
                    <i className="menu-icon company-list-icon"></i>
                    Companies list
                  </a>
                  <a href="/companies/related" className="dropdown-item">
                    <i className="menu-icon company-related-icon"></i>
                    Companies related
                  </a>
                </div>
              )}
            </div>
          </nav>
        </div>
        
        <div className="navbar-right">
          <div className="search-container">
            <input type="text" placeholder="Search" className="search-input" />
            <i className="search-icon"></i>
          </div>
          
          <div className="navbar-icons">
            <button className="icon-button notification-button">
              <i className="notification-icon"></i>
            </button>
            <button className="icon-button settings-button">
              <i className="settings-icon"></i>
            </button>
            
            <div className="profile-dropdown" ref={profileRef}>
              <button 
                className="profile-button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img src={userAvatar} alt="User profile" className="avatar" />
              </button>
              
              {isProfileOpen && (
                <div className="profile-menu">
                  <div className="profile-header">
                    <img src={userAvatar} alt="User profile" className="profile-avatar" />
                    <div className="profile-info">
                      <h3>Olivia Rhye</h3>
                      <p>olivia@untitledui.com</p>
                    </div>
                  </div>
                  <div className="profile-options">
                   <Link to={'/profile'}>View porfile</Link>
                    <a href="/settings" className="profile-option">
                      <i className="option-icon settings-icon"></i>
                      Settings
                    </a>
                    <a href="/performance" className="profile-option">
                      <i className="option-icon performance-icon"></i>
                      Performance
                    </a>
                    <a href="/history" className="profile-option">
                      <i className="option-icon history-icon"></i>
                      Historique
                    </a>
                    <a href="/support" className="profile-option">
                      <i className="option-icon support-icon"></i>
                      Support
                    </a>
                    <a href="/logout" className="profile-option">
                      <i className="option-icon logout-icon"></i>
                      Log out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarCandidate;