import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../../services/aiService';

// Initial state for AI slice
const initialState = {
    sentences: [], //Array to hold generated sentences
    isLoading: false,
    isError: false,
    message: '',
}

export const generateExamples = createAsyncThunk(
    'ai/generateExamples',
    async(termData, thunkAPI) => {
        try{
            const token = thunkAPI.getState().auth.token;
            return await aiService.generateExamples(termData.term, token);
        } catch (error){
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    // A reducer to reset the state back to its initial values.
    reset: (state) => initialState,
  },
  // Handle the different states of our async mission.
  extraReducers: (builder) => {
    builder
      .addCase(generateExamples.pending, (state) => {
        state.isLoading = true;
        state.isError = false; // Reset error state on a new request.
        state.message = '';
      })
      .addCase(generateExamples.fulfilled, (state, action) => {
        state.isLoading = false;
        // On success, store the array of sentences from the backend in our state.
        state.sentences = action.payload;
      })
      .addCase(generateExamples.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = aiSlice.actions;
export default aiSlice.reducer;