import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/App.css';
import authService from '../services/authService';
import toastService from '../services/toastService';
import logo from '../assets/HyperfitLOGO.png';
import { useState } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if we have a code in the URL (Google OAuth callback)
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Handle the OAuth callback
      authService.handleGoogleCallback(code)
        .then((existed) => {
          if (existed) {
            navigate('/dashboard'); 
          } else {
            navigate('/personal-profile'); 
          }
        })
        .catch((error) => {
          toastService.showError('Error signing in');
        });
    }
  }, [location, navigate]);

  const handleGoogleLogin = () => {
    authService.googleLogin()
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authService.login(email, password)
      .then(() => {
        navigate('/dashboard');
      }).catch((error) => {
        toastService.showError("Error signing in");
      });
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Discover your AI-powered workout routine</h1>
        
        <div style={{ marginTop: '30px', marginBottom: '30px' }}>
          <img 
            src={logo} 
            alt="HyperFit Logo" 
            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px' }} 
          />
        </div>
        
        <form onSubmit={handleSubmit} style={{ width: '100%', marginBottom: '16px' }}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Sign In</button>

          <button 
            className="btn btn-outline" 
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} 
            onClick={handleGoogleLogin}
          >
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/google.svg" alt="Google" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
            Continue with Google
          </button>
        </form>
        
        <div style={{ marginTop: '20px', fontSize: '14px' }}>
          Don’t have an account? <Link to="/register" style={{ color: '#8A2BE2', textDecoration: 'none' }}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
