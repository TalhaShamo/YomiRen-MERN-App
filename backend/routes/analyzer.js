const express = require('express');
const router = express.Router();
const kuromoji = require('kuromoji');
const wanakana = require('wanakana');
const auth = require('../middleware/auth');
const Vocabulary = require('../models/Vocabulary');

const posMapper = {
  '名詞': 'Noun',
  '動詞': 'Verb',
  '形容詞': 'Adjective',
  '助詞': 'Particle',
  '助動詞': 'Auxiliary',
  '副詞': 'Adverb',
  '接続詞': 'Conjunction',
  '感動詞': 'Interjection',
  '記号': 'Symbol',
  '形状詞': 'Adjective', // This is a specific type of adjective
};

// Helper function to promisify kuromoji's builder.
const getTokenizer = () => {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, tokenizer) => {
      if (err) return reject(err);
      resolve(tokenizer);
    });
  });
};

router.post('/analyze', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'No text provided.' });
    }

    // Fetch the user's known vocabulary from the database
    const userWords = await Vocabulary.find({ user: req.user.id });
    const learnedTerms = new Set(userWords.map(word => word.term));

    // Tokenize the input text
    const tokenizer = await getTokenizer();
    const tokens = tokenizer.tokenize(text);

    // Map tokens to our desired format
    const analysisResult = tokens.map(token => {
      const term = token.surface_form;
      const isKnown = learnedTerms.has(term);
      const katakanaReading = token.reading || '';
      const basePOS = token.pos; // The main category (e.g., '名詞')

      return {
        term: term,
        reading_hiragana: wanakana.toHiragana(katakanaReading),
        reading_katakana: katakanaReading,
        // We look up the simple name in our mapper.
        // If it's not found, we fall back to the original for safety.
        pos: posMapper[basePOS] || basePOS, 
        isKnown: isKnown,
      };
    });

    res.json(analysisResult);
  } catch (error) {
    console.error('Analyzer Error:', error);
    res.status(500).json({ message: 'Error analyzing text.' });
  }
});

module.exports = router;