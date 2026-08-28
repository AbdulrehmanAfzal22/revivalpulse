const cors = require('cors');
const express = require('express');
const { resolveByMode } = require('./retrieval');
const { callLLM, callLLMWithSearch } = require('./llmClient');
const { detectTypoHint } = require('./typoHints');

const app = express();
const port = 3001;
const TYPO_HINTS_ENABLED = false; // temporary: disabled to prevent false matches on ordinary English text

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/api/assistant', async (req, res) => {
  const {
    query,
    sourceMode = 'general',
    language = 'en',
    conversationHistory = [],
  } = req.body || {};

  if (typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ answer: 'A query is required.', sources: [], confident: false });
  }

  try {
    const sources = await resolveByMode(query, sourceMode);
    const typoHint = TYPO_HINTS_ENABLED ? detectTypoHint(query) : null;
    const evidenceParts = [
      sources.map((source) => `${source.reference}: ${source.text}`).join('\n\n'),
    ];

    if (TYPO_HINTS_ENABLED && typoHint) {
      evidenceParts.push(typoHint.note);
    }

    const evidence = evidenceParts.filter(Boolean).join('\n\n');
    console.log('Evidence string sent to LLM:', evidence);

    const shouldUseNativeSearch = sourceMode === 'general' && (!evidence || evidence.trim() === '' || evidence === '(No usable evidence was retrieved.)') && /\b(prophet|history|biography|who is|who was|when was|where was|why did|what is|when did|what happened)\b/i.test(query);

    const result = shouldUseNativeSearch
      ? await callLLMWithSearch(query, sourceMode, language, conversationHistory, sources)
      : await callLLM(evidence, query, sourceMode, language, conversationHistory, sources);

    return res.json({
      answer: result.answer,
      sources: result.sources,
      confident: result.confident,
    });
  } catch (error) {
    console.error('Assistant request failed:', error);
    return res.status(500).json({
      answer: 'An error occurred while processing your request. Please try again.',
      sources: [],
      confident: false,
    });
  }
});

app.listen(port, () => {
  console.log(`Assistant server listening on http://localhost:${port}`);
});
