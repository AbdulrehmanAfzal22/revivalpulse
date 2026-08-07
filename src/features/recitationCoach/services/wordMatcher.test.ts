import { normalizeArabicWord } from './arabicNormalization';
import {
  alignWindow,
  buildExpectedWindow,
  classificationToComparison,
  levenshteinDistance,
  planAdvances,
  scoreWordMatch,
} from './wordMatcher';

describe('levenshteinDistance', () => {
  test('identical strings are distance 0', () => {
    expect(levenshteinDistance('الرحمن', 'الرحمن')).toBe(0);
  });

  test('a single inserted letter is distance 1', () => {
    // الرحمن vs الرحمان — the example from the spec: an extra alef.
    expect(levenshteinDistance(normalizeArabicWord('الرحمن'), normalizeArabicWord('الرحمان'))).toBe(1);
  });

  test('completely different words have a large distance', () => {
    expect(levenshteinDistance('كتاب', 'سماء')).toBeGreaterThanOrEqual(3);
  });
});

describe('scoreWordMatch: single-word confidence scoring', () => {
  test('identical normalized words are an Exact Match with full confidence', () => {
    const result = scoreWordMatch('الرحمن', 'الرحمن');
    expect(result.reason).toBe('Exact Match');
    expect(result.matchScore).toBe(100);
    expect(result.confidence).toBe(100);
  });

  test('Arabic character equivalence: hamza-alef vs plain alef normalizes to the same word and is reported as Arabic Variant', () => {
    // أَحَد (Ahad, with hamza-above-alef + diacritics) vs plain احد from Whisper.
    const expectedRaw = 'أَحَد';
    const expectedNormalized = normalizeArabicWord(expectedRaw);
    const recognizedNormalized = normalizeArabicWord('احد');
    expect(expectedNormalized).toBe(recognizedNormalized); // sanity: normalization does fold them together

    const result = scoreWordMatch(expectedNormalized, recognizedNormalized, expectedRaw);
    expect(result.reason).toBe('Arabic Variant');
    expect(result.matchScore).toBe(100);
    expect(result.confidence).toBe(100);
  });

  test('without a raw form to compare, an already-equal pair is just an Exact Match (no false Arabic Variant claim)', () => {
    const result = scoreWordMatch('الرحمن', 'الرحمن');
    expect(result.reason).toBe('Exact Match');
  });

  test('a single-letter edit within tolerance is a Levenshtein Match with decent confidence', () => {
    // الرحمن vs الرحمان — exactly the spec's example of a probable match.
    const expected = normalizeArabicWord('الرحمن');
    const recognized = normalizeArabicWord('الرحمان');
    const result = scoreWordMatch(expected, recognized);
    expect(result.reason).toBe('Levenshtein Match');
    expect(result.confidence).toBeGreaterThanOrEqual(50);
  });

  test('a plausible but larger difference (still similar length) is scored as Likely Whisper Error, not immediately a mistake', () => {
    // Long words where more than the edit-distance tolerance differs, but
    // lengths are close enough that it's plausibly a garbled recognition
    // rather than a totally different word.
    const result = scoreWordMatch('العالمين', 'العالمون');
    expect(['Levenshtein Match', 'Likely Whisper Error']).toContain(result.reason);
    expect(result.confidence).toBeGreaterThan(0);
  });

  test('a completely unrelated word is Likely User Mistake with zero confidence', () => {
    const result = scoreWordMatch('الرحمن', 'كتاب');
    expect(result.reason).toBe('Likely User Mistake');
    expect(result.matchScore).toBe(0);
    expect(result.confidence).toBe(0);
  });

  test('a wildly different, much longer garbled string never scores as a match — guards the existing exact-match test fixtures', () => {
    // Mirrors wordTracker.test.ts's deliberately-gibberish wrong word: much
    // longer than any real corpus word, sharing little structure with it.
    const result = scoreWordMatch('احد', 'غيرصحيحتجريبيوهذاطويلجدا');
    expect(result.confidence).toBeLessThan(45); // below CONFIDENCE_MEDIUM — must not be tolerated as uncertain
  });
});

describe('buildExpectedWindow', () => {
  const ayahs = [
    ['قل', 'هو', 'الله', 'احد'],
    ['الله', 'الصمد'],
  ];
  const rawAyahs = [
    ['قُلْ', 'هُوَ', 'اللَّهُ', 'أَحَدٌ'],
    ['اللَّهُ', 'الصَّمَدُ'],
  ];

  test('walks forward within one ayah', () => {
    const window = buildExpectedWindow(ayahs, { ayahNumber: 1, wordIndex: 1 }, 3, rawAyahs);
    expect(window.map((entry) => entry.word)).toEqual(['هو', 'الله', 'احد']);
    expect(window[0]!.raw).toBe('هُوَ');
  });

  test('rolls over into the next ayah when the window extends past the current one', () => {
    const window = buildExpectedWindow(ayahs, { ayahNumber: 1, wordIndex: 2 }, 4, rawAyahs);
    expect(window.map((entry) => `${entry.ayahNumber}:${entry.wordIndex}`)).toEqual(['1:2', '1:3', '2:0', '2:1']);
  });

  test('stops early when the corpus runs out, never over-reading', () => {
    const window = buildExpectedWindow(ayahs, { ayahNumber: 2, wordIndex: 1 }, 5);
    expect(window).toHaveLength(1);
  });
});

describe('alignWindow: sliding-window sequence alignment', () => {
  test('an ordinary run of exact matches aligns one-to-one', () => {
    const steps = alignWindow(['قل', 'هو', 'الله', 'احد'], ['قل', 'هو', 'الله', 'احد']);
    expect(steps.map((step) => step.classification)).toEqual(['correct', 'correct', 'correct', 'correct']);
  });

  test('a single Levenshtein-tolerant substitution in the middle of a run is not treated as a hard mistake', () => {
    const steps = alignWindow(
      ['قل', 'هو', 'الرحمن', 'احد'],
      ['قل', 'هو', normalizeArabicWord('الرحمان'), 'احد']
    );
    const middle = steps[2]!;
    expect(middle.classification).not.toBe('wrong-word');
  });

  test('a merged word (Whisper outputs one token for two expected words) is recognized and both expected words are consumed', () => {
    const steps = alignWindow(['ال', 'رحمن', 'رحيم'], ['الرحمن', 'رحيم']);
    const mergeStep = steps.find((step) => step.expectedIndices.length === 2);
    expect(mergeStep).toBeDefined();
    expect(mergeStep!.expectedIndices).toEqual([0, 1]);
    expect(mergeStep!.recognizedIndices).toEqual([0]);
    // The trailing word still aligns normally.
    expect(steps[steps.length - 1]!.classification).toBe('correct');
  });

  test('a split word (Whisper splits one expected word into two tokens) is recognized and consumes both recognized tokens', () => {
    const steps = alignWindow(['الرحمن', 'رحيم'], ['ال', 'رحمن', 'رحيم']);
    const splitStep = steps.find((step) => step.recognizedIndices.length === 2);
    expect(splitStep).toBeDefined();
    expect(splitStep!.expectedIndices).toEqual([0]);
    expect(splitStep!.recognizedIndices).toEqual([0, 1]);
  });

  test('a duplicated word is classified as repeated, not a fresh mistake, and does not consume an expected position', () => {
    const steps = alignWindow(['بسم', 'الله'], ['بسم', 'بسم', 'الله']);
    const repeated = steps.find((step) => step.classification === 'repeated-word' || step.classification === 'extra-word');
    expect(repeated).toBeDefined();
    expect(repeated!.expectedIndices).toEqual([]);
    // Every expected word is still, separately, correctly matched.
    const correctSteps = steps.filter((step) => step.classification === 'correct');
    expect(correctSteps).toHaveLength(2);
  });

  test('a skipped (missing) word is inferred from context, not frozen as a hard mistake, when the words around it still line up', () => {
    const steps = alignWindow(['قل', 'هو', 'الله', 'احد'], ['قل', 'الله', 'احد']);
    const missing = steps.find((step) => step.classification === 'missing-word');
    expect(missing).toBeDefined();
    expect(missing!.expectedIndices).toEqual([1]); // "هو"
    expect(missing!.recognizedIndices).toEqual([]);
  });

  test('a genuinely wrong word (no plausible relation to what was expected) is classified as a mistake', () => {
    const steps = alignWindow(['قل', 'هو', 'الله', 'احد'], ['قل', 'هو', 'كتاب', 'احد']);
    const wrong = steps.find((step) => step.expectedIndices[0] === 2);
    expect(wrong).toBeDefined();
    expect(wrong!.classification).toBe('wrong-word');
  });

  test('an extra inserted word with no relation to anything nearby is classified as extra, not consuming any expected position', () => {
    const steps = alignWindow(['قل', 'هو'], ['قل', 'يا', 'هو']);
    const extra = steps.find((step) => step.classification === 'extra-word');
    expect(extra).toBeDefined();
    expect(extra!.expectedIndices).toEqual([]);
  });

  test('stays bounded and correct at the full window size (performance sanity, not a strict benchmark)', () => {
    const expected = Array.from({ length: 10 }, (_, i) => `كلمةرقم${i}`);
    const recognized = [...expected];
    const start = Date.now();
    const steps = alignWindow(expected, recognized);
    expect(Date.now() - start).toBeLessThan(500);
    expect(steps.every((step) => step.classification === 'correct')).toBe(true);
  });
});

describe('classificationToComparison', () => {
  test('correct, probably-correct, and missing-word all advance the tracker immediately', () => {
    expect(classificationToComparison('correct')).toEqual({ isMatch: true });
    expect(classificationToComparison('probably-correct')).toEqual({ isMatch: true });
    expect(classificationToComparison('missing-word')).toEqual({ isMatch: true });
  });

  test('probably-whisper-error holds (uncertain) rather than freezing immediately', () => {
    expect(classificationToComparison('probably-whisper-error')).toEqual({ isMatch: false, isUncertain: true });
  });

  test('wrong-word and out-of-sequence freeze immediately, same as a genuine mistake', () => {
    expect(classificationToComparison('wrong-word')).toEqual({ isMatch: false });
    expect(classificationToComparison('out-of-sequence')).toEqual({ isMatch: false });
  });

  test('extra-word and repeated-word are skipped entirely (null) — nothing to advance', () => {
    expect(classificationToComparison('extra-word')).toBeNull();
    expect(classificationToComparison('repeated-word')).toBeNull();
  });
});

describe('planAdvances', () => {
  test('flattens a mix of ordinary, merge, and insertion steps into the right number of tracker advances, in order', () => {
    const steps = alignWindow(['ال', 'رحمن', 'رحيم'], ['الرحمن', 'رحيم', 'رحيم']);
    const plan = planAdvances(steps);
    // 2 expected words consumed by the merge + 1 more ordinary match = 3
    // tracker advances; the duplicated trailing "رحيم" contributes nothing.
    expect(plan).toHaveLength(3);
    expect(plan.map((entry) => entry.expectedIndex)).toEqual([0, 1, 2]);
  });

  test('a missing word produces an advance with no recognized index', () => {
    const steps = alignWindow(['قل', 'هو', 'الله'], ['قل', 'الله']);
    const plan = planAdvances(steps);
    const missingEntry = plan.find((entry) => entry.expectedIndex === 1);
    expect(missingEntry).toBeDefined();
    expect(missingEntry!.recognizedIndex).toBeNull();
    expect(missingEntry!.comparison).toEqual({ isMatch: true });
  });
});
