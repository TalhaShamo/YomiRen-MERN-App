import axios from 'axios';

// The base URL of our backend's analyzer endpoint.
const API_URL = 'http://localhost:5000/api/analyzer/';

// Analyze a block of text.
const analyzeText = async (textData, token) => {
  // Create the config object to send our JWT for authentication.
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Make the POST request to our backend.
  const response = await axios.post(API_URL + 'analyze', textData, config);
  
  // Return the array of analyzed tokens from the backend.
  return response.data;
};

const analyzerService = {
  analyzeText,
};

export default analyzerService;