import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes, createQuiz, updateQuiz, deleteQuiz, clearQuizError } from '../store/quizSlice';
import { fetchQuestions } from '../store/questionSlice';

const ManageQuizzes = () => {
  const dispatch = useDispatch();
  const { list: quizzes, loading: quizLoading, error: quizError } = useSelector((state) => state.quizzes);
  const { list: questions, loading: questionLoading } = useSelector((state) => state.questions);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]); // Array of question IDs

  const [formValidationError, setFormValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchQuestions());
  }, [dispatch]);

  const handleCheckboxChange = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleSelectAllQuestions = () => {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([]); // Unselect all
    } else {
      setSelectedQuestions(questions.map(q => q._id)); // Select all
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedQuestions([]);
    setIsEditing(false);
    setCurrentId(null);
    setFormValidationError('');
    dispatch(clearQuizError());
  };

  const handleEditClick = (quiz) => {
    setIsEditing(true);
    setCurrentId(quiz._id);
    setTitle(quiz.title);
    setDescription(quiz.description);
    // Map to array of ObjectIds
    setSelectedQuestions(quiz.questions ? quiz.questions.map(q => typeof q === 'object' ? q._id : q) : []);
    setFormValidationError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      dispatch(deleteQuiz(id)).then((res) => {
        if (!res.error) {
          showSuccess('Quiz deleted successfully!');
        }
      });
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormValidationError('');
    dispatch(clearQuizError());

    // Validation
    if (!title.trim()) {
      setFormValidationError('Quiz Title is required.');
      return;
    }
    if (!description.trim()) {
      setFormValidationError('Quiz Description is required.');
      return;
    }
    if (selectedQuestions.length === 0) {
      setFormValidationError('Please select at least one question to bundle in this quiz.');
      return;
    }

    const quizData = {
      title: title.trim(),
      description: description.trim(),
      questions: selectedQuestions,
    };

    if (isEditing) {
      dispatch(updateQuiz({ id: currentId, ...quizData })).then((res) => {
        if (!res.error) {
          showSuccess('Quiz updated successfully!');
          resetForm();
        }
      });
    } else {
      dispatch(createQuiz(quizData)).then((res) => {
        if (!res.error) {
          showSuccess('Quiz created successfully!');
          resetForm();
        }
      });
    }
  };

  return (
    <div className="container py-4">
      {/* Page Heading */}
      <h2 className="fw-bold text-dark mb-4">Quizzes</h2>

      {successMessage && (
        <div className="alert alert-success py-2 px-3 mb-4" role="alert">
          {successMessage}
        </div>
      )}

      {quizError && (
        <div className="alert alert-danger py-2 px-3 mb-4" role="alert">
          {quizError}
        </div>
      )}

      {/* Quiz Creator/Editor (Horizontal Form Layout in Card) */}
      <div className="card shadow-sm border-light mb-5" style={{ borderRadius: '4px' }}>
        <div className="card-body p-4">
          {formValidationError && (
            <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
              {formValidationError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Quiz Title */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label text-secondary" style={{ fontSize: '0.95rem' }}>
                Quiz Title:
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* Quiz Description */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label text-secondary pt-2" style={{ fontSize: '0.95rem' }}>
                Quiz Description:
              </label>
              <div className="col-sm-10">
                <textarea
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Questions List Checkbox Selection */}
            <div className="row mb-4">
              <div className="col-sm-2 col-form-label text-secondary pt-2" style={{ fontSize: '0.95rem' }}>
                Questions:
                {questions.length > 0 && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={handleSelectAllQuestions}
                      className="btn btn-link text-decoration-none p-0 text-primary"
                      style={{ fontSize: '0.8rem' }}
                    >
                      {selectedQuestions.length === questions.length ? 'Unselect All' : 'Select All'}
                    </button>
                  </div>
                )}
              </div>
              <div className="col-sm-10">
                <div 
                  className="border rounded p-3 bg-light overflow-y-auto" 
                  style={{ maxHeight: '220px', borderRadius: '6px' }}
                >
                  {questionLoading ? (
                    <div className="d-flex justify-content-center align-items-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                    </div>
                  ) : questions.length === 0 ? (
                    <div className="text-center py-3 text-secondary" style={{ fontSize: '0.85rem' }}>
                      No questions available. Please create questions first in the Question Bank.
                    </div>
                  ) : (
                    questions.map((q) => {
                      const isChecked = selectedQuestions.includes(q._id);
                      return (
                        <div key={q._id} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={q._id}
                            id={`check-${q._id}`}
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(q._id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <label 
                            className="form-check-label ms-1 text-dark" 
                            htmlFor={`check-${q._id}`}
                            style={{ fontSize: '0.9rem', cursor: 'pointer' }}
                          >
                            {q.text}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={quizLoading}
                style={{ backgroundColor: '#0d6efd', border: 'none', borderRadius: '4px' }}
              >
                {isEditing ? 'Save Quiz' : 'Add Quiz'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-outline-secondary px-4"
                  style={{ borderRadius: '4px' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Quiz List Catalog */}
      <div className="card shadow-sm border-light" style={{ borderRadius: '4px' }}>
        <div className="card-body p-4">
          <h3 className="h5 fw-bold text-dark mb-4">Quiz Catalog</h3>

          {quizLoading && quizzes.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-5 border border-dashed rounded bg-light">
              <p className="text-secondary mb-0">No quizzes assembled. Create one using the form above.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr className="table-light">
                    <th scope="col" style={{ width: '40%' }}>Title / Description</th>
                    <th scope="col" style={{ width: '25%' }} className="text-center">Questions Count</th>
                    <th scope="col" style={{ width: '35%' }} className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => {
                    const count = quiz.questions?.length || 0;
                    return (
                      <tr key={quiz._id}>
                        <td>
                          <div className="fw-bold text-dark">{quiz.title}</div>
                          <small className="text-secondary d-block">
                            {quiz.description}
                          </small>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-primary px-2.5 py-1.5 rounded-pill">
                            {count} questions
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => handleEditClick(quiz)}
                            className="btn btn-warning text-dark btn-sm me-2 py-1 px-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(quiz._id)}
                            className="btn btn-danger btn-sm py-1 px-3"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageQuizzes;
