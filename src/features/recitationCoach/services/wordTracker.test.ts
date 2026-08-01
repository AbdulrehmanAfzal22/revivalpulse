import fs from 'fs';
import path from 'path';
import { advanceTracker, createInitialTrackerState } from './wordTracker';
import { splitAyahWords } from './arabicNormalization';
import type { SurahFullText } from 'api/quran/fullTextClient';

/**
 * Exercises the real auto-resume-from-mistake logic against the actual
 * bundled Quran text (not fixtures), across 10 different (surah, ayah)
 * starting points spanning short and long surahs throughout the mushaf —
 * this is the "10 deliberate mistake-then-correct sequences" verification
 * that can genuinely be automated, as opposed to the full
 * microphone-to-Whisper pipeline, which needs a real browser and a real
 * voice to test.
 */

function loadAyahsBySurah(surahId: number): string[][] {
  const raw = fs.readFileSync(path.join(process.cwd(), 'public/data/quran-full-arabic.json'), 'utf8');
  const fullText = JSON.parse(raw) as SurahFullText[];
  const surah = fullText.find((item) => item.id === surahId);
  if (!surah) throw new Error(`Fixture missing surah ${surahId}`);
  return surah.ayahs.map((ayahText) => splitAyahWords(ayahText).normalized);
}

interface TestCase {
  surahId: number;
  ayahNumber: number;
  startWordIndex: number;
}

const TEST_CASES: TestCase[] = [
  { surahId: 1, ayahNumber: 2, startWordIndex: 0 },
  { surahId: 2, ayahNumber: 5, startWordIndex: 0 },
  { surahId: 18, ayahNumber: 1, startWordIndex: 0 },
  { surahId: 36, ayahNumber: 10, startWordIndex: 0 },
  { surahId: 55, ayahNumber: 1, startWordIndex: 0 },
  { surahId: 56, ayahNumber: 20, startWordIndex: 0 },
  { surahId: 67, ayahNumber: 3, startWordIndex: 0 },
  { surahId: 89, ayahNumber: 5, startWordIndex: 0 },
  { surahId: 112, ayahNumber: 1, startWordIndex: 2 },
  { surahId: 114, ayahNumber: 4, startWordIndex: 0 },
];

describe('advanceTracker auto-resume from mistake (10 real ayah sequences)', () => {
  test.each(TEST_CASES)(
    'surah $surahId ayah $ayahNumber: freezes on a wrong word and resumes cleanly on the correct one',
    ({ surahId, ayahNumber, startWordIndex }) => {
      const ayahs = loadAyahsBySurah(surahId);
      const ayahWords = ayahs[ayahNumber - 1];
      expect(ayahWords).toBeDefined();
      // Need at least 3 words after the start so there's a real word to get
      // wrong, the correct word to recover with, and one more to confirm
      // forward progress actually resumed (not just that the mistake cleared).
      expect(ayahWords!.length).toBeGreaterThanOrEqual(startWordIndex + 3);

      let tracker = createInitialTrackerState({ ayahNumber, wordIndex: startWordIndex });

      const mistakeWordIndex = startWordIndex;
      const correctWord = ayahWords![mistakeWordIndex]!;
      const wrongWord = 'ﻏﻴﺮ_ﺻﺤﻴﺢ_ﺗﺠﺮﻳﺒﻲ'; // guaranteed not to match any real corpus word

      // 1. Deliberate mistake: must freeze, not advance, not silently pass.
      tracker = advanceTracker(tracker, ayahs, wrongWord);
      expect(tracker.hasMistakeAtCursor).toBe(true);
      expect(tracker.cursor).toEqual({ ayahNumber, wordIndex: mistakeWordIndex });
      expect(tracker.correctWords.has(`${ayahNumber}:${mistakeWordIndex}`)).toBe(false);

      // 2. Saying the correct word must clear the mistake and advance exactly one word.
      tracker = advanceTracker(tracker, ayahs, correctWord);
      expect(tracker.hasMistakeAtCursor).toBe(false);
      expect(tracker.cursor).toEqual({ ayahNumber, wordIndex: mistakeWordIndex + 1 });
      expect(tracker.correctWords.has(`${ayahNumber}:${mistakeWordIndex}`)).toBe(true);

      // 3. Forward progress must actually continue past the recovered word,
      // not just clear the flag and get stuck.
      const nextWord = ayahWords![mistakeWordIndex + 1]!;
      tracker = advanceTracker(tracker, ayahs, nextWord);
      expect(tracker.hasMistakeAtCursor).toBe(false);
      expect(tracker.cursor).toEqual({ ayahNumber, wordIndex: mistakeWordIndex + 2 });

      // 4. A stale duplicate of the just-confirmed word (simulating a
      // chunk-overlap re-transcription) must not be treated as a new mistake.
      tracker = advanceTracker(tracker, ayahs, nextWord);
      expect(tracker.hasMistakeAtCursor).toBe(false);
      expect(tracker.cursor).toEqual({ ayahNumber, wordIndex: mistakeWordIndex + 2 });
    }
  );
});
