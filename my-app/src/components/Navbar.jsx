import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.admin;

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login');
    });
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active text-primary fw-bold' : 'text-secondary';
  };

  return (
    <div className="container mt-4 mb-4">
      {/* Top Header Row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h2 fw-bold text-dark m-0">
          {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
        </h1>
        <div className="text-secondary fs-6">
          Welcome, <span className="fw-semibold text-dark">{user.username}</span>
        </div>
      </div>

      {/* Secondary Navigation Menu Bar */}
      <div className="bg-light rounded p-3 d-flex align-items-center shadow-sm">
        <div className="d-flex gap-4 m-0 p-0 list-unstyled align-items-center flex-wrap">
          {isAdmin ? (
            <>
              <Link 
                to="/admin" 
                className={`text-decoration-none px-2 py-1 transition-all ${isActive('/admin')}`}
              >
                Home
              </Link>
              <Link 
                to="/admin/questions" 
                className={`text-decoration-none px-2 py-1 transition-all ${isActive('/admin/questions')}`}
              >
                Manage Questions
              </Link>
              <Link 
                to="/admin/quizzes" 
                className={`text-decoration-none px-2 py-1 transition-all ${isActive('/admin/quizzes')}`}
              >
                Manage Quizzes
              </Link>
              <Link 
                to="/admin/articles" 
                className={`text-decoration-none px-2 py-1 transition-all ${isActive('/admin/articles')}`}
              >
                Manage Articles
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className={`text-decoration-none px-2 py-1 transition-all ${isActive('/dashboard')}`}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className={`text-decoration-none px-2 py-1 transition-all ${isActive('/dashboard/quiz')}`}
              >
                Quiz
              </Link>
              <Link 
                to="/dashboard/articles" 
                className={`text-decoration-none px-2 py-1 transition-all ${isActive('/dashboard/articles')}`}
              >
                Article
              </Link>
            </>
          )}
          <button 
            onClick={handleLogout}
            className="btn btn-link text-decoration-none text-secondary p-0 px-2 py-1 border-0 m-0 align-baseline transition-all"
            style={{ fontSize: 'inherit' }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
