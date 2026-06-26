import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchQuestions = createAsyncThunk(
  'questions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/questions');
      return response.data; // Array of questions
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const createQuestion = createAsyncThunk(
  'questions/create',
  async ({ text, options, keywords, correctAnswerIndex }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await api.post(
        '/questions',
        { text, options, keywords, correctAnswerIndex },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create question');
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'questions/update',
  async ({ id, text, options, keywords, correctAnswerIndex }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await api.put(
        `/questions/${id}`,
        { text, options, keywords, correctAnswerIndex },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || 'Failed to update question');
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'questions/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await api.delete(`/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete question');
    }
  }
);

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    clearQuestionError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(q => q._id !== action.payload);
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearQuestionError } = questionSlice.actions;
export default questionSlice.reducer;
