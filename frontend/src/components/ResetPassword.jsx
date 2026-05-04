import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ otp: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/reset-password`, { email, ...formData });
      setSuccess('Password reset successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1>Reset Password</h1>
        <p>Enter OTP and your new password</p>
      </div>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>OTP Code</label>
          <input
            type="text"
            name="otp"
            className="form-control"
            placeholder="Enter 6-digit OTP"
            value={formData.otp}
            onChange={handleChange}
            maxLength="6"
            required
            style={{ textAlign: 'center', letterSpacing: '0.2rem' }}
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            className="form-control"
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading || success}>
          {loading ? <div className="loader"></div> : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
