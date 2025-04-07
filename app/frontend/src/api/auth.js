import api from './index';

/**
 * Authentication API module for handling user authentication operations.
 * @module auth
 */

/**
 * Log in a user with credentials
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} - Promise that resolves to the login response containing access token
 * @throws {Error} - If login fails
 * @example
 * // Example usage
 * login({ email: 'user@example.com', password: 'password123' })
 *   .then(response => {
 *     // Handle successful login
 *     console.log('Login successful', response.data);
 *   })
 *   .catch(error => {
 *     // Handle login error
 *     console.error('Login failed', error);
 *   });
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
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} [userData.firstName] - User's first name (optional)
 * @param {string} [userData.lastName] - User's last name (optional)
 * @returns {Promise<Object>} - Promise that resolves to the registration response
 * @throws {Error} - If registration fails
 * @example
 * // Example usage
 * register({ 
 *   email: 'newuser@example.com', 
 *   password: 'password123',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * })
 *   .then(response => {
 *     // Handle successful registration
 *     console.log('Registration successful', response.data);
 *   })
 *   .catch(error => {
 *     // Handle registration error
 *     console.error('Registration failed', error);
 *   });
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
 * @returns {Promise<Object>} - Promise that resolves to the current user data
 * @throws {Error} - If the request fails or user is not authenticated
 * @example
 * // Example usage
 * getCurrentUser()
 *   .then(user => {
 *     // Handle user data
 *     console.log('Current user:', user.data);
 *   })
 *   .catch(error => {
 *     // Handle error
 *     console.error('Failed to get user data', error);
 *   });
 */
export const getCurrentUser = () => {
  console.log('Getting current user data');
  return api.get('/auth/me');
};

/**
 * Log out the current user (client-side only for now)
 * @returns {Promise<Object>} - Promise that resolves to a success object
 * @example
 * // Example usage
 * logout()
 *   .then(() => {
 *     // Handle successful logout
 *     console.log('User logged out successfully');
 *   })
 *   .catch(error => {
 *     // Handle logout error
 *     console.error('Logout failed', error);
 *   });
 */
export const logout = () => {
  console.log('Logging out user');
  // Just a stub - we're handling logout on the client side by removing the token
  return Promise.resolve({ success: true });
};