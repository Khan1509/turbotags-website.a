/**
 * Calls the backend API to generate tags and hashtags.
 * @param {string} prompt - The prompt to send to the AI model.
 * @returns {Promise<string>} The generated text from the API.
 * @throws {Error} If the network response is not ok.
 */
export const generateContent = async (prompt) => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
    console.error('API Error:', errorBody);
    throw new Error(errorBody.message || 'Network response was not ok.');
  }
  
  const data = await response.json();
  return data.text;
};
