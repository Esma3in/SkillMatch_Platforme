import image from '../assets/BG (1).png';
import '../styles/pages/Sign/signin.css';
import { useState } from 'react';
import { api } from '../api/api';
// import image from '../assets/images/signin.png';
// import { useNavigate } from 'react-router-dom'; // navigate is not used, can remove or keep if planning to use

export default function SignUp({ onToggle }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
  });
  const [Loading, setLoading] = useState(false); // State to control loading spinner
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  };

  const storeData = async () => {
    try {
      await api.get('sanctum/csrf-cookie');
      const formDataToSend = new FormData();
      // Append normal fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.role);
      
      // Append document file if role is company and document exists
      if (formData.role === 'company' && formData.document) {
        formDataToSend.append('document', formData.document);
      }

      const response = await api.post('/api/signUp', formDataToSend);

      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        throw err.response.data.errors;
      } else {
        // Fallback for general network errors or unexpected responses
        throw { general: 'Something went wrong. Please try again.' };
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    setLoading(true); // Set loading to true when form is submitted

    try {
      const response = await storeData();
      if (response) {
        setSuccess(true);
        // Reset form data after successful submission
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'candidate', // Keep the default role, or reset based on UX
        });
        // You mentioned `window.location.href='/signIn'`,
        // but `useNavigate` from `react-router-dom` is generally preferred for SPA navigation.
        // If you want to force a full page reload, `window.location.href` is fine.
        // If using `useNavigate`, you'd do: `const navigate = useNavigate();` then `navigate('/signIn');`
        window.location.href = '/signIn'; // Full page reload to signIn
      }
    } catch (errorData) {
      setErrors(errorData);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    <div className="containersignIn">
      <div className="visual-section">
        <img src={image} alt="Sign Up Visual" />
      </div>
      <div className="form-section">
        <div className="signin-form">
          <fieldset>
            <legend>Sign Up</legend>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Role Selection */}
              <div className="form-field">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="candidate">Candidate</option>
                  <option value="company">Company</option>
                </select>
              </div>

              {/* Name Field */}
              <div className="form-field">
                <label htmlFor="FullNameInput">Name</label>
                <input
                  type="text"
                  id="FullNameInput"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className="error-message">{errors.name[0]}</p>}
              </div>

              {/* Email Field */}
              <div className="form-field">
                <label htmlFor="EmailInput">Email</label>
                <input
                  type="email"
                  id="EmailInput"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="error-message">{errors.email[0]}</p>}
              </div>
              {/* Password Field */}
              <div className="form-field">
                <label htmlFor="PasswordInput">Password</label>
                <input
                  type="password"
                  id="PasswordInput"
                  name="password"
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
                  <button type="submit" disabled={Loading}> {/* Disable button while loading */}
                    {Loading ? (
                      <>
                        <span className="spinner"></span> {/* Add your spinner class/SVG/component here */}
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </button>
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