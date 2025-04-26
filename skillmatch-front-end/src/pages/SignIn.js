import image from '../assets/BG (1).png';
import '../styles/pages/Sign/signin.css';
import { useState } from 'react';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function SignIn({ onToggle }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember_me: false,
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;

    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        remember_me: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id === 'EmailInput' ? 'email' : 'password']: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const check = async (data) => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const response = await api.post('/api/candidate/signin', data);
      return response;
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Sign in failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) return;

    const response = await check(formData);

    if (response && response.status === 200) {
      const id = response.data.id;
      localStorage.setItem('candidate_id', id);
      navigate(`/candidate/Session/${id}`);
    }
  };

  return (
    <div className="container">
      <div className="form-section">
        <div className="signin-form">
          <fieldset>
            <legend>Sign In</legend>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="EmailInput">Email</label>
                <input
                  type="email"
                  id="EmailInput"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="PasswordInput">Password</label>
                <input
                  type="password"
                  id="PasswordInput"
                  value={formData.password}
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
                    checked={formData.remember_me}
                    onChange={handleChange}
                  />
                  <label htmlFor="remember-meCheck">Remember me</label>
                </div>
                <div className="forgetPassword">
                  <a href="/forgetPassword">Forgot your password?</a>
                </div>
              </div>
              {formError && <p className="error-message">{formError}</p>}
              <div className="action-part">
                <div className="signin-btn">
                  <button type="submit">Sign In</button>
                </div>
                <div className="signUp-link">
                  <p>
                    You don't have an account?{' '}
                    <span className="switch-link" onClick={onToggle}>
                      Sign Up
                    </span>
                  </p>
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
  );
}
