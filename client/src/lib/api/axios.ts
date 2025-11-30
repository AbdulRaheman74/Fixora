import axios from 'axios';

/**
 * Axios Setup - API calls ke liye
 * Simple configuration file
 */

// Base URL - localhost par API chal rahi hai
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // API ka address
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookies automatically bhejne ke liye
});

// Error handling - agar API se error aaye
apiClient.interceptors.response.use(
  (response) => response, // Success case - directly return karo
  (error) => {
    // Error case - error message return karo
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ error: 'Network error' });
  }
);

export default apiClient;
