import type { WordMorphology } from 'types/word.types';

/** Static per-surah files generated from the Quranic Arabic Corpus — see public/data/morphology/ATTRIBUTION.md. */
export async function getSurahMorphology(surahId: number): Promise<Record<string, WordMorphology>> {
  const response = await fetch(`/data/morphology/${surahId}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load morphology for surah ${surahId} (status ${response.status})`);
  }
  return response.json() as Promise<Record<string, WordMorphology>>;
}
