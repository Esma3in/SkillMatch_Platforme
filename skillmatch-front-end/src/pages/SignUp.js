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
