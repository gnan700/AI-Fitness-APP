import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      // You might want to redirect to login page here
    }
    return Promise.reject(error);
  }
);

// Basic user service methods
const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      localStorage.setItem('token', response.data);
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api({
        method: 'post',
        url: '/api/v1/auth/register',
        data: userData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      localStorage.setItem('token', response.data);
    } catch (error) {
      throw error;
    }
  },

  googleLogin: () => {
    // Redirect to the backend's Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/v1/auth/google`;
  },

  // Handle the OAuth callback
  handleGoogleCallback: async (code) => {
    try {
      const response = await api.post('/api/v1/auth/google/callback', { code });
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        return response.data.existed;
      }
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default authService;