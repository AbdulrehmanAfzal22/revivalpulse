const test = require('node:test');
const assert = require('node:assert/strict');
const { detectTypoHint } = require('./typoHints');
const { callLLM } = require('./llmClient');

test('detects common Islamic typo variants', () => {
  assert.deepEqual(detectTypoHint('hadees'), {
    typedWord: 'hadees',
    likelyTerm: 'Hadith',
    note: "Note: the word 'hadees' closely resembles the Islamic term 'Hadith', but is not an exact match.",
  });

  assert.deepEqual(detectTypoHint('hades'), {
    typedWord: 'hades',
    likelyTerm: 'Hadith',
    note: "Note: the word 'hades' closely resembles the Islamic term 'Hadith', but is not an exact match.",
  });

  assert.equal(detectTypoHint('hadith'), null);
  assert.equal(detectTypoHint('What is the hadees about intentions?')?.typedWord, 'hadees');
});

test('general mode prompt includes the dual-meaning note for likely typo cases', async () => {
  const originalFetch = global.fetch;
  const requests = [];
  process.env.GEMINI_API_KEY = 'test-key';

  global.fetch = async (_url, options) => {
    requests.push(JSON.parse(options.body));
    return {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'QUESTION_CLASS: ISLAMIC_CLAIM\n\nIf you meant Hadith, here is that. If you actually meant the literal word hadees, here is that instead.' } }],
      }),
    };
  };

  try {
    await callLLM(
      "Note: the word 'hadees' closely resembles the Islamic term 'Hadith', but is not an exact match.",
      'hadees about intentions',
      'general',
      'en',
      [],
      []
    );

    await callLLM(
      'Hadith about intentions',
      'hadith about intentions',
      'general',
      'en',
      [],
      []
    );

    const typoPayload = JSON.stringify(requests[0].messages[1].content);
    const correctPayload = JSON.stringify(requests[1].messages[1].content);

    assert.match(typoPayload, /closely resembles the Islamic term 'Hadith'/i);
    assert.doesNotMatch(correctPayload, /closely resembles the Islamic term/i);
    assert.match(requests[0].messages[1].content, /hadees about intentions/i);
  } finally {
    global.fetch = originalFetch;
  }
});
