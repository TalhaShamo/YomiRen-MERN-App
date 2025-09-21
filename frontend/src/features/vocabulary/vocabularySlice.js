import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vocabularyService from '../../services/vocabularyService';

const initialState = {
  words: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Async Thunk for getting user's words
export const getWords = createAsyncThunk(
  'vocabulary/getAll',
  async (_, thunkAPI) => {
    try {
      // We need the token to make an authenticated request.
      // We can get the token from our auth slice's state.
      const token = thunkAPI.getState().auth.token;
      return await vocabularyService.getWords(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async Thunk for getting only the words due for review.
export const getReviewWords = createAsyncThunk(
  'vocabulary/getReview',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await vocabularyService.getReviewWords(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async Thunk for creating a new word
export const createWord = createAsyncThunk(
  'vocabulary/create',
  async (wordData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await vocabularyService.createWord(wordData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteWord = createAsyncThunk(
  'vocabulary/delete',
  async (wordId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await vocabularyService.deleteWord(wordId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Updating next interval for word review
export const updateWordReview = createAsyncThunk(
  'vocabulary/updateReview',
  async ({ wordId, rating }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await vocabularyService.updateWordReview(wordId, rating, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async Thunk for getting only the count of words due for review.
export const getReviewCount = createAsyncThunk(
  'vocabulary/getReviewCount',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await vocabularyService.getReviewCount(token);
    } catch (error) {
      console.error('Could not fetch review count:', error);
      return thunkAPI.rejectWithValue('Could not fetch review count.');
    }
  }
);

export const vocabularySlice = createSlice({
  name: 'vocabulary',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Words cases
      .addCase(getWords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.words = action.payload; // The words from our backend
      })
      .addCase(getWords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Review Words cases
      .addCase(getReviewWords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviewWords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.words = action.payload;
      })
      .addCase(getReviewWords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Word cases
      .addCase(createWord.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(createWord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Add the new word to our existing 'words' array in the state
        state.words.push(action.payload);
      })
      .addCase(createWord.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(deleteWord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteWord.fulfilled, (state, action) => {
        state.isLoading = false;
        // This is the core logic: we filter the deleted word out of our state.
        // The backend sends back the ID of the deleted word in the action.payload.
        state.words = state.words.filter(
          (word) => word._id !== action.payload.id
        );
      })
      .addCase(deleteWord.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update Word Review cases
      .addCase(updateWordReview.fulfilled, (state, action) => {
        // Find the index of the word that was just updated.
        const index = state.words.findIndex(word => word._id === action.payload._id);
        if (index !== -1) {
          // Replace the old word data with the new, updated word data from the backend.
          state.words[index] = action.payload;
        }
      })
      .addCase(updateWordReview.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })

  },
});

export const { reset } = vocabularySlice.actions;
export default vocabularySlice.reducer;