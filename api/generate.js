export default async function handler(req, res) {
  // Immediately set JSON content-type
  res.setHeader('Content-Type', 'application/json');

  // Block non-POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported' 
    });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing prompt in request body'
      });
    }

    // Your OpenRouter API logic here
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct-v0.2",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    return res.status(200).json({
      text: data.choices[0].message.content
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}
