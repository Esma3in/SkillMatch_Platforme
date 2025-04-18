
import image from '../assets/BG (1).png';
import '../styles/signin.css';
import { useEffect, useState } from 'react';
import { api } from '../api/api';

export default function SignUp({ onToggle }) {

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First: get the CSRF token
      await api.get('/sanctum/csrf-cookie');
    
        // Then: send your secure POST request
        const response = await api.post('/api/store/candidate',{
          name: "yassine",
          dateInscription: "2005-07-12",
          files: "yassine.pdf" // Make sure this is actually a file, not just a string
        });
    
        console.log(response);
      } catch (err) {
        console.error('Error:', err.message);
      }
    };

    fetchData();
  }, []);
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
