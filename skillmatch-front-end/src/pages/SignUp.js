import image from '../assets/BG (1).png';
import '../styles/pages/Sign/signin.css';
import { useState } from 'react';
import { api } from '../api/api';

export default function SignUp({ onToggle }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role:'candidate'
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => {
      switch (id) {
        case 'EmailInput':
          return { ...prevData, email: value };
        case 'PasswordInput':
          return { ...prevData, password: value };
        case 'FullNameInput':
          return { ...prevData, name: value };
        default:
          return prevData;
      }
    });
  };

  const fetchData = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const response = await api.post('/api/candidate/signUp', formData);
      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        throw err.response.data.errors;
      } else {
        throw { general: 'Something went wrong. Please try again.' };
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    try {
      const candidate = await fetchData();
      if (candidate) {
        setSuccess(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (errorData) {
      setErrors(errorData);
    }
  };

  return (
    <div className="container">
      <div className="visual-section">
        <img src={image} alt="Sign Up Visual" />
      </div>
      <div className="form-section">
        <div className="signin-form">
          <fieldset>
            <legend>Sign Up</legend>
            <form onSubmit={handleSubmit}>
              {formData.role==='company'}
              <div className="form-field">
                <label htmlFor="FullNameInput">Name</label>
                <input
                  type="text"
                  id="FullNameInput"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className="error-message">{errors.name[0]}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="EmailInput">Email</label>
                <input
                  type="email"
                  id="EmailInput"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="error-message">{errors.email[0]}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="PasswordInput">Password</label>
                <input
                  type="password"
                  id="PasswordInput"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                {errors.password && <p className="error-message">{errors.password[0]}</p>}
              </div>

              {errors.general && <p className="error-message">{errors.general}</p>}
              {success && <p className="success-message">Account created successfully!</p>}

              <div className="action-part">
                <div className="signin-btn">
                  <button type="submit">Sign Up</button>
                </div>
                <div className="signUp-link">
                  <p>
                    You already have an account?{' '}
                    <span className="switch-link" onClick={onToggle}>
                      Sign In
                    </span>
                  </p>
                </div>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
