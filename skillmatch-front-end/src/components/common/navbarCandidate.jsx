import React, { useState, useRef, useEffect } from 'react';
import '../../styles/pages/Navbar/navbarCandidate.css';
import userAvatar from '../../assets/userAvatar.jpg';
import { MdBadge } from "react-icons/md"; 
import UseLogout from '../../hooks/useLogout';
import { api } from '../../api/api';
import logo from "../../assets/Logoo.png"
import { useNavigate } from 'react-router';

const NavbarCandidate = ({searchedItems}) => {
  const logout = UseLogout();
  const candidate_id = JSON.parse(localStorage.getItem('candidate_id'));
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [candidate, setCandidate] = useState({});
  const [searchedValue , setsearchedValue] = useState("")

  const trainingRef = useRef(null);
  const companyRef = useRef(null);
  const profileRef = useRef(null);

  // for tyme
  const trainingTimeout = useRef(null);
  const companyTimeout = useRef(null);
  const navigate= useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (trainingRef.current && !trainingRef.current.contains(event.target)) setIsTrainingOpen(false);
      if (companyRef.current && !companyRef.current.contains(event.target)) setIsCompanyOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };

    const fetchData = async () => {
      try {
        const response = await api.get(`api/candidate/${candidate_id}`);
        setCandidate(response.data);
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      }
    };

    fetchData();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const handleTrainingEnter = () => {
    clearTimeout(trainingTimeout.current);
    setIsTrainingOpen(true);
  };

  const handleTrainingLeave = () => {
    trainingTimeout.current = setTimeout(() => {
      setIsTrainingOpen(false);
    }, 200); // ness tanya
  };

  const handleCompanyEnter = () => {
    clearTimeout(companyTimeout.current);
    setIsCompanyOpen(true);
  };

  const handleCompanyLeave = () => {
    companyTimeout.current = setTimeout(() => {
      setIsCompanyOpen(false);
    }, 200); 
  };

  const handleSearch = (searchTerm) => {
    return searchedItems.filter((item) => {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="navbar-left">
        <div className="flex items-center gap-1 px-4 py-2">
      </div>

          <nav className="navbar-nav">
            <a href={`/candidate/Session/${candidate_id}`} className="nav-item">
              <img src={logo} alt="Logo" className="h-11 w-auto" />
              <h2 className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-violet-500 text-transparent bg-clip-text">
                SkillMatch  
              </h2>
            </a>
            <div 
              className="nav-item dropdown m-5" 
              ref={trainingRef}
              onMouseEnter={handleTrainingEnter}
              onMouseLeave={handleTrainingLeave}
            >
              <span>Training <i className="dropdown-icon">▼</i></span>
              {isTrainingOpen && (
                <div className="dropdown-menu">
                  <a href="/problems" className="dropdown-item">
                    <i className="menu-icon start-icon" ></i>
              
                    Start training
                  </a>
                  <a href="/challenges" className="dropdown-item">
                    <i className="menu-icon challenge-icon"></i>
                    Challenges
                  </a>
                </div>
              )}
            </div>
            
            <div 
              className="nav-item dropdown m-5"
              ref={companyRef}
              onMouseEnter={handleCompanyEnter}
              onMouseLeave={handleCompanyLeave}
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
        
          
          <div className="navbar-icons">            
            <div className="profile-dropdown" ref={profileRef}>
              <button 
                className="profile-button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img 
                  src={
                    candidate?.profile?.photoProfil 
                      ? `http://localhost:8000/storage/${candidate.profile.photoProfil}` 
                      : userAvatar
                  } 
                  alt="User profile" 
                  className="avatar rounded-full" 
                />
              </button>
              
              {isProfileOpen && (
                <div className="profile-menu">
                  <div className="profile-header">
                    <img 
                      src={
                        candidate?.profile?.photoProfil 
                          ? `http://localhost:8000/storage/${candidate.profile.photoProfil}` 
                          : userAvatar
                      } 
                      alt="User profile" 
                      className="profile-avatar rounded-full" 
                    />
                    <div className="profile-info">
                      <h3>{candidate?.name}</h3>
                      <p>{candidate?.email}</p>
                    </div>
                  </div>
                  <div className="profile-options">
                    <a href="/profile" className="profile-option">
                      <i className="option-icon profile-icon"></i>
                      Profile
                    </a>
                    <a href="/profile-settings" className="profile-option">
                      <i className="option-icon settings-icon"></i>
                      Settings
                    </a>
                    <a href="/performance" className="profile-option">
                      <i className="option-icon performance-icon"></i>
                      Performance
                    </a>
                
                    <a href="/support" className="profile-option">
                      <i className="option-icon support-icon"></i>
                      Support
                    </a>
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
    </div>
  );
};

export default NavbarCandidate;
