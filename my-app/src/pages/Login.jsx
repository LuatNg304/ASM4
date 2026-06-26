import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../store/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear errors on page mount
    dispatch(clearError());
    setValidationError('');
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.admin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!username.trim()) {
      setValidationError('Username is required');
      return;
    }
    if (username.length < 3) {
      setValidationError('Username must be at least 3 characters long');
      return;
    }
    if (!password) {
      setValidationError('Password is required');
      return;
    }
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    dispatch(loginUser({ username, password }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm border-0 p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}>
        <h2 className="text-center fw-bold mb-4 text-dark fs-3">Login</h2>
        
        {validationError && (
          <div className="alert alert-danger py-2 px-3 mb-3" role="alert" style={{ fontSize: '0.9rem' }}>
            {validationError}
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger py-2 px-3 mb-3" role="alert" style={{ fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control py-2"
              placeholder="John"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              style={{ borderRadius: '6px', border: '1px solid #ced4da' }}
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>
              Password
            </label>
            <div className="position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-control py-2 pe-5"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{ borderRadius: '6px', border: '1px solid #ced4da' }}
              />
              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-secondary py-0 px-3"
                onClick={() => setShowPassword(!showPassword)}
                style={{ zIndex: 5 }}
              >
                <i className={`bi bi-eye${showPassword ? '-slash' : ''}`} style={{ fontSize: '1.1rem' }}></i>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold mb-3"
            disabled={loading}
            style={{ borderRadius: '6px', backgroundColor: '#0d6efd', border: 'none' }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            Login
          </button>
        </form>

        <div className="text-center mt-2">
          <Link to="/register" className="text-primary text-decoration-none" style={{ fontSize: '0.9rem' }}>
            Don't have an account? Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
