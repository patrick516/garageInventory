import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
      setMessage('Password reset email sent! Please check your inbox.');
      setStep(2);
    } catch (err) {
      setError('Error sending password reset email');
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      await axios.post(`http://localhost:3001/api/auth/reset-password/${token}`, { password });
      setMessage('Password has been reset successfully!');
      setStep(3);
    } catch (err) {
      setError('Error resetting password');
    }
  };

  return (
    <div className="forgot-password-container">
      {step === 1 && (
        <>
          <h2>Forgot Password</h2>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Send Reset Link</button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Reset Password</h2>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handlePasswordResetSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Reset Password</button>
          </form>
        </>
      )}

      {step === 3 && (
        <div>
          <h2>Password Reset Successful</h2>
          <button onClick={() => window.location.href = '/login'}>Go to Login</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
