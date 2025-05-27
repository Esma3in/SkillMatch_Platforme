import image from '../assets/BG (1).png';
import '../styles/pages/Sign/signin.css';
import { useState } from 'react';
import { api } from '../api/api';

export default function SignUp({ onToggle }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    sector: '',
    file: null,
    logo: null,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, name, files } = e.target;

    // Handle file input fields
    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Store the first selected file
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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
      // Append files
      if (formData.role === 'company') {
        formDataToSend.append('file', formData.file);
        formDataToSend.append('logo', formData.logo);
        formDataToSend.append('sector', formData.sector);
      }
      
      const response = await api.post('candidate/signUp', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Indicating that this is a form with files
        },
      });

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
      const response = await storeData();
      if (response) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'candidate',
          sector: '',
          file: null,
          logo: null,
        }); // Reset form
      }
    } catch (errorData) {
      setErrors(errorData);
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

              {/* Conditional Fields for Company */}
              {formData.role === 'company' && (
                <>
                  <div className="form-field">
                    <label htmlFor="sectorInput">Sector Name</label>
                    <input
                      type="text"
                      id="sectorInput"
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.sector && <p className="error-message">{errors.sector[0]}</p>}
                  <div className="form-field">
                    <label htmlFor="fileInput">Legal Identification Document (PDF)</label>
                    <p className="help-text" style={{ fontSize: '0.8rem', color: '#666' }}>
                      Please upload your company registration certificate or business license
                    </p>
                    <input
                      type="file"
                      id="fileInput"
                      name="file"
                      onChange={handleChange}
                      accept=".pdf,.docx"
                      required
                    />
                  </div>
                  {errors.file && <p className="error-message">{errors.file[0]}</p>}
                  <div className="form-field">
                    <label htmlFor="logoInput">Company Logo</label>
                    <input
                      type="file"
                      id="logoInput"
                      name="logo"
                      onChange={handleChange}
                      accept=".png,.jpg,.jpeg"
                      required
                    />
                  </div>
                  {errors.logo && <p className="error-message">{errors.logo[0]}</p>}
                </>
              )}

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
