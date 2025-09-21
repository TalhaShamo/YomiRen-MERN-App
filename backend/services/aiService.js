import axios from 'axios';

// This function takes a text prompt and sends it to the Gemini API.
const generateSentences = async (prompt) => {
  try {
    // Construct the full API URL, including our secret key from the .env file.
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
    //We must construct a 'payload' object in the exact format that the Google AI API expects.
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    // We make the POST request using axios.
    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    //We dig into the complex response object to find the generated text.
    const generatedText = response.data.candidates[0].content.parts[0].text;
    return generatedText;

  } catch (error) {
    console.error('Error calling Gemini API:', error.response?.data?.error || error.message);
    throw new Error('Failed to generate sentences from AI service.');
  }
};

const aiService = {
  generateSentences,
};

export default aiService;