// RegisterPage.js
import React, { useState } from 'react';
import authService from '../services/authService';
import '../../assets/styles/Register.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!username || !email || !password || !confirmPassword) {
      setMessage({ text: 'All fields are required', type: 'error' });
      return;
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      setMessage({ text: "Passwords don't match", type: 'error' });
      return;
    }

    try {
      // Call the register function from authService with the correct parameters
      console.log('Sending registration request to backend...');
      const response = await authService.register(username, password, email);
      console.log('Registration successful:', response);

      setMessage({ text: 'Registration successful', type: 'success' });

      // Reset the form fields
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error occurred during registration:', error);

      // Check for specific error messages from the server
      if (error.response && error.response.data && error.response.data.message) {
        console.log('Backend error message:', error.response.data.message);
        if (error.response.data.message === 'Email already registered') {
          setMessage({ text: 'User already exists', type: 'error' });
        } else {
          setMessage({ text: 'Registration failed: ' + error.response.data.message, type: 'error' });
        }
      } else {
        setMessage({ text: 'Registration failed', type: 'error' });
        console.log('Generic registration failure.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register</h2>
        {message && (
          <div className={`popup-message ${message.type}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
