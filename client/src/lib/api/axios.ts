import axios from 'axios';

/**
 * Axios Setup - API calls ke liye
 * Simple configuration file
 */

// Base URL - Relative URLs use karo (same domain pe API routes hain)
// Development: http://localhost:3000
// Production: https://fixora-red.vercel.app
// Empty baseURL = current domain use hoga automatically
const apiClient = axios.create({
  baseURL: '', // Empty = relative URLs (current domain use hoga)
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
