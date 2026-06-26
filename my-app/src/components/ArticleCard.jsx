import React from 'react';

const ArticleCard = ({ article }) => {
  return (
    <div className="card h-100 shadow-sm border-0 transition-all hover-shadow" style={{ borderRadius: '10px' }}>
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-secondary-subtle text-secondary px-3 py-1.5 rounded-pill" style={{ fontSize: '0.75rem' }}>
            {article.category}
          </span>
          <small className="text-muted" style={{ fontSize: '0.8rem' }}>
            <i className="bi bi-calendar3 me-1"></i> {article.date}
          </small>
        </div>
        <h3 className="card-title h5 fw-bold text-dark mb-2">{article.title}</h3>
        <p className="card-text text-secondary mb-4 flex-grow-1" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
          {article.content}
        </p>
        <div className="border-top pt-3 mt-auto">
          <small className="text-secondary">
            By <span className="fw-semibold text-dark">{article.author}</span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
