import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  const questionCount = quiz.questions?.length || 0;

  return (
    <div className="card h-100 shadow-sm border-0 transition-all hover-shadow" style={{ borderRadius: '10px' }}>
      <div className="card-body d-flex flex-column p-4">
        <h3 className="card-title h5 fw-bold text-dark mb-2">{quiz.title}</h3>
        <p className="card-text text-secondary mb-4 flex-grow-1" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
          {quiz.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill" style={{ fontSize: '0.8rem' }}>
            <i className="bi bi-question-circle me-1"></i> {questionCount} {questionCount === 1 ? 'Question' : 'Questions'}
          </span>
          <Link 
            to={`/dashboard/quiz/${quiz._id}`} 
            className="btn btn-primary px-4 py-2 fw-semibold"
            style={{ borderRadius: '6px' }}
          >
            Start Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
