import React, { useState, useRef, useEffect } from "react";
import "../../styles/pages/Navbar/navbarCandidate.css";
import userAvatar from "../../assets/userAvatar.jpg";
import logo from "../../assets/Logoo.png"
import UseLogout from '../../hooks/useLogout';



const NavbarAdmin = () => {
  const logout = UseLogout()
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStatisticOpen, setIsStatisticOpen] = useState(false);

  // Create mutable refs with proper initialization
  const trainingRef = useRef(null);
  const companyRef = useRef(null);
  const documentsRef = useRef(null);
  const profileRef = useRef(null);
  const StatisticRef = useRef(null);
  
  // Timeout refs
  const trainingTimeoutRef = useRef(null);
  const companyTimeoutRef = useRef(null);
  const documentsTimeoutRef = useRef(null);
  const StatisticTimeoutRef = useRef(null);

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
      if (StatisticRef.current && !StatisticRef.current.contains(event.target)) {
        setIsStatisticOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clear any lingering timeouts
      if (trainingTimeoutRef.current) clearTimeout(trainingTimeoutRef.current);
      if (companyTimeoutRef.current) clearTimeout(companyTimeoutRef.current);
      if (documentsTimeoutRef.current) clearTimeout(documentsTimeoutRef.current);
      if (StatisticTimeoutRef.current) clearTimeout(StatisticTimeoutRef.current);
    };
  }, []);

  // Add handlers for mouse enter and leave with timeouts
  const handleTrainingEnter = () => {
    if (trainingTimeoutRef.current) clearTimeout(trainingTimeoutRef.current);
    setIsTrainingOpen(true);
  };

  const handleTrainingLeave = () => {
    trainingTimeoutRef.current = setTimeout(() => {
      setIsTrainingOpen(false);
    }, 200);
  };

  const handleCompanyEnter = () => {
    if (companyTimeoutRef.current) clearTimeout(companyTimeoutRef.current);
    setIsCompanyOpen(true);
  };

  const handleCompanyLeave = () => {
    companyTimeoutRef.current = setTimeout(() => {
      setIsCompanyOpen(false);
    }, 200);
  };

  const handleDocumentsEnter = () => {
    if (documentsTimeoutRef.current) clearTimeout(documentsTimeoutRef.current);
    setIsDocumentsOpen(true);
  };

  const handleDocumentsLeave = () => {
    documentsTimeoutRef.current = setTimeout(() => {
      setIsDocumentsOpen(false);
    }, 200);
  };
  
  const handleStatisticEnter = () => {
    if (StatisticTimeoutRef.current) clearTimeout(StatisticTimeoutRef.current);
    setIsStatisticOpen(true);
  };

  const handleStatisticLeave = () => {
    StatisticTimeoutRef.current = setTimeout(() => {
      setIsStatisticOpen(false);
    }, 200);
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="navbar-left">
          
          <nav className="navbar-nav">
            <a href="/admin/Session/:id" className="nav-item">
              <img src={logo} alt="Logo" className="h-11 w-auto" />
              <h2 className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-violet-500 text-transparent bg-clip-text">
                SkillMatch  
              </h2>
            </a>

            <div
              className="nav-item dropdown"
              ref={trainingRef}
              onMouseEnter={handleTrainingEnter}
              onMouseLeave={handleTrainingLeave}
            >
              <span>
                Users <i className="dropdown-icon">▼</i>
              </span>
              {isTrainingOpen && (
                <div className="dropdown-menu">
                  <a href="/admin/companiesList" className="dropdown-item">
                    <i className="menu-icon company-list-icon"></i>
                    Companies
                  </a>
                  <a href="/admin/candidatesList" className="dropdown-item">
                    <i className="menu-icon company-related-icon"></i>
                    Candidates
                  </a>
                  <a href="/admin/banUsers" className="dropdown-item">
                    <i className="menu-icon material-icons"></i>
                    banned users
                  </a>
                </div>
              )}
            </div>

            <div
              className="nav-item dropdown"
              ref={companyRef}
              onMouseEnter={handleCompanyEnter}
              onMouseLeave={handleCompanyLeave}
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
                  <a href="/admin/challenges" className="dropdown-item">
                    <i className="menu-icon challenge-icon"></i>
                    Challenges
                  </a>
                </div>
              )}
            </div>

            <div
              className="nav-item dropdown"
              ref={documentsRef}
              onMouseEnter={handleDocumentsEnter}
              onMouseLeave={handleDocumentsLeave}
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
                </div>
              )}
            </div>
            {/* <div
              className="nav-item dropdown"
              ref={StatisticRef}
              onMouseEnter={handleStatisticEnter}
              onMouseLeave={handleStatisticLeave}
            >
              <span>
                statistics <i className="dropdown-icon">▼</i>
              </span>
              {isStatisticOpen && (
                <div className="dropdown-menu">
                  <a href="/admin/companiesStatistics" className="dropdown-item">
                    <i className="menu-icon company-list-icon"></i>
                    Companies
                  </a>
                  <a href="/admin/candidatesStatistics" className="dropdown-item">
                    <i className="menu-icon company-related-icon"></i>
                    Candidates
                  </a>
                </div>
              )}
            </div> */}
          </nav>
        </div>

        <div className="navbar-right">
          {/* <div className="search-container">
            <input type="text" placeholder="Search" className="search-input" />
            <i className="search-icon"></i>
          </div> */}

          <div className="navbar-icons">
            {/* <button className="icon-button notification-button">
              <i className="notification-icon"></i>
            </button>
            <button className="icon-button settings-button">
              <i className="settings-icon"></i>
            </button> */}

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
                    {/* <a href="/profile" className="profile-option">
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
                    </a> */}
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

export default NavbarAdmin;