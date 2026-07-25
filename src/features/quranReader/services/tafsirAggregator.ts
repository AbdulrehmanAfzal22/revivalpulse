import { getSingleTranslationText, getTafsirText } from 'api/quran/quranClient';
import { getAyahEditionText } from 'api/quran/alQuranCloudClient';
import { TAFSIRS } from 'constants/tafsirs';

export async function fetchTafsirText(tafsirId: string, verseKey: string): Promise<string> {
  const resource = TAFSIRS.find((item) => item.id === tafsirId);
  if (!resource) {
    throw new Error(`Unknown tafsir: ${tafsirId}`);
  }

  if (resource.source === 'alquran.cloud') {
    return getAyahEditionText(verseKey, String(resource.sourceId));
  }

  if (resource.quranComEndpoint === 'translation') {
    return getSingleTranslationText(Number(resource.sourceId), verseKey);
  }

  return getTafsirText(Number(resource.sourceId), verseKey);
}
