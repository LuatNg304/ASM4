import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../store/quizSlice';
import QuizCard from '../components/QuizCard';

const UserHome = () => {
  const dispatch = useDispatch();
  const { list: quizzes, loading, error } = useSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
    

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark m-0">Available Quizzes</h2>
        <span className="text-secondary fw-semibold">{quizzes.length} {quizzes.length === 1 ? 'Quiz' : 'Quizzes'}</span>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-5 bg-light rounded shadow-sm border border-dashed">
          <i className="bi bi-journal-x text-muted mb-3" style={{ fontSize: '3rem' }}></i>
          <p className="text-secondary fs-5 mb-0">No quizzes available at the moment. Please check back later!</p>
        </div>
      ) : (
        <div className="row g-4">
          {quizzes.map((quiz) => (
            <div className="col-12 col-md-6 col-lg-4" key={quiz._id}>
              <QuizCard quiz={quiz} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserHome;
