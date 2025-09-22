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

// We create a "guest list" of allowed origins.
const allowedOrigins = [
  'http://localhost:5173', // Your local frontend for development
  'https://yomiren.vercel.app' // Our deployed URL
];

// We configure our CORS middleware to only use this guest list.
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Middleware
app.use(cors(corsOptions)); // We now pass our options to cors.
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