import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// 1. Define the initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// 2. Create the Async Thunks (the "missions")
export const register = createAsyncThunk(
  'auth/register', // The name of the mission
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login', // The name of this mission
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3. Create the slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // A regular reducer for resetting state on logout or error
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  // 4. Handle the mission states with extraReducers
  extraReducers: (builder) => {
    builder
      // Register mission
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        // The user is registered but not logged in, so we don't set user/token here
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // The error message from our thunk
      })
      // Login mission
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload.token; // The token from our login service
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;