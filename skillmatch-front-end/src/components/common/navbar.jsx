import React from 'react';
import '../../styles/pages/Navbar/navbarLanding.css';
import logo from '../../assets/logo.png';
const NavbarLanding = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <img src={logo} alt="SkillMatch Logo" className="logo" />
          <h1 className="brand-name">SkillMatch</h1>
        </div>

        <nav className="navigation">
          <ul className="nav-links">
            <li><a href="#about">About us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </nav>

        <div className="auth-buttons">
          <button className="btn btn-primary">Sign Up</button>
          <button className="btn btn-outline">Sign In</button>
          <div className="profile-icon">
            <img src="https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg" alt="Profile" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarLanding;
