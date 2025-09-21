import api from './api';

const API_URL = '/ai/';

// Generate example sentences for a given term.
const generateExamples = async (term, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // The backend expects the 'term' in the request body.
  const requestData = { term };

  // Make the POST request to our backend's generation endpoint.
  const response = await api.post(API_URL + 'generate-examples', requestData, config);
  
  // Return the array of sentences from the backend.
  return response.data;
};

const aiService = {
  generateExamples,
};

export default aiService;