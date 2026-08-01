import { QURAN_API_BASE_URL } from 'constants/quranApi';

interface RawTajweedVerse {
  verse_key: string;
  text_uthmani_tajweed: string;
}

interface TajweedVersesResponse {
  verses: RawTajweedVerse[];
}

const cache = new Map<number, Promise<Map<number, string>>>();

/**
 * quran.com publishes a scholarly-verified, tajweed-annotated version of
 * the Uthmani text (`<tajweed class=RULE>...</tajweed>` markup around the
 * relevant letters for ghunnah, qalqalah, madd, ikhfa, idgham, etc.) — the
 * same data their own tajweed reading mode uses. Fetched here rather than
 * hand-rolling our own rule detection, since getting tajweed classification
 * right requires real scholarly verification, not a best-effort regex.
 * Cached per surah (in-memory, one request per surah per session) since
 * it's only needed once a surah locks, not on every render.
 */
export async function getChapterTajweedText(surahId: number): Promise<Map<number, string>> {
  const cached = cache.get(surahId);
  if (cached) return cached;

  const promise = (async () => {
    const url = `${QURAN_API_BASE_URL}/quran/verses/uthmani_tajweed?chapter_number=${surahId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load tajweed text for surah ${surahId} (status ${response.status})`);
    }
    const data = (await response.json()) as TajweedVersesResponse;
    const byAyahNumber = new Map<number, string>();
    data.verses.forEach((verse) => {
      const ayahNumber = Number(verse.verse_key.split(':')[1]);
      byAyahNumber.set(ayahNumber, verse.text_uthmani_tajweed);
    });
    return byAyahNumber;
  })();

  cache.set(surahId, promise);
  promise.catch(() => cache.delete(surahId)); // don't cache a failed fetch — allow retry next time
  return promise;
}
