import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/dashboard';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/data`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to fetch dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="auth-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="auth-card" style={{ maxWidth: '600px', width: '100%' }}>
      <div className="auth-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: 0 }}>Dashboard</h1>
        <button 
          onClick={handleLogout} 
          style={{ 
            background: 'transparent', 
            border: '1px solid var(--card-border)', 
            color: 'var(--text-secondary)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'white'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          Logout
        </button>
      </div>

      {error && <div className="message error">{error}</div>}

      <div style={{ background: 'var(--input-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Welcome, {data?.userEmail}
        </h3>
        
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>Recent Activity</h4>
          
          {(!data?.activities || data.activities.length === 0) ? (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              Data not found
            </div>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {data.activities.map((activity, index) => (
                <li 
                  key={index} 
                  style={{ 
                    padding: '0.75rem', 
                    borderBottom: index !== data.activities.length - 1 ? '1px solid var(--card-border)' : 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', background: 'var(--primary-color)', borderRadius: '50%', marginRight: '10px' }}></span>
                  {activity}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
