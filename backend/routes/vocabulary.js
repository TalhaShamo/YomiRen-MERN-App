const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import our auth middleware
const Vocabulary = require('../models/Vocabulary');

/**
 * @route   GET /api/vocabulary
 * @desc    Get all vocabulary words for the logged-in user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const words = await Vocabulary.find({ user: req.user.id }).sort({ nextReviewDate: 1 });
    res.json(words);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { term, reading, definition } = req.body;
    const userId = req.user.id;

    const existingWord = await Vocabulary.findOne({user: userId, term: term});
    if(existingWord){
      return res.status(400).json({message: 'This word is already in your deck'});
    }
    
    const newWord = new Vocabulary({
      user: userId, // Link the word to the logged-in user
      term,
      reading,
      definition,
    });

    const word = await newWord.save();
    res.status(201).json(word);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    // Find the word by its ID
    const word = await Vocabulary.findById(req.params.id);

    // If the word doesn't exist, send a 404 error
    if (!word) {
      return res.status(404).json({ message: 'Word not found.' });
    }

    // IMPORTANT: Authorization Check
    // Make sure the logged-in user is the one who owns this word
    if (word.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized.' });
    }

    // If all checks pass, remove the word
    await word.deleteOne();

    // Send back a success message with the ID of the deleted word
    res.json({ message: 'Word removed successfully.', id: req.params.id });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/vocabulary/review
 * @desc    Get all words due for review for the logged-in user
 * @access  Private
 */
router.get('/review', auth, async (req, res) => {
  try {
    // Find all words for this user where the next review date is today or in the past.
    const wordsToReview = await Vocabulary.find({
      user: req.user.id,
      nextReviewDate: { $lte: new Date() }, // $lte means "less than or equal to"
    }).limit(20); // Limit to 20 words per session to avoid overwhelming the user.

    res.json(wordsToReview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update the Card review times
router.put('/review/:id', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    const word = await Vocabulary.findById(req.params.id);

    if (!word) {
      return res.status(404).json({ message: 'Word not found.' });
    }
    if (word.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized.' });
    }

    // --- INTUITIVE SRS ALGORITHM ---
    let { reviewInterval, easinessFactor } = word;

    switch (rating) {
      case 'again':
        // The user struggled. We apply a small "penalty" to the easiness factor.
        // The frontend will handle showing the card again in the current session.
        easinessFactor = Math.max(1.3, easinessFactor - 0.2); // Don't let it go below 1.3
        // We don't change the interval; we just update the EF.
        break;
      case 'good':
        // The user got it right. If it's the first time, set interval to 1 day.
        // Otherwise, calculate the new interval.
        reviewInterval = reviewInterval === 1 ? 1 : Math.round(reviewInterval * easinessFactor);
        break;
      case 'easy':
        // The user found it easy. If it's the first time, set to 2 days.
        // Otherwise, calculate with a bonus.
        reviewInterval = reviewInterval === 1 ? 2 : Math.round(reviewInterval * (easinessFactor + 0.2));
        break;
      default:
        return res.status(400).json({ message: 'Invalid rating.' });
    }
    
    // Only update the nextReviewDate for "Good" and "Easy".
    // "Again" is handled in React component. We simply take that card and move it to the back of the current review deck
    let nextReviewDate = word.nextReviewDate;
    if (rating === 'good' || rating === 'easy') {
      const now = new Date();
      nextReviewDate = new Date(now.setDate(now.getDate() + reviewInterval));
    }

    // Update the word in the database with the new SRS data.
    word.reviewInterval = reviewInterval;
    word.easinessFactor = easinessFactor;
    word.nextReviewDate = nextReviewDate;
    await word.save();

    res.json(word);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;