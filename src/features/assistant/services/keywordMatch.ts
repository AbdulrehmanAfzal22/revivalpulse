const STOPWORDS = new Set([
  'about',
  'the',
  'a',
  'an',
  'of',
  'what',
  'is',
  'on',
  'for',
  'me',
  'find',
  'show',
  'tell',
  'hadith',
  'give',
  'any',
]);

/** Words worth matching on: 4+ letters, not a filler/stopword. */
export function significantWords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length >= 4 && !STOPWORDS.has(word));
}

/**
 * Same-stem heuristic: two words match if they share a short prefix — good
 * enough to connect "intentions" with hadith text that says "he intended"
 * without a real stemmer. Deliberately conservative (short shared prefixes
 * only, both words 4+ letters) so it stays a mechanical text match, not a
 * guess: false negatives (missing a plausible match) are fine and expected
 * here, false positives (matching unrelated words) are what this guards
 * against.
 */
function sameStem(a: string, b: string): boolean {
  if (a === b) return true;
  const prefixLen = Math.min(5, a.length, b.length);
  if (prefixLen < 4) return false;
  return a.slice(0, prefixLen) === b.slice(0, prefixLen);
}

/** True if any significant word in `query` shares a stem with any word in `text`. */
export function matchesKeywords(text: string, queryWords: string[]): boolean {
  if (queryWords.length === 0) return false;
  const textWords = significantWords(text);
  return queryWords.some((queryWord) => textWords.some((textWord) => sameStem(queryWord, textWord)));
}
