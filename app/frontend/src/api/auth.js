import api from './index';

/**
 * Log in a user with credentials
 * @param {Object} credentials - Login credentials (email/username and password)
 * @returns {Promise} - Promise with the login response containing access token
 */
export const login = (credentials) => {
  console.log('Login API call with credentials:', credentials);
  
  // Create FormData for OAuth2 password flow
  const formData = new FormData();
  formData.append('username', credentials.email); // Backend expects username field
  formData.append('password', credentials.password);
  
  return api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Register a new user
 * @param {Object} userData - User data for registration
 * @returns {Promise} - Promise with the registration response
 */
export const register = (userData) => {
  console.log('Register API call with data:', userData);
  return api.post('/auth/register', userData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Get the current user's information
 * @returns {Promise} - Promise with the current user data
 */
export const getCurrentUser = () => {
  console.log('Getting current user data');
  return api.get('/auth/me');
};

/**
 * Log out the current user (client-side only for now)
 */
export const logout = () => {
  console.log('Logging out user');
  // Just a stub - we're handling logout on the client side by removing the token
  return Promise.resolve({ success: true });
};