import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addArticle, updateArticle, deleteArticle } from '../store/articleSlice';

const ManageArticles = () => {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articles.list);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Admin Mary'); // Default author for simplicity

  const [formValidationError, setFormValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resetForm = () => {
    setTitle('');
    setCategory('Technology');
    setContent('');
    setIsEditing(false);
    setCurrentId(null);
    setFormValidationError('');
  };

  const handleEditClick = (art) => {
    setIsEditing(true);
    setCurrentId(art.id);
    setTitle(art.title);
    setCategory(art.category);
    setContent(art.content);
    setAuthor(art.author || 'Admin Mary');
    setFormValidationError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      dispatch(deleteArticle(id));
      showSuccess('Article deleted successfully!');
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormValidationError('');

    if (!title.trim()) {
      setFormValidationError('Article title is required.');
      return;
    }
    if (!content.trim()) {
      setFormValidationError('Article content is required.');
      return;
    }

    const articleData = {
      title: title.trim(),
      category: category.trim(),
      content: content.trim(),
      author: author.trim(),
    };

    if (isEditing) {
      dispatch(updateArticle({ id: currentId, ...articleData }));
      showSuccess('Article updated successfully!');
      resetForm();
    } else {
      dispatch(addArticle(articleData));
      showSuccess('Article created successfully!');
      resetForm();
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark m-0">Article Publisher</h2>
        <p className="text-secondary">Publish and manage guidelines, tutorials, and tips for your students.</p>
      </div>

      {successMessage && (
        <div className="alert alert-success py-2 px-3 mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMessage}
        </div>
      )}

      <div className="row g-4">
        {/* Form Column */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '10px' }}>
            <h3 className="h5 fw-bold text-dark mb-4">
              {isEditing ? 'Edit Article' : 'Write New Article'}
            </h3>

            {formValidationError && (
              <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
                {formValidationError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>
                  Article Title
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. Master Node.js Event Loop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ borderRadius: '6px' }}
                />
              </div>

              {/* Category */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>
                  Category
                </label>
                <select
                  className="form-select form-select-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ borderRadius: '6px' }}
                >
                  <option value="Technology">Technology</option>
                  <option value="Database">Database</option>
                  <option value="Education">Education</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Content */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>
                  Article Content
                </label>
                <textarea
                  className="form-control"
                  rows="6"
                  placeholder="Write the full content of the article here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ borderRadius: '6px' }}
                />
              </div>

              {/* Author */}
              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>
                  Author Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  style={{ borderRadius: '6px' }}
                />
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className={`btn btn-${isEditing ? 'success' : 'primary'} w-100 py-2 fw-semibold`}
                  style={{ borderRadius: '6px' }}
                >
                  {isEditing ? 'Save Changes' : 'Publish Article'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-outline-secondary w-100 py-2 fw-semibold"
                    style={{ borderRadius: '6px' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '10px' }}>
            <h3 className="h5 fw-bold text-dark mb-4">Published Articles</h3>

            {articles.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-file-earmark-x text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="text-secondary mt-2 mb-0">No articles published. Write one using the left editor panel.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr className="table-light">
                      <th scope="col" style={{ width: '45%' }}>Title</th>
                      <th scope="col" style={{ width: '25%' }}>Category</th>
                      <th scope="col" style={{ width: '30%' }} className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((art) => (
                      <tr key={art.id}>
                        <td>
                          <div className="fw-bold text-dark">{art.title}</div>
                          <small className="text-muted d-block">{art.date} | By {art.author}</small>
                        </td>
                        <td>
                          <span className="badge bg-secondary-subtle text-secondary rounded-pill px-2.5 py-1">
                            {art.category}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => handleEditClick(art)}
                            className="btn btn-outline-primary btn-sm me-2 py-1 px-2.5"
                          >
                            <i className="bi bi-pencil-square me-1"></i> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(art.id)}
                            className="btn btn-outline-danger btn-sm py-1 px-2.5"
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageArticles;
