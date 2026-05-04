import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Log in to your account</p>
      </div>

      {error && <div className="message error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label>Password</label>
            <Link to="/forgot-password" style={{ fontSize: '0.8rem' }} className="auth-link">Forgot password?</Link>
          </div>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <div className="loader"></div> : 'Log In'}
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
