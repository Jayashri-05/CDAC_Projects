import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await API.post('/auth/forgot-password', { email });
      setMessage('Your original password has been sent to your email address. Please check your inbox.');
      setMessageType('success');
    } catch (error) {
      const errorMessage = error.response?.data || 'An error occurred. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>🔐 Forgot Password</h1>
          <p>Enter your email address and we'll send you your original password.</p>
        </div>

        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          <div className="button-group">
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  <span className="button-icon">📤</span>
                  Send Original Password
                </>
              )}
            </button>

            <button
              type="button"
              className="back-button"
              onClick={handleBackToLogin}
              disabled={loading}
            >
              <span className="button-icon">←</span>
              Back to Login
            </button>
          </div>
        </form>

        <div className="forgot-password-footer">
          <p>Don't have an account? <span onClick={() => navigate('/register')} className="link">Sign up here</span></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 