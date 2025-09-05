async function callOpenRouter(model, systemPrompt) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'YOUR_API_KEY') {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables.');
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error for model ${model}: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const systemPrompt = `You are a social media trend analyst. Your task is to identify 5 current, globally relevant trending topic ideas for each of the following platforms: YouTube, Instagram, TikTok, and Facebook.
  The topics should be fresh, interesting, and represent what is currently gaining traction in ${new Date().getFullYear()}.
  
  Your response MUST be a valid JSON object. The root should be an object with a single key "trendingTopics".
  The value of "trendingTopics" should be an array of 4 objects.
  Each object in the array represents a platform and must have the following keys:
  - "platform": A string ("YouTube", "Instagram", "TikTok", "Facebook").
  - "topics": An array of 5 topic objects.
  
  Each topic object must have two keys:
  - "title": A string for the topic title (e.g., "AI Tools Explained").
  - "description": A short, one-sentence string describing the topic.
  
  Do NOT include any explanations or markdown formatting. Only the raw JSON object.`;

  try {
    const model = "mistralai/mistral-7b-instruct";
    const result = await callOpenRouter(model, systemPrompt);

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error fetching trending topics:', error.message);
    return res.status(500).json({ trendingTopics: [] });
  }
}
