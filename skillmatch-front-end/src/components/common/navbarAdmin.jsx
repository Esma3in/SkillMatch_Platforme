import React, { useState, useRef, useEffect } from "react";
import "../../styles/pages/Navbar/navbarCandidate.css";
import userAvatar from "../../assets/userAvatar.jpg";

const NavbarAdmin = () => {
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const trainingRef = useRef(null);
  const companyRef = useRef(null);
  const documentsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (trainingRef.current && !trainingRef.current.contains(event.target)) {
        setIsTrainingOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target)) {
        setIsCompanyOpen(false);
      }
      if (documentsRef.current && !documentsRef.current.contains(event.target)) {
        setIsDocumentsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">SkillMatch</div>
          <nav className="navbar-nav">
            <a href="/" className="nav-item">
              Home
            </a>

            <div
              className="nav-item dropdown"
              ref={trainingRef}
              onMouseEnter={() => setIsTrainingOpen(true)}
              onMouseLeave={() => setIsTrainingOpen(false)}
            >
              <span>
                Users <i className="dropdown-icon">▼</i>
              </span>
              {isTrainingOpen && (
                <div className="dropdown-menu">
                  <a href="/users/companies" className="dropdown-item">
                    <i className="menu-icon company-list-icon"></i>
                    Companies
                  </a>
                  <a href="/users/candidates" className="dropdown-item">
                    <i className="menu-icon company-related-icon"></i>
                    Candidates
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
              <span>
                Training <i className="dropdown-icon">▼</i>
              </span>
              {isCompanyOpen && (
                <div className="dropdown-menu">
                  <a href="/training/problems" className="dropdown-item">
                    <i className="menu-icon start-icon"></i>
                    Problems
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
              ref={documentsRef}
              onMouseEnter={() => setIsDocumentsOpen(true)}
              onMouseLeave={() => setIsDocumentsOpen(false)}
            >
              <span>
                Documents <i className="dropdown-icon">▼</i>
              </span>
              {isDocumentsOpen && (
                <div className="dropdown-menu">
                  <a href="/documents/companies" className="dropdown-item">
                    <i className="menu-icon company-list-icon"></i>
                    Companies
                  </a>
                  <a href="/documents/candidates" className="dropdown-item">
                    <i className="menu-icon company-related-icon"></i>
                    Candidates
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
                    <img
                      src={userAvatar}
                      alt="User profile"
                      className="profile-avatar"
                    />
                    <div className="profile-info">
                      <h3>Olivia Rhye</h3>
                      <p>olivia@untitledui.com</p>
                    </div>
                  </div>
                  <div className="profile-options">
                    <a href="/profile" className="profile-option">
                      <i className="option-icon profile-icon"></i>
                      View profile
                    </a>
                    <a href="/settings" className="profile-option">
                      <i className="option-icon settings-icon"></i>
                      Settings
                    </a>
                    <a href="/dashboard" className="profile-option">
                      <i className="option-icon performance-icon"></i>
                      Performance
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
      <div className="content-background"></div>
    </div>
  );
};

export default NavbarAdmin;