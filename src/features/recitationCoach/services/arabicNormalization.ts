/**
 * Whisper's Arabic output and the Uthmani script corpus never spell things
 * identically — diacritics, alef/hamza variants, and tatweel differ even
 * when the underlying word is the same. Every comparison in this feature
 * (surah detection, word-by-word tracking) goes through this normalization
 * first so those spelling differences don't register as mismatches.
 */

const DIACRITICS_AND_TATWEEL = /[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۨ-ۭـ]/g;
const NON_ARABIC_LETTERS = /[^ء-ي\s]/g;

/**
 * A lighter tier than normalizeArabicWord: strips diacritics/tatweel and
 * non-Arabic characters but deliberately *keeps* letter-variant distinctions
 * (alef/hamza forms, ta marbuta vs ha, etc). Only exists so the
 * recitation-coach word matcher can tell "identical even before
 * variant-folding" apart from "only equal after letter-variant folding" for
 * its `reason` field — the actual matching decision everywhere else still
 * goes through the full normalizeArabicWord below, unchanged.
 */
export function stripDiacriticsAndTatweel(word: string): string {
  return word
    .normalize('NFKC')
    .replace(DIACRITICS_AND_TATWEEL, '')
    .replace(NON_ARABIC_LETTERS, '')
    .trim();
}

export function normalizeArabicWord(word: string): string {
  return word
    .normalize('NFKC')
    .replace(DIACRITICS_AND_TATWEEL, '')
    .replace(/[إأآٱا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(NON_ARABIC_LETTERS, '')
    .trim();
}

export function normalizeArabicText(text: string): string {
  return text
    .split(/\s+/)
    .map(normalizeArabicWord)
    .filter(Boolean)
    .join(' ');
}

export function tokenizeArabic(text: string): string[] {
  return normalizeArabicText(text).split(' ').filter(Boolean);
}

/**
 * Splits ayah text into raw display words and their normalized
 * counterparts, index-aligned — the raw form renders on screen, the
 * normalized form is what actually gets compared against recognized
 * speech.
 *
 * Uthmani text encodes standalone Quranic pause/annotation marks (ۖ ۗ ۛ
 * ۚ etc. — waqf signs, not letters) as their own space-delimited tokens.
 * A naive split treats each as its own "word", which normalizes to an
 * empty string (they contain no actual letters) — left in as its own
 * array entry, that becomes a tracker position no recognized speech can
 * ever match (nobody vocalizes a pause mark), permanently freezing
 * word-by-word tracking the moment the cursor reaches it. Affects roughly
 * 44% of all ayahs in the corpus, so this isn't a rare edge case. Instead,
 * a token that normalizes to nothing is folded into the previous real
 * word's display text (so the mark still renders on screen) and never
 * becomes a trackable word of its own — keeping raw/normalized aligned by
 * construction, both containing only real, sayable words.
 */
export function splitAyahWords(ayahText: string): { raw: string[]; normalized: string[] } {
  const tokens = ayahText.split(/\s+/).filter((word) => word.length > 0);
  const raw: string[] = [];
  const normalized: string[] = [];

  for (const token of tokens) {
    const normalizedToken = normalizeArabicWord(token);
    if (normalizedToken === '') {
      if (raw.length > 0) raw[raw.length - 1] += ' ' + token;
      continue;
    }
    raw.push(token);
    normalized.push(normalizedToken);
  }

  return { raw, normalized };
}
