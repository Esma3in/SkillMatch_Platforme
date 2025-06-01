import React, { useState, useRef, useEffect } from 'react';
import '../../styles/pages/Navbar/navbarCandidate.css'; // Assuming this CSS file is shared or relevant
import userAvatar from '../../assets/userAvatar.jpg';
import useLogout from '../../hooks/useLogout';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/Logoo.png"
import { api } from '../../api/api';


const NavbarCompany = () => {
  const logout = useLogout();
  const CompanyID = JSON.parse(localStorage.getItem('company_id'));
  const [isTestOpen, setIsTestOpen] = useState(false); // Renamed for clarity (was isTrainingOpen)
  const [isCandidateOpen, setIsCandidateOpen] = useState(false); // Renamed for clarity (was isCompanyOpen)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [company, setCompany] = useState({});

  const testRef = useRef(null); // Ref for the "Tests" dropdown
  const candidateRef = useRef(null); // Ref for the "Candidate" dropdown
  const profileRef = useRef(null);

  // Refs for timeout IDs
  const testTimeout = useRef(null);
  const candidateTimeout = useRef(null);

  const navigate = useNavigate();

  const handleCreateTest = () => {
    navigate('/training/start');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Clear timeouts when clicking outside to prevent unexpected menu re-opening
      clearTimeout(testTimeout.current);
      clearTimeout(candidateTimeout.current);

      if (testRef.current && !testRef.current.contains(event.target)) {
        setIsTestOpen(false);
      }
      if (candidateRef.current && !candidateRef.current.contains(event.target)) {
        setIsCandidateOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const fetchData = async () => {
      try {
        const response = await api.get(`/api/company/profile/${CompanyID}`);
        setCompany(response.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchData();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Cleanup timeouts on component unmount
      clearTimeout(testTimeout.current);
      clearTimeout(candidateTimeout.current);
    };
  }, []); // Empty dependency array as navigate is not used inside handleClickOutside directly

  // Handlers for 'Tests' dropdown
  const handleTestEnter = () => {
    clearTimeout(testTimeout.current); // Clear any pending hide timeout
    setIsTestOpen(true);
  };

  const handleTestLeave = () => {
    testTimeout.current = setTimeout(() => {
      setIsTestOpen(false);
    }, 200); // 200ms delay before hiding
  };

  // Handlers for 'Candidate' dropdown
  const handleCandidateEnter = () => {
    clearTimeout(candidateTimeout.current); // Clear any pending hide timeout
    setIsCandidateOpen(true);
  };

  const handleCandidateLeave = () => {
    candidateTimeout.current = setTimeout(() => {
      setIsCandidateOpen(false);
    }, 200); // 200ms delay before hiding
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="navbar-left">
          <nav className="navbar-nav">
            <a href={`/company/Session/${CompanyID}`} className="nav-item">
              <img src={logo} alt="Logo" className="h-11 w-auto" />
              <h2 className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-violet-500 text-transparent bg-clip-text">
                SkillMatch  
              </h2>
            </a>
            <a className='nav-item' href={`/company/Session/${CompanyID}`}>Home </a>
            <div
              className="nav-item dropdown"
              ref={testRef}
              onMouseEnter={handleTestEnter}
              onMouseLeave={handleTestLeave}
            >
              
              <span>Tests <i className="dropdown-icon">▼</i></span>
              {isTestOpen && (
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
              ref={candidateRef}
              onMouseEnter={handleCandidateEnter}
              onMouseLeave={handleCandidateLeave}
            >
              <span>Candidate <i className="dropdown-icon">▼</i></span>
              {isCandidateOpen && (
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
          <div className="navbar-icons">
            <div className="profile-dropdown" ref={profileRef}>
              <button
                className="profile-button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img 
                  src={
                    company?.logo 
                      ? `http://localhost:8000/storage/${company.logo}` 
                      : userAvatar
                  } 
                  alt="Company profile" 
                  className="avatar rounded-full" 
                />
              </button>
              
              {isProfileOpen && (
                <div className="profile-menu">
                  <div className="profile-header">
                    <img 
                      src={
                        company?.logo 
                          ? `http://localhost:8000/storage/${company.logo}` 
                          : userAvatar
                      } 
                      alt="Company profile" 
                      className="profile-avatar rounded-full" 
                    />
                    <div className="profile-info">
                      <h3>{company?.name || 'Company Name'}</h3>
                      <p>{company?.user?.email || 'company@example.com'}</p>
                    </div>
                  </div>
                  <div className="profile-options">
                    <Link to="/company/profile" className="profile-option">
                      <i className="option-icon profile-icon"></i>
                      View profile
                    </Link>
                    {/* <Link to="/settings" className="profile-option">
                      <i className="option-icon settings-icon"></i>
                      Settings
                    </Link> */}
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