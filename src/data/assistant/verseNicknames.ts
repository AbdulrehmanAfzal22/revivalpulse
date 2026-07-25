/**
 * Small, deliberately conservative set of widely-known verse nicknames —
 * each verified live (api.quran.com by_key) against its actual text before
 * being added here. Not exhaustive by design: a wrong or disputed nickname
 * mapping would mean the assistant confidently cites the wrong verse, which
 * is worse than not recognizing the nickname at all (falls through to
 * "unrecognized" instead).
 *
 * Keys are normalized (lowercase, punctuation stripped) at lookup time —
 * see features/assistant/services/intentParser.ts.
 */
export const VERSE_NICKNAMES: Record<string, string> = {
  'ayat al kursi': '2:255',
  'ayatul kursi': '2:255',
  'throne verse': '2:255',
  'verse of the throne': '2:255',
  'ayat an nur': '24:35',
  'ayat al nur': '24:35',
  'verse of light': '24:35',
  'light verse': '24:35',
};
