import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000',  // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');  // Get the token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Add token to the Authorization header
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
