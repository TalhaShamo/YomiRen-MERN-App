import axios from 'axios';

// The base URL for our backend's dictionary endpoint.
const API_URL = 'http://localhost:5000/api/dictionary/';

// Look up a single word.
const lookupWord = async (term, token) => {
  // The config object for our authenticated request.
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Make the GET request to our backend.
  const response = await axios.get(API_URL + 'lookup/' + term, config);
  
  // Return the clean, formatted data from the backend.
  return response.data;
};

const dictionaryService = {
  lookupWord,
};

export default dictionaryService;