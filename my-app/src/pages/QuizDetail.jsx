import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizById, clearCurrentQuiz } from '../store/quizSlice';

const QuizDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentQuiz: quiz, loading, error } = useSelector((state) => state.quizzes);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIndex: optionIndex }
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    dispatch(fetchQuizById(id));
    return () => {
      dispatch(clearCurrentQuiz());
    };
  }, [dispatch, id]);

  const handleOptionChange = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex,
    });
  };

  const handleSubmitAnswer = () => {
    const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
    if (!isAnswered) return;

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate final score
      let calculatedScore = 0;
      quiz.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswerIndex) {
          calculatedScore += 1;
        }
      });
      setScore(calculatedScore);
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Quiz...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/dashboard" className="btn btn-primary mt-3">Back to Dashboard</Link>
      </div>
    );
  }

  if (!quiz) return null;

  const questions = quiz.questions || [];

  if (questions.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Empty Quiz</h2>
        <p className="text-secondary mb-4">This quiz has no questions.</p>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="container py-5 text-center">
        <h2 className="display-6 fw-semibold text-dark mb-3" style={{ fontSize: '2.5rem' }}>Quiz Completed</h2>
        <p className="fs-5 text-secondary mb-4">
          Your score: {score}
        </p>
        <button 
          onClick={handleRestart}
          className="btn btn-primary px-4 py-2"
          style={{ backgroundColor: '#0d6efd', border: 'none', borderRadius: '4px' }}
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isSelected = selectedAnswers[currentQuestionIndex] !== undefined;

  return (
    <div className="container py-5">
      {/* Centered Heading and Question */}
      <div className="text-center mb-4">
        <h2 className="fw-semibold text-dark mb-3" style={{ fontSize: '2.5rem' }}>Quiz</h2>
        <h3 className="fw-semibold text-dark mb-4" style={{ fontSize: '2rem' }}>
          {currentQuestion.text}
        </h3>
      </div>

      {/* Options (Left-aligned options inside a centered flex box) */}
      <div className="d-flex justify-content-center mb-4">
        <div style={{ minWidth: '220px', textAlign: 'left' }}>
          {currentQuestion.options?.map((option, optIdx) => (
            <div className="form-check mb-2" key={optIdx}>
              <input
                className="form-check-input"
                type="radio"
                name={`question-${currentQuestionIndex}`}
                id={`opt-${optIdx}`}
                checked={selectedAnswers[currentQuestionIndex] === optIdx}
                onChange={() => handleOptionChange(optIdx)}
                style={{ cursor: 'pointer' }}
              />
              <label 
                className="form-check-label ms-2 text-dark" 
                htmlFor={`opt-${optIdx}`}
                style={{ cursor: 'pointer', fontSize: '1rem' }}
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Centered Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmitAnswer}
          disabled={!isSelected}
          className="btn btn-primary px-4 py-2"
          style={{ backgroundColor: '#0d6efd', border: 'none', borderRadius: '4px' }}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default QuizDetail;
