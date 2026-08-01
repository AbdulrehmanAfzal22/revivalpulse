import fs from 'fs';
import path from 'path';
import { splitAyahWords } from './arabicNormalization';
import type { SurahFullText } from 'api/quran/fullTextClient';

/**
 * Regression coverage for a real bug found while testing whole-Quran
 * location detection: standalone Quranic pause/annotation marks (ۖ ۗ ۛ
 * etc.) are their own space-delimited tokens in the Uthmani text. Left as
 * their own array entry, they normalize to an empty string that no
 * recognized speech can ever match — which would permanently freeze
 * word-by-word tracking the moment the cursor reached one. Affects ~44% of
 * all ayahs in the corpus (verified by scanning the real bundled dataset),
 * so this is exercised against real corpus text, not a synthetic example.
 */
function loadFullText(): SurahFullText[] {
  const raw = fs.readFileSync(path.join(process.cwd(), 'public/data/quran-full-arabic.json'), 'utf8');
  return JSON.parse(raw) as SurahFullText[];
}

describe('splitAyahWords pause-mark handling', () => {
  const fullText = loadFullText();

  test('never produces an empty-string entry in normalized, across the entire real corpus', () => {
    let checked = 0;
    for (const surah of fullText) {
      for (const ayahText of surah.ayahs) {
        const { raw, normalized } = splitAyahWords(ayahText);
        expect(raw.length).toBe(normalized.length);
        expect(normalized.every((word) => word.length > 0)).toBe(true);
        checked += 1;
      }
    }
    expect(checked).toBe(6236); // sanity: actually iterated the whole Quran, not an empty fixture
  });

  test('a known real ayah containing a pause mark (Al-Baqarah 2:5) folds it into the previous word rather than dropping a trackable slot', () => {
    const surah = fullText.find((item) => item.id === 2)!;
    const { raw, normalized } = splitAyahWords(surah.ayahs[4]!); // ayah 5

    // Raw Uthmani text has "ۖ" as its own token at this position; folded in,
    // the previous word's display text should carry it instead.
    expect(raw.some((word) => word.includes('ۖ'))).toBe(true);
    expect(raw).not.toContain('ۖ');
    expect(normalized.every((word) => word.length > 0)).toBe(true);
  });

  test('a pause mark at the very start of the token list (no previous word to attach to) is dropped, not crashed on', () => {
    const { raw, normalized } = splitAyahWords('ۖ الحمد لله');
    expect(raw).toEqual(['الحمد', 'لله']);
    expect(normalized).toEqual(['الحمد', 'لله']);
  });
});
