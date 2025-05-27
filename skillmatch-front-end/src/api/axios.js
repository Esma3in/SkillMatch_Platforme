import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Important for handling cookies (CSRF)
});

// Request interceptor for API calls
api.interceptors.request.use(
  async config => {
    // You can modify request config here (e.g., add auth tokens)
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  response => {
    // You can modify successful responses here
    return response;
  },
  async error => {
    // Handle server errors
    console.error('API response error:', error);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status code
      if (error.response.status === 401) {
        // Unauthorized - could redirect to login
        console.log('Authentication required');
      }
      
      if (error.response.status === 419) {
        // CSRF token mismatch - get a fresh token
        try {
          await axios.get('http://localhost:8000/api/sanctum/csrf-cookie');
          // Retry the original request
          return api(error.config);
        } catch (e) {
          console.error('Failed to refresh CSRF token', e);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 