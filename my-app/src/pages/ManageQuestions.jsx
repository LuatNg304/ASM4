import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions, createQuestion, updateQuestion, deleteQuestion, clearQuestionError } from '../store/questionSlice';

const ManageQuestions = () => {
  const dispatch = useDispatch();
  const { list: questions, loading, error } = useSelector((state) => state.questions);

  // Form State - exactly 4 options matching the mockup screenshot
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']); 
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [keywords, setKeywords] = useState(''); // kept for schema capability (can default to empty)

  const [formValidationError, setFormValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const handleOptionChange = (value, index) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const resetForm = () => {
    setText('');
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
    setKeywords('');
    setIsEditing(false);
    setCurrentId(null);
    setFormValidationError('');
    dispatch(clearQuestionError());
  };

  const handleEditClick = (q) => {
    setIsEditing(true);
    setCurrentId(q._id);
    setText(q.text);
    // Pad options array to exactly 4 if needed
    const qOpts = q.options || [];
    const paddedOpts = ['', '', '', ''];
    for (let i = 0; i < 4; i++) {
      paddedOpts[i] = qOpts[i] || '';
    }
    setOptions(paddedOpts);
    setCorrectAnswerIndex(q.correctAnswerIndex || 0);
    setKeywords(q.keywords ? q.keywords.join(', ') : '');
    setFormValidationError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      dispatch(deleteQuestion(id)).then((res) => {
        if (!res.error) {
          showSuccess('Question deleted successfully!');
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
    dispatch(clearQuestionError());

    // Validation
    if (!text.trim()) {
      setFormValidationError('Question Text is required.');
      return;
    }

    // Verify all 4 options are filled
    const cleanOptions = options.map(o => o.trim());
    if (cleanOptions.some(o => o === '')) {
      setFormValidationError('Please fill out all 4 option fields.');
      return;
    }

    if (isNaN(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex >= 4) {
      setFormValidationError('Correct Answer Index must be a number between 0 and 3.');
      return;
    }

    const keywordArray = keywords
      ? keywords.split(',').map(k => k.trim()).filter(k => k !== '')
      : [];

    const questionData = {
      text: text.trim(),
      options: cleanOptions,
      correctAnswerIndex: parseInt(correctAnswerIndex),
      keywords: keywordArray,
    };

    if (isEditing) {
      dispatch(updateQuestion({ id: currentId, ...questionData })).then((res) => {
        if (!res.error) {
          showSuccess('Question updated successfully!');
          resetForm();
        }
      });
    } else {
      dispatch(createQuestion(questionData)).then((res) => {
        if (!res.error) {
          showSuccess('Question added successfully!');
          resetForm();
        }
      });
    }
  };

  return (
    <div className="container py-4">
      {/* Page Heading */}
      <h2 className="fw-bold text-dark mb-4">Questions</h2>

      {successMessage && (
        <div className="alert alert-success py-2 px-3 mb-4" role="alert">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-danger py-2 px-3 mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Creator Form Container (Horizontal Form Layout) */}
      <div className="card shadow-sm border-light mb-5" style={{ borderRadius: '4px' }}>
        <div className="card-body p-4">
          {formValidationError && (
            <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
              {formValidationError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Question Text */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label text-secondary" style={{ fontSize: '0.95rem' }}>
                Question Text:
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>

            {/* Options */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label text-secondary pt-2" style={{ fontSize: '0.95rem' }}>
                Options:
              </label>
              <div className="col-sm-10 d-flex flex-column gap-2">
                {options.map((option, idx) => (
                  <input
                    key={idx}
                    type="text"
                    className="form-control"
                    placeholder=""
                    value={option}
                    onChange={(e) => handleOptionChange(e.target.value, idx)}
                  />
                ))}
              </div>
            </div>

            {/* Correct Answer Index */}
            <div className="row mb-4 align-items-center">
              <label className="col-sm-2 col-form-label text-secondary" style={{ fontSize: '0.95rem' }}>
                Correct Answer Index:
              </label>
              <div className="col-sm-10">
                <input
                  type="number"
                  min="0"
                  max="3"
                  className="form-control"
                  value={correctAnswerIndex}
                  onChange={(e) => setCorrectAnswerIndex(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
              style={{ backgroundColor: '#0d6efd', border: 'none', borderRadius: '4px' }}
            >
              {isEditing ? 'Save Question' : 'Add Question'}
            </button>
          </form>
        </div>
      </div>

      {/* List of Questions */}
      <div className="d-flex flex-column gap-4">
        {loading && questions.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <p className="text-secondary mb-0">No questions available. Create one using the form above.</p>
          </div>
        ) : (
          questions.map((q) => (
            <div key={q._id} className="card shadow-sm border-light" style={{ borderRadius: '4px' }}>
              <div className="card-body p-4">
                {/* Question Title */}
                <h3 className="h4 fw-semibold text-dark mb-3">{q.text}</h3>

                {/* Option Bullets list */}
                <ul className="mb-4">
                  {q.options?.map((opt, oIdx) => (
                    <li key={oIdx} className="text-secondary mb-1" style={{ fontSize: '0.95rem' }}>
                      {opt}
                    </li>
                  ))}
                </ul>

                {/* Warning and Danger Buttons */}
                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleEditClick(q)}
                    className="btn btn-warning text-dark px-4"
                    style={{ borderRadius: '4px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(q._id)}
                    className="btn btn-danger px-4"
                    style={{ borderRadius: '4px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageQuestions;
