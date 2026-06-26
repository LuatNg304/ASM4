import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ArticleCard from '../components/ArticleCard';

const ArticleList = () => {
  const articles = useSelector((state) => state.articles.list);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories from articles list
  const categories = ['All', ...new Set(articles.map((art) => art.category))];

  // Filter based on category and search query
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-2">Technical Articles</h2>
        <p className="text-secondary">Explore expert insights, technical guides, and study tips written by our administrators.</p>
      </div>

      {/* Search and Filter Row */}
      <div className="row g-3 mb-5">
        {/* Search */}
        <div className="col-12 col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-secondary">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search articles by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat} Category
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid List */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-5 bg-light rounded shadow-sm border border-dashed">
          <i className="bi bi-search-heart text-muted mb-3" style={{ fontSize: '3rem' }}></i>
          <p className="text-secondary fs-5 mb-0">No articles matched your search and filter criteria.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredArticles.map((article) => (
            <div className="col-12 col-md-6 col-lg-4" key={article.id}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleList;
