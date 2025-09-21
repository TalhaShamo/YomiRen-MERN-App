import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vocabulary/';

// Get user's vocabulary words
const getWords = async (token) => {
  // Create the configuration object for our request.
  // This is how we pass the user's JWT as an Authorization header.
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create a new word for the user
const createWord = async (wordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, wordData, config);
  return response.data;
};

const deleteWord = async (wordId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // We use axios.delete for DELETE requests.
  // The ID of the word to delete is passed in the URL.
  const response = await axios.delete(API_URL + wordId, config);
  
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
  const response = await axios.get(API_URL + 'review', config);
  return response.data;
};

// Updating the nextReview of a Card based on rating given by user.
const updateWordReview = async (wordId, rating, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // The backend expects the 'rating' in the request body.
  const reviewData = { rating };

  // We use axios.put to update the resource, sending the rating in the body.
  const response = await axios.put(API_URL + 'review/' + wordId, reviewData, config);
  
  return response.data;
};

const vocabularyService = {
  getWords,
  createWord,
  deleteWord,
  getReviewWords,
  updateWordReview,
};

export default vocabularyService;