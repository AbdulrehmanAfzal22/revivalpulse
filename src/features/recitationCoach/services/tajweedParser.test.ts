import { parseTajweedWords, isMaddWord } from './tajweedParser';

// Real response captured live from
// api.quran.com/api/v4/quran/verses/uthmani_tajweed?chapter_number=1 (ayah 1:1)
// — "بسم الله الرحمن الرحيم", 4 words.
const FATIHA_AYAH_1 =
  'بِسْمِ <tajweed class=ham_wasl>ٱ</tajweed>للَّهِ <tajweed class=ham_wasl>ٱ</tajweed><tajweed class=laam_shamsiyah>ل</tajweed>رَّحْمَ<tajweed class=madda_normal>ـٰ</tajweed>نِ <tajweed class=ham_wasl>ٱ</tajweed><tajweed class=laam_shamsiyah>ل</tajweed>رَّح<tajweed class=madda_permissible>ِي</tajweed>مِ <span class=end>١</span>';

describe('parseTajweedWords', () => {
  test('splits Al-Fatiha 1:1 into its 4 real words, dropping the ayah-end marker', () => {
    const words = parseTajweedWords(FATIHA_AYAH_1);
    expect(words).toHaveLength(4);
  });

  test('attaches the correct rule classes to the letters that carry them', () => {
    const words = parseTajweedWords(FATIHA_AYAH_1);

    const [bismi, allah, rahman, raheem] = words;
    expect(bismi!.segments.every((s) => s.ruleClass === null)).toBe(true);

    expect(allah!.segments.some((s) => s.ruleClass === 'ham_wasl')).toBe(true);

    expect(rahman!.segments.some((s) => s.ruleClass === 'ham_wasl')).toBe(true);
    expect(rahman!.segments.some((s) => s.ruleClass === 'laam_shamsiyah')).toBe(true);
    expect(rahman!.segments.some((s) => s.ruleClass === 'madda_normal')).toBe(true);

    expect(raheem!.segments.some((s) => s.ruleClass === 'madda_permissible')).toBe(true);
  });

  test('reassembles each word back to its plain text with no characters dropped or duplicated', () => {
    const words = parseTajweedWords(FATIHA_AYAH_1);
    const plain = words.map((word) => word.segments.map((segment) => segment.text).join(''));
    expect(plain).toEqual(['بِسْمِ', 'ٱللَّهِ', 'ٱلرَّحْمَـٰنِ', 'ٱلرَّحِيمِ']);
  });

  test('isMaddWord identifies exactly the words carrying a madd rule', () => {
    const words = parseTajweedWords(FATIHA_AYAH_1);
    expect(words.map(isMaddWord)).toEqual([false, false, true, true]);
  });
});
