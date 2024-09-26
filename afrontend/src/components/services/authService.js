import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth'; // Ensure this is correct

// Register a new user
const register = async (username, password, email) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password, email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

// Login a user
const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user info
    }
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || 'Login failed' };
  }
};


// Logout a user
const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Get the current logged-in user
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
