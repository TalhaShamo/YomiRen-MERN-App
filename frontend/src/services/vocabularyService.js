import api from './api'; // We import our custom, secure axios instance.

// The base URL is now relative to the baseURL set in our api.js instance.
const API_URL = '/vocabulary/';

// Get user's vocabulary words
const getWords = async (token) => {
  // Create the configuration object for our request.
  // This is how we pass the user's JWT as an Authorization header.
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get(API_URL, config);
  return response.data;
};

// Create a new word for the user
const createWord = async (wordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.post(API_URL, wordData, config);
  return response.data;
};

// Delete a user's word
const deleteWord = async (wordId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // We use axios.delete for DELETE requests.
  // The ID of the word to delete is passed in the URL.
  const response = await api.delete(API_URL + wordId, config);
  
  // The backend will send back a success message and the ID of the deleted word.
  return response.data;
};

// Get all words that are due for review.
const getReviewWords = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // We call our new '/review' endpoint.
  const response = await api.get(API_URL + 'review', config);
  return response.data;
};

// Update a word's SRS data after a review.
const updateWordReview = async (wordId, rating, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // The backend expects the 'rating' in the request body.
  const reviewData = { rating };

  // We use axios.put to update the resource, sending the rating in the body.
  const response = await api.put(API_URL + 'review/' + wordId, reviewData, config);
  
  return response.data;
};

// Get the count of words due for review.
const getReviewCount = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // We call our new '/review/count' endpoint.
  const response = await api.get(API_URL + 'review/count', config);
  return response.data;
};

const vocabularyService = {
  getWords,
  createWord,
  deleteWord,
  getReviewWords,
  updateWordReview,
  getReviewCount,
};

export default vocabularyService;