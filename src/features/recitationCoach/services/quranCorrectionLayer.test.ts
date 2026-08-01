import fs from 'fs';
import path from 'path';
import { buildSurahWordIndex } from './surahWordIndex';
import type { SurahWordIndex } from './surahWordIndex';
import type { SurahFullText } from 'api/quran/fullTextClient';
import { correctWord, correctWords, WHISPER_ERROR_DICTIONARY } from './quranCorrectionLayer';

/**
 * A small synthetic corpus for fast, precisely-controlled tests — real
 * Quran text (Uthmani, no diacritics needed here since these are already
 * plain, normalization-stable strings) covering two short surahs so
 * surah-boundary edge cases are exercised without loading the full corpus.
 */
function buildSyntheticIndex(): SurahWordIndex {
  const fullText: SurahFullText[] = [
    { id: 200, ayahs: ['قل هو الله احد', 'الله الصمد'] },
    { id: 201, ayahs: ['انا اعطيناك الكوثر'] },
  ];
  return buildSurahWordIndex(fullText);
}

let realIndex: SurahWordIndex | null = null;
function getRealIndex(): SurahWordIndex {
  if (realIndex) return realIndex;
  const raw = fs.readFileSync(path.join(process.cwd(), 'public/data/quran-full-arabic.json'), 'utf8');
  const fullText = JSON.parse(raw) as SurahFullText[];
  realIndex = buildSurahWordIndex(fullText);
  return realIndex;
}

describe('correctWord: vocabulary constraint and unchanged words', () => {
  test('a word that already exists in the Quran corpus is returned unchanged as an Exact Quran Match', () => {
    const index = buildSyntheticIndex();
    const result = correctWord('احد', [], index);
    expect(result.correctedWord).toBe('احد');
    expect(result.wasCorrected).toBe(false);
    expect(result.correctionReason).toBe('Exact Quran Match');
    expect(result.confidence).toBe(100);
  });

  test('never invents a word: every corrected output is a real key in the corpus index', () => {
    const index = buildSyntheticIndex();
    const candidates = ['قل', 'هو', 'الل', 'احج', 'الصمد', 'الكوث'];
    const results = candidates.map((raw) => correctWord(raw, [], index));
    const correctedWords = results.filter((result) => result.wasCorrected).map((result) => result.correctedWord);
    const allAreRealCorpusWords = correctedWords.every((word) => index.byWord.has(word));
    expect(allAreRealCorpusWords).toBe(true);
  });
});

describe('correctWord: dictionary corrections', () => {
  test('a known dictionary entry is corrected with high confidence', () => {
    const index = buildSyntheticIndex();
    const [wrongWord, rightWord] = Object.entries(WHISPER_ERROR_DICTIONARY)[0]!;
    // Build a tiny index containing the dictionary's own correct word so the lookup can succeed.
    const fullText: SurahFullText[] = [{ id: 1, ayahs: [rightWord] }];
    const dictIndex = buildSurahWordIndex(fullText);
    const result = correctWord(wrongWord, [], dictIndex);
    expect(result.wasCorrected).toBe(true);
    expect(result.correctedWord).toBe(rightWord);
    expect(result.correctionReason).toBe('Dictionary Match');
    expect(result.confidence).toBeGreaterThanOrEqual(90);
    void index; // keep the synthetic index import path exercised for symmetry with other tests in this file
  });

  test('a dictionary hit is ignored if the corrected word somehow is not in this session\'s corpus index', () => {
    const index = buildSyntheticIndex(); // does not contain "العالمين"
    const [wrongWord] = Object.entries(WHISPER_ERROR_DICTIONARY)[0]!;
    const result = correctWord(wrongWord, [], index);
    expect(result.correctionReason).not.toBe('Dictionary Match');
  });
});

describe('correctWord: context-aware correction (real corpus)', () => {
  /**
   * The Uthmani corpus text for "al-'ālamīn" (الْعَٰلَمِينَ) represents its
   * long vowel with a dagger alef — a diacritic, stripped by
   * normalizeArabicWord — not a full alef letter, so the corpus's own
   * normalized form is "العلمين" (no alef). Whisper, trained on standard
   * modern Arabic text, plausibly outputs the common full-alef spelling
   * "العالمين" for this and similar words — confirmed by directly checking
   * this app's actual bundled corpus (not assumed) before writing this test.
   */
  test('a plausible Whisper spelling of a dagger-alef word is corrected to match the corpus (context)', () => {
    const index = getRealIndex();
    const result = correctWord('العالمين', ['الحمد', 'لله', 'رب'], index);
    expect(result.wasCorrected).toBe(true);
    expect(result.correctedWord).toBe('العلمين');
    expect(['Context Match', 'Levenshtein Match', 'Dictionary Match']).toContain(result.correctionReason);
    expect(result.confidence).toBeGreaterThanOrEqual(70);
  });

  test('correctWords threads corrected context through a whole batch, in order', () => {
    const index = getRealIndex();
    const results = correctWords(['الحمد', 'لله', 'رب', 'العالمين'], [], index);
    expect(results.map((r) => r.correctedWord)).toEqual(['الحمد', 'لله', 'رب', 'العلمين']);
    expect(results[3]!.wasCorrected).toBe(true);
  });

  test('multiple correction candidates: the closest-matching real follower is chosen, not just the first one found', () => {
    // Synthetic corpus where the same two-word context is followed by two
    // very different real words across two ayahs — the search must pick
    // the one genuinely close to what was recognized, not an arbitrary one.
    const fullText: SurahFullText[] = [{ id: 1, ayahs: ['اهدنا الصراط المستقيم', 'اهدنا الصراط الطويل'] }];
    const index = buildSurahWordIndex(fullText);
    // "اهدنا الصراط" is followed by both "المستقيم" and "الطويل" here.
    // "المستقيل" (single letter swapped at the end) is a near-miss of
    // "المستقيم" specifically, not of the unrelated "الطويل".
    const result = correctWord('المستقيل', ['اهدنا', 'الصراط'], index);
    expect(result.correctedWord).toBe('المستقيم');
    expect(result.wasCorrected).toBe(true);
  });
});

describe('correctWord: safety — low confidence never forces a correction', () => {
  test('a word with no plausible relation to any candidate is left completely unchanged', () => {
    const index = buildSyntheticIndex();
    const result = correctWord('xyzxyzxyz', [], index);
    expect(result.wasCorrected).toBe(false);
    expect(result.correctedWord).toBe('xyzxyzxyz');
    expect(result.correctionReason).toBe('Low Confidence (No Correction)');
    expect(result.confidence).toBe(0);
  });

  test('a plausible-length but unrelated word does not get force-corrected to a same-length real word', () => {
    const index = buildSyntheticIndex();
    const result = correctWord('طويرق', [], index); // shares nothing meaningful with the small synthetic vocabulary
    expect(result.wasCorrected).toBe(false);
    expect(result.correctionReason).toBe('Low Confidence (No Correction)');
  });
});

describe('correctWord: edge cases at surah boundaries', () => {
  test('the very first word of a session, with no preceding context at all, still resolves safely', () => {
    const index = buildSyntheticIndex();
    const result = correctWord('قل', [], index);
    expect(result.correctedWord).toBe('قل');
    expect(result.correctionReason).toBe('Exact Quran Match');
  });

  test('the last word of a surah has no recorded followers, so a next-word lookup never crosses into the next surah', () => {
    const index = buildSyntheticIndex();
    // "احد" is the last word of surah 200's first ayah in this fixture, but
    // "الله" (a real word, start of ayah 2) is NOT a valid "follower of احد"
    // context for a DIFFERENT reason: we're testing that unrelated garbage
    // after the true last word of the whole synthetic corpus ("الكوثر")
    // doesn't spuriously resolve via a cross-surah leak.
    const result = correctWord('غريب', ['الكوثر'], index);
    expect(result.wasCorrected).toBe(false);
  });
});

describe('correctWord: performance on a long surah (real corpus, Al-Baqarah)', () => {
  test('building the index once and correcting a realistic batch stays fast', () => {
    const index = getRealIndex();
    // Warm the memoized followers/global indexes once (simulates the first
    // correction of a session) before timing the actual per-chunk work.
    correctWord('قل', [], index);

    const start = Date.now();
    const words = ['الم', 'ذلك', 'الكتب', 'لا', 'ريب', 'فيه', 'هدي', 'للمتقين'];
    correctWords(words, [], index);
    expect(Date.now() - start).toBeLessThan(100);
  });

  test('index construction itself (first call) is a one-time cost, not repeated per correction', () => {
    const index = getRealIndex();
    const first = Date.now();
    correctWord('الم', [], index);
    const firstCallMs = Date.now() - first;

    const second = Date.now();
    correctWord('ذلك', [], index);
    const secondCallMs = Date.now() - second;

    // The second call reuses the memoized index and must not redo the
    // whole-corpus pass — it should not be meaningfully slower than the
    // first (loosely bounded, this just guards against an obvious
    // rebuild-every-call regression, not a strict micro-benchmark).
    expect(secondCallMs).toBeLessThanOrEqual(Math.max(firstCallMs, 10));
  });
});
