const test = require('node:test');
const assert = require('node:assert/strict');
const { callLLMWithSearch } = require('./llmClient');

test('calls the native Gemini generateContent endpoint and parses grounding metadata', async () => {
  process.env.GEMINI_API_KEY = 'test-key';
  const originalFetch = global.fetch;

  global.fetch = async (_url, options) => {
    assert.ok(String(_url).includes('/models/gemini-3.6-flash:generateContent?key=test-key'));
    assert.equal(options.headers['Content-Type'], 'application/json');
    const body = JSON.parse(options.body);
    assert.deepEqual(body.tools, [{ google_search: {} }]);
    assert.ok(Array.isArray(body.contents));

    return {
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: 'QUESTION_CLASS: ISLAMIC_CLAIM\n\nMuhammad was the final prophet.' }],
          },
          groundingMetadata: {
            webSearchQueries: ['who is muhammad'],
            groundingChunks: [
              { web: { title: 'Muhammad', uri: 'https://example.com/muhammad' } },
            ],
          },
        }],
      }),
    };
  };

  try {
    const result = await callLLMWithSearch('who is muhammad', 'general', 'en');
    assert.match(result.answer, /final prophet/i);
    assert.equal(result.sources.length, 1);
    assert.equal(result.sources[0].type, 'google_search');
    assert.equal(result.sources[0].url, 'https://example.com/muhammad');
    assert.equal(result.sources[0].reference, 'Muhammad');
  } finally {
    global.fetch = originalFetch;
  }
});
