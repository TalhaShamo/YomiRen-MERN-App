import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import Routers
import userRoutes from './routes/users.js';
import vocabularyRoutes from './routes/vocabulary.js';
import dictionaryRoutes from './routes/dictionary.js';
import analyzerRoutes from './routes/analyzer.js';
import aiRoutes from './routes/ai.js';

// Load environment variables
dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/users', userRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/analyzer', analyzerRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});