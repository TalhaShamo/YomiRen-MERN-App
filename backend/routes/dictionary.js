const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/dictionary/lookup/:term
 * @desc    Look up a Japanese word using the Jisho API
 * @access  Private
 */
router.get('/lookup/:term', auth, async (req, res) => {
  try {
    const term = encodeURIComponent(req.params.term);
    const jishoUrl = `https://jisho.org/api/v1/search/words?keyword=${term}`;

    const response = await axios.get(jishoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const jishoData = response.data;

    if (!jishoData.data || jishoData.data.length === 0) {
      return res.status(404).json({ message: 'Word not found.' });
    }

    // Extract the most relevant result
    const firstResult = jishoData.data[0];

    // Format the response into a clean object for our frontend
    const formattedResult = {
      term: firstResult.japanese[0].word || firstResult.japanese[0].reading,
      reading: firstResult.japanese[0].reading,
      definition: firstResult.senses[0].english_definitions.join(', '),
      jlpt: (firstResult.jlpt && firstResult.jlpt.length > 0) ? firstResult.jlpt.join(', ') : 'N/A',
    };

    res.json(formattedResult);
  } catch (error) {
    console.log("Jisho API Error: ", error.message);
    res.status(500).json({ message: 'Error fetching data from Jisho API.' });
  }
});

module.exports = router;