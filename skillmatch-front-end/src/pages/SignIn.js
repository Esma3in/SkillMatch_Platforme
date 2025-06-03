import image from '../assets/BG (1).png';
import '../styles/pages/Sign/signin.css';
import { useState,useEffect } from 'react';
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
  const [loading, setLoading] = useState(false); // <--- NEW STATE FOR LOADING
  const navigate = useNavigate();

  useEffect(() => {
  const getCookie = async () => {
    try {
      const response = await api.get('api/getCookie', { withCredentials: true });
      setFormData({
        remember_me: true,
        email: response.data.email,
        password: response.data.password,
      });
    } catch (err) {
      console.log(err); // Fixed typo here
    }
  };

  getCookie();
}, []);


  // Handle changes in form inputs
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
        [id]: value, // Use dynamic keys for both email and password fields
      }));
    }
  };

  // Validate form data
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

  // Make the API call to check credentials
  const check = async (data) => {
    try {
      await api.get('/sanctum/csrf-cookie',{withCredentials:true});
    
      const response = await api.post('api/signin', data);
      return response;
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Sign in failed.');
      throw err; // Re-throw to be caught by handleSubmit's try/catch/finally
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) return;

    setLoading(true); // <--- SET LOADING TO TRUE
    try {
      const response = await check(formData);
   

      if (response && response.status === 200) {
        if(response.data.role==='candidate'){
          if(response.data.candidate?.state==='banned'){
              navigate(`/bannedPage/${formData.email}`);
          }else if(response.data.candidate?.state==='waiting' || response.data.candidate?.state==='unactive'){
            navigate(`/account-desactive/${formData.email}`)
          }else{
            localStorage.setItem('candidate_id',response.data.candidate?.id)
          navigate(`/candidate/Session/${response.data.candidate?.id}`)
          }
        }else if(response.data.role === 'company'){
          if(response.data.company?.state==='banned'){
              navigate(`/bannedPage/${formData.email}`);
          }else if(response.data.company?.state==='waiting' || response.data.company?.state==='unactive'){
            navigate(`/account-desactive/${formData.email}`)
          }else{
          localStorage.setItem('company_id',response.data.company?.id)
          navigate(`/company/Session/${response.data.company?.id}`)}
        }else {
          localStorage.setItem('admin_id',response.data.admin?.id)
          navigate(`/admin/Session/${response.data.admin?.id}`)
        }
      }
    } catch (error) {
      // The `check` function already handles setting `formError`,
      // but this catch ensures `finally` always runs.
      console.error("Login process error:", error);
    } finally {
      setLoading(false); // <--- SET LOADING TO FALSE REGARDLESS OF SUCCESS/FAILURE
    }
  };

  return (
    <div className="containersignIn">
      <div className="form-section">
        <div className="signin-form">
          <fieldset>
            <legend>Sign In</legend>
            <form onSubmit={handleSubmit}>

              {/* Email Field */}
              <div className="form-field">
                <label htmlFor="EmailInput">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Password Field */}
              <div className="form-field">
                <label htmlFor="PasswordInput">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* Remember me checkbox */}
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
                  <a href="/foregt-password">Forgot your password?</a>
                </div>
              </div>

              {/* Form Error */}
              {formError && <p className="error-message">{formError}</p>}

              <div className="action-part">
                <div className="signin-btn">
                  <button type="submit" disabled={loading}> {/* <--- DISABLE BUTTON */}
                    {loading ? ( // <--- CONDITIONAL RENDERING FOR SPINNER
                      <>
                        <span className="spinner"></span>
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
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