
import image from '../assets/BG (1).png';
import '../styles/signin.css';
import { useState } from 'react';

export default function SignUp({ onToggle }) {
  const [FormData, setFormData] = useState({
    FullName:'',
    email: '',
    password: '',
    remember_me: false,
  });

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;

    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        remember_me: checked,
      }));
    } else if (id === 'EmailInput') {
      setFormData((prevData) => ({
        ...prevData,
        email: value,
      }));
    } else if (id === 'PasswordInput') {
      setFormData((prevData) => ({
        ...prevData,
        password: value,
      }));
    }else if(id === 'FullNameInput'){
            setFormData((prevData)=>({
                ...prevData,FullName:value,
            }))
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted data:', FormData);

  };

  return (
    <>
      <div className="container">
      <div className="visual-section">
          <img src={image} alt="Sign In Visual" />
        </div>
        <div className="form-section">
          <div className="signin-form">
            <fieldset>
              <legend>Sign Up</legend>
              <form onSubmit={handleSubmit}>
              <div className="form-field">
                  <label htmlFor="FullNameInput" id="FullNameLabel">Full Name</label>
                  <input
                    type="text"
                    id="FullNameInput"
                    value={FormData.FullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="EmailInput" id="emailLabel">Email</label>
                  <input
                    type="email"
                    id="EmailInput"
                    value={FormData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="PasswordInput" id="passwordLabel">Password</label>
                  <input
                    type="password"
                    id="PasswordInput"
                    value={FormData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="action-part">
                  <div className="signin-btn">
                    <button type="submit">Sign Up</button>
                  </div>
                  <div className="signUp-link">
                    <p>You already have an account? <span className="switch-link" onClick={onToggle}>Sign In</span></p>
                  </div>
                </div>
              </form>
            </fieldset>
          </div>
        </div>
      </div>
    </>
  );
}
import React from 'react';
import "../styles/pages/SignUp.css"

//import starts
import Star1 from "../assets/group-1.png";
import Star2 from "../assets/group-2.png";
import Star3 from "../assets/group-3.png";
import Star4 from "../assets/group-4.png";

export const SignUp =()=>{
    const starImages= [Star1,Star2,Star3,Star4];

    return(
        <div className='signup-container'>
            {/* left section */}
            <div className='left-section'>
                <div className="welcome-message">
                    <h1>Welcome to <span className="highlight">SkillMatch</span></h1>
                    <p>Our site offers a seamless company and candidate experience.</p>
                </div>

                <div className="testimonial-section">
                    <div className="star-rating">
                        {starImages.map((src, index) => (
                        <img key={index} src={src} alt="star" className="star-icon" />
                        ))}
                    </div>
                    <p className="testimonial-text">
                        Discover and interact with companies and candidates with ease.
                        Enjoy a smooth and intuitive experience to find the best opportunities.
                    </p>
                </div>
            </div>
            {/* Right section */}
            <div className="right-section">
                <div className="form-card">
                <h2>Create your account</h2>
                    <form className="signup-form">
                        <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input id="fullName" type="text" placeholder="John Doe" />
                        </div>

                        <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="john@example.com" />
                        </div>

                        <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" placeholder="••••••••" />
                        </div>

                        <button type="submit" className="submit-button">Sign Up</button>

                        <p className="signin-link">
                        Already have an account? <a href="#">Sign In</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
