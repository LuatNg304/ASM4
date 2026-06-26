import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout & Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import UserHome from './pages/UserHome';
import QuizDetail from './pages/QuizDetail';
import ArticleList from './pages/ArticleList';

// Admin Pages
import AdminHome from './pages/AdminHome';
import ManageQuestions from './pages/ManageQuestions';
import ManageQuizzes from './pages/ManageQuizzes';
import ManageArticles from './pages/ManageArticles';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      {/* Navbar will render automatically if user is authenticated */}
      <Navbar />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes (Guarded) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/quiz/:id"
          element={
            <ProtectedRoute>
              <QuizDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/articles"
          element={
            <ProtectedRoute>
              <ArticleList />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes (Guarded) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <AdminRoute>
              <ManageQuestions />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <AdminRoute>
              <ManageQuizzes />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/articles"
          element={
            <AdminRoute>
              <ManageArticles />
            </AdminRoute>
          }
        />

        {/* Fallback routing */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              user?.admin ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
