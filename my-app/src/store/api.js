import axios from 'axios';

// Create custom Axios instance utilizing Vite environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export default api;
