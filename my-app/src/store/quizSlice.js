import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';

const initialState = {
  list: [],
  currentQuiz: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/quizzes');
      return response.data; // Array of quizzes populated with questions
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch quizzes');
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  'quizzes/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/quizzes/${id}`);
      return response.data; // Quiz populated with questions
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch quiz');
    }
  }
);

export const createQuiz = createAsyncThunk(
  'quizzes/create',
  async ({ title, description, questions }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await api.post(
        '/quizzes',
        { title, description, questions },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create quiz');
    }
  }
);

export const updateQuiz = createAsyncThunk(
  'quizzes/update',
  async ({ id, title, description, questions }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await api.put(
        `/quizzes/${id}`,
        { title, description, questions },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update quiz');
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'quizzes/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await api.delete(`/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete quiz');
    }
  }
);

const quizSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
    clearQuizError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch By Id
      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update
      .addCase(updateQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentQuiz?._id === action.payload._id) {
          state.currentQuiz = action.payload;
        }
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete
      .addCase(deleteQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(q => q._id !== action.payload);
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentQuiz, clearQuizError } = quizSlice.actions;
export default quizSlice.reducer;
