import { createSlice } from '@reduxjs/toolkit';

const defaultArticles = [
  {
    id: '1',
    title: 'Introduction to React and Redux',
    content: 'React is a popular library for building user interfaces, and Redux is a predictable state container for JavaScript apps. Together, they form a powerful combination for building structured, scalable frontend applications. This article covers the basics of actions, reducers, and the store...',
    category: 'Technology',
    date: '2026-06-15',
    author: 'Admin Mary'
  },
  {
    id: '2',
    title: 'Top 10 Tips for Passing Your Tech Quizzes',
    content: 'Taking quizzes is a great way to test your understanding of core programming concepts. Here are ten crucial tips: read questions carefully, eliminate obviously wrong options, focus on syntax subtleties, practice writing short snippets, and manage your time effectively during online assessments...',
    category: 'Education',
    date: '2026-06-20',
    author: 'Admin Mary'
  },
  {
    id: '3',
    title: 'Understanding MongoDB Document Modeling',
    content: 'Unlike SQL databases, MongoDB stores data in flexible, JSON-like documents. When modeling relationships such as quizzes and questions, you have to decide between embedding and referencing. Referencing is great when documents are large or edited independently, as we see in ASM4 schemas...',
    category: 'Database',
    date: '2026-06-22',
    author: 'Admin Mary'
  }
];

const loadArticles = () => {
  const stored = localStorage.getItem('articles');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem('articles', JSON.stringify(defaultArticles));
  return defaultArticles;
};

const initialState = {
  list: loadArticles(),
  loading: false,
  error: null,
};

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    addArticle: (state, action) => {
      const newArticle = {
        ...action.payload,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      };
      state.list.push(newArticle);
      localStorage.setItem('articles', JSON.stringify(state.list));
    },
    updateArticle: (state, action) => {
      const index = state.list.findIndex(art => art.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
        localStorage.setItem('articles', JSON.stringify(state.list));
      }
    },
    deleteArticle: (state, action) => {
      state.list = state.list.filter(art => art.id !== action.payload);
      localStorage.setItem('articles', JSON.stringify(state.list));
    }
  }
});

export const { addArticle, updateArticle, deleteArticle } = articleSlice.actions;
export default articleSlice.reducer;
