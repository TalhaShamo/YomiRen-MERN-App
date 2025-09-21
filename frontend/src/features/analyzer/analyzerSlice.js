import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyzerService from '../../services/analyzerService';

// The initial state for our analyzer feature.
const initialState = {
  tokens: [], // This will hold the array of analyzed words from the backend. Different from token which is used for auth.
  isLoading: false,
  isError: false,
  message: '',
};

// The async "mission" to analyze a block of text.
export const analyzeText = createAsyncThunk(
  'analyzer/analyze',
  async (textData, thunkAPI) => {
    try {
      // Get the user's token from the auth state to make an authenticated request.
      const token = thunkAPI.getState().auth.token;
      return await analyzerService.analyzeText(textData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const analyzerSlice = createSlice({
  name: 'analyzer',
  initialState,
  reducers: {
    // A simple reducer to reset the state back to its initial values.
    reset: (state) => initialState,
  },
  // Handle the different states of our async mission.
  extraReducers: (builder) => {
    builder
      .addCase(analyzeText.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(analyzeText.fulfilled, (state, action) => {
        state.isLoading = false;
        // On success, store the array of tokens from the backend in our state.
        state.tokens = action.payload;
      })
      .addCase(analyzeText.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = analyzerSlice.actions;
export default analyzerSlice.reducer;