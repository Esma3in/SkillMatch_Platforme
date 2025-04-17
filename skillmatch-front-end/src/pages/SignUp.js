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