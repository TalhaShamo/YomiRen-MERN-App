// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import vocabularyReducer from '../features/vocabulary/vocabularySlice';
import analyzerReducer from '../features/analyzer/analyzerSlice';
import aiReducer from '../features/ai/aiSlice';

export const store = configureStore({
  reducer: {
    // Our "state managers" (reducers)
    auth : authReducer,
    vocabulary : vocabularyReducer,
    analyzer : analyzerReducer,
    ai : aiReducer,
  },
});