import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';

const UseLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.get('/api/logout'); // Call the Laravel logout route
      localStorage.removeItem('candidate_id'); 
      navigate('/'); // Redirect to the login or home page
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return logout; // Return the logout function to use in components
};

export default UseLogout;
