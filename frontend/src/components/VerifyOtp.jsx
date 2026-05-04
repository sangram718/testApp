import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/verify-otp`, { email, otp });
      setSuccess('Account verified successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1>Verify Email</h1>
        <p>We sent a 6-digit code to <strong>{email}</strong></p>
      </div>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Verification Code</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
            style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.25rem' }}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading || success}>
          {loading ? <div className="loader"></div> : 'Verify'}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
