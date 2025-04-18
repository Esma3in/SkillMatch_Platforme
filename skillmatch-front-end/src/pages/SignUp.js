import image from '../assets/BG (1).png';
import '../styles/pages/Sign/signin.css';
import { useState } from 'react';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function SignUp({ onToggle }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });


  const navigate = useNavigate(); // ✅ Doit être ici

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

      const response = await api.post('/api/store/candidate', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      console.log('Server response:', response);
      return response.data
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const session_id = await fetchData();
      if(session_id){
        navigate(`/candidate/Session/${session_id}`);
      }else{console.log(session_id)}
       // ✅ Navigation directe
    } catch (err) {
      console.error('Signup failed:', err.message);
    }
  };

  return (
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
                <label htmlFor="FullNameInput">Name</label>
                <input
                  type="text"
                  id="FullNameInput"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
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
              </div>
          
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
