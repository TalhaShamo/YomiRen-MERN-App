import api from './api';

// The base URL for our backend's dictionary endpoint.
const API_URL = '/dictionary/';

// Look up a single word.
const lookupWord = async (term, token) => {
  // The config object for our authenticated request.
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Make the GET request to our backend.
  const response = await api.get(API_URL + 'lookup/' + term, config);
  
  // Return the clean, formatted data from the backend.
  return response.data;
};

const dictionaryService = {
  lookupWord,
};

export default dictionaryService;