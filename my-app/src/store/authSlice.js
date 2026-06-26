import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';

// Helper to load state from localStorage
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');
const storedRefreshToken = localStorage.getItem('refreshToken');

const initialState = {
  isAuthenticated: !!storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  refreshToken: storedRefreshToken || null,
  loading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Express backend POST /users/login
      const response = await api.post('/users/login', { username, password });
      
      const { result, user } = response.data;
      
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('refreshToken', result.refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token: result.access_token, refreshToken: result.refresh_token, user };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[Object.keys(err.response?.data?.errors)[0]]?.msg || 'Login failed';
      return rejectWithValue(errorMsg);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, password, confirmPassword, admin }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/register', {
        username,
        password,
        confirmPassword,
        admin,
      });
      
      const { result } = response.data;
      
      // Since registration returns token, treat it as successful auto-login
      const user = { username, admin: !!admin };
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('refreshToken', result.refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token: result.access_token, refreshToken: result.refresh_token, user };
    } catch (err) {
      // Extract error from express-validator format or custom message
      let errorMsg = 'Registration failed';
      if (err.response?.data?.error?.errors) {
        const errors = err.response.data.error.errors;
        const keys = Object.keys(errors);
        if (keys.length > 0) {
          errorMsg = errors[keys[0]].msg || errors[keys[0]].message || errorMsg;
        }
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    try {
      const { auth } = getState();
      if (auth.token && auth.refreshToken) {
        await api.post('/users/logout', 
          { refreshToken: auth.refreshToken },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          }
        );
      }
    } catch (err) {
      console.error('Logout error on backend:', err);
    } finally {
      // Always clear local storage even if API logout fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
