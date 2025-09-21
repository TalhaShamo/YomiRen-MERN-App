const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  term: { type: String, required: true, trim: true },
  reading: { type: String, trim: true },
  definition: { type: String, required: true, trim: true },
  nextReviewDate: { type: Date, default: Date.now, required: true },
  reviewInterval: { type: Number, default: 1, required: true },
  easinessFactor: { type: Number, default: 2.5, required: true },
});

// This creates a compound index to ensure a user cannot add the same term twice.
vocabularySchema.index({ user: 1, term: 1 }, { unique: true })

module.exports = mongoose.model('Vocabulary', vocabularySchema);