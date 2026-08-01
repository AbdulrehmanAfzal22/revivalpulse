export interface SurahFullText {
  id: number;
  ayahs: string[];
}

let cache: SurahFullText[] | null = null;

/**
 * The complete Uthmani Arabic text for all 114 surahs (6236 ayahs), fetched
 * once from a bundled static asset — no network dependency once cached in
 * the browser. Used by the recitation coach's surah-detection/word-matching
 * engine, which needs the whole corpus available client-side to compare
 * against live speech recognition output.
 */
export async function getFullQuranText(): Promise<SurahFullText[]> {
  if (cache) return cache;
  const response = await fetch('/data/quran-full-arabic.json');
  if (!response.ok) {
    throw new Error(`Failed to load full Quran text (status ${response.status})`);
  }
  cache = (await response.json()) as SurahFullText[];
  return cache;
}
