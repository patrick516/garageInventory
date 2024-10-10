import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import '../../assets/styles/Login.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Step 1: State for password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(username, password);
      if (response.token) {
        setPopupMessage('Login successful');
        setPopupType('success');
        navigate('/dashboard');
      } else {
        setPopupMessage(response.error);
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Login failed');
      setPopupType('error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {popupMessage && (
          <div className={`popup-message ${popupType}`}>
            {popupMessage}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-container"> {/* Step 2: Container for password input and eye icon */}
              <input
                type={isPasswordVisible ? 'text' : 'password'} // Update input type based on visibility state
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span 
                className="toggle-password" 
                onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Step 3: Toggle visibility
                role="button" 
                tabIndex={0} 
                onKeyDown={(e) => e.key === 'Enter' && setIsPasswordVisible(!isPasswordVisible)} // Accessibility
              >
                {isPasswordVisible ? '👁️' : '👁️‍🗨️'} {/* Eye icon representation */}
              </span>
            </div>
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="login-options">
          <p className="forgot-password-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
          <p className="register-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
