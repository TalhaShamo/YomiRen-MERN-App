import axios from 'axios'; //No need of axios because we replced it with api (Just mentioning here to remind myself)
import api from './api';

// The base URL of our backend API.
const API_URL = '/users/';

// Register a new user.
const register = async (userData) => {
  const response = await api.post(API_URL + 'register', userData);
  return response.data;
};

// Login a user.
const login = async (userData) => {
  const response = await api.post(API_URL + 'login', userData);

  // If the login is successful and we get data back...
  if (response.data) {
    // ...save the token to the browser's localStorage.
    localStorage.setItem('token', response.data.token);
    // ...also save the user object (we must convert it to a string first).
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

// Logout a user.
const logout = () => {
  // Clear the user's token and info from storage.
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Export all our functions.
const authService = {
  register,
  login,
  logout,
};

export default authService;