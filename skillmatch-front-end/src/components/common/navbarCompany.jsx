import React, { useState, useRef, useEffect } from 'react';
import '../../styles/pages/Navbar/navbarCandidate.css';
import userAvatar from '../../assets/userAvatar.jpg';
import useLogout from '../../hooks/useLogout'; // Fixed hook naming convention
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const NavbarCompany = () => {
  const logout = useLogout(); // Fixed hook naming
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const trainingRef = useRef(null);
  const companyRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const handleCreateTest = () => {
    navigate('/training/start');
  };

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
  }, [navigate]); // Added navigate to dependency array

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">SkillMatch</div>
          <nav className="navbar-nav">
            <Link to="/" className="nav-item">Home</Link>
            
            <div
              className="nav-item dropdown"
              ref={trainingRef}
              onMouseEnter={() => setIsTrainingOpen(true)}
              onMouseLeave={() => setIsTrainingOpen(false)}
            >
              <span>Tests <i className="dropdown-icon">▼</i></span>
              {isTrainingOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleCreateTest} className="dropdown-item">
                    <i className="menu-icon start-icon"></i>
                    Create new Test
                  </button>
                  <Link to="/testsList" className="dropdown-item">
                    <i className="menu-icon challenge-icon"></i>
                    Tests
                  </Link>
                </div>
              )}
            </div>
            
            <div
              className="nav-item dropdown"
              ref={companyRef}
              onMouseEnter={() => setIsCompanyOpen(true)}
              onMouseLeave={() => setIsCompanyOpen(false)}
            >
              <span>Candidate <i className="dropdown-icon">▼</i></span>
              {isCompanyOpen && (
                <div className="dropdown-menu">
                  <Link to="/candidates/list" className="dropdown-item">
                    <i className="menu-icon company-list-icon"></i>
                    Candidate list
                  </Link>
                  <Link to="/candidates/related" className="dropdown-item">
                    <i className="menu-icon company-related-icon"></i>
                    Candidate Filter
                  </Link>
                  <Link to="/company/Candidate-Selected" className="dropdown-item">
                    <i className="menu-icon company-related-icon"></i>
                    Candidate Selected
                  </Link>
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
                    <Link to="/company/profile" className="profile-option">
                      <i className="option-icon profile-icon"></i>
                      View profile
                    </Link>
                    <Link to="/settings" className="profile-option">
                      <i className="option-icon settings-icon"></i>
                      Settings
                    </Link>
                    <Link to="/dashboard" className="profile-option">
                      <i className="option-icon performance-icon"></i>
                      Dashboard
                    </Link>
                    <Link to="/support" className="profile-option">
                      <i className="option-icon support-icon"></i>
                      Support
                    </Link>
                    <button onClick={logout} className="profile-option">
                      <i className="option-icon logout-icon"></i>
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="content-background"></div>
    </div>
  );
};

export default NavbarCompany;