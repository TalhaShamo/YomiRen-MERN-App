import axios from 'axios';
import { store } from '../app/store'; // Import our Redux store
import { logout } from '../features/auth/authSlice'; // Import the logout action

// Create a new Axios instance with a base URL.
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// --- THIS IS THE INTERCEPTOR ---
// This code block runs on every single response that comes back from our backend.
api.interceptors.response.use(
  // The first function runs if the response is successful (status 2xx).
  // We just pass the response through without touching it.
  (res) => res,

  // The second function runs if the response has an error (status 4xx or 5xx).
  (err) => {
    // We check specifically for a 401 Unauthorized error.
    if (err.response.status === 401) {
      // If we get a 401, it means our token is expired or invalid.
      // We dispatch our global logout action.
      console.log('Auth error detected. Logging out...');
      store.dispatch(logout());
    }
    // We must return the rejected promise so that component-level .catch() blocks still work.
    return Promise.reject(err);
  }
);

export default api;