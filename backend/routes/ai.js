import express from 'express';
import auth from '../middleware/auth.js';
import aiService from '../services/aiService.js';

const router = express.Router();

/**
 * @route   POST /api/ai/generate-examples
 * @desc    Generate example sentences for a word using AI
 * @access  Private
 */
router.post('/generate-examples', auth, async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) {
      return res.status(400).json({ message: 'A term is required.' });
    }

    // --- OUR NEW, MORE POWERFUL AND DIRECT PROMPT ---
    const prompt = `
      ROLE: You are an expert Japanese tutor creating example sentences for a student at the JLPT N4 level.

      TASK: Generate exactly three simple and unique example sentences.

      WORD TO USE: ${term}

      OUTPUT FORMAT: You MUST provide your response ONLY as a valid JSON array of strings. Do not include any other text, explanations, or markdown.
      
      Example of a valid response for the word "食べる":
      ["私は毎日パンを食べます。", "寿司を食べたいです。", "彼は食堂で食べます。"]
    `;

    const aiResponseString = await aiService.generateSentences(prompt);
    
    const cleanedString = aiResponseString.replace(/```json\n|\n```/g, '');
    const sentences = JSON.parse(cleanedString);

    res.json(sentences);

  } catch (error) {
    console.error('Detailed AI Route Error:', error.response?.data?.error || error.message);
    res.status(500).json({ message: 'Failed to generate AI sentences.' });
  }
});

export default router;