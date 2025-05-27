import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';

const UseLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Make the logout API call
      await api.get('/logout');
      
      // Clear all local storage items
      localStorage.removeItem('candidate_id');
      localStorage.removeItem('user_id');
      localStorage.removeItem('admin_id');
      localStorage.removeItem('token');
      localStorage.removeItem('user_role');
      
      // Clear any session storage items
      sessionStorage.clear();
      
      console.log('Logout successful');
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      
      // If the API call fails, still clear storage and redirect
      localStorage.clear();
      sessionStorage.clear();
      navigate('/');
    }
  };

  return logout;
};

export default UseLogout;
