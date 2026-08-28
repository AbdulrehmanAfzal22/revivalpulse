require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function embedText(text) {
  if (typeof text !== 'string' || !text.trim()) {
    return [];
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set.');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: {
          parts: [{ text }],
        },
        outputDimensionality: 768,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const values = data.embedding?.values ?? data.embeddings?.[0]?.values ?? [];

  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('Embedding response did not include values.');
  }

  return values;
}

module.exports = { embedText };
