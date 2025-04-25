import image from '../assets/BG (1).png';
import '../styles/pages/Sign/signin.css';
import { useState } from 'react';

export default function SignIn({ onToggle }) {
  const [FormData, setFormData] = useState({
    email: '',
    password: '',
    remember_me: false,
  });

  const [errors, setErrors] = useState({});

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
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!FormData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(FormData.email)) {
      newErrors.email = 'Email is invalid.';
    }

    if (!FormData.password) {
      newErrors.password = 'Password is required.';
    } else if (FormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log('Submitted data:', FormData);
    
  };

  return (
    <>
      <div className="container">
        <div className="form-section">
          <div className="signin-form">
            <fieldset>
              <legend>Sign In</legend>
              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <label htmlFor="EmailInput" id="emailLabel">Email</label>
                  <input
                    type="email"
                    id="EmailInput"
                    value={FormData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
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
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
                <div className="remForg-part">
                  <div className="form-field">
                    <input
                      type="checkbox"
                      id="remember-meCheck"
                      checked={FormData.remember_me}
                      onChange={handleChange}
                    />
                    <label htmlFor="remember-meCheck" id="remembermeLabel">Remember me</label>
                  </div>
                  <div className="forgetPassword">
                    <a href="/forgetPassword">Forgot your password?</a>
                  </div>
                </div>
                <div className="action-part">
                  <div className="signin-btn">
                    <button type="submit">Sign In</button>
                  </div>
                  <div className="signUp-link">
                    <p>You don't have an account? <span className="switch-link" onClick={onToggle}>Sign Up</span></p>
                  </div>
                </div>
              </form>
            </fieldset>
          </div>
        </div>
        <div className="visual-section">
          <img src={image} alt="Sign In Visual" />
        </div>
      </div>
    </>
  );
}
