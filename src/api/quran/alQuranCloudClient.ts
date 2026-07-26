import { ALQURAN_CLOUD_API_BASE_URL } from 'constants/alQuranCloudApi';

interface RawAyah {
  numberInSurah: number;
  text: string;
}

interface SurahEditionResponse {
  data: { ayahs: RawAyah[] };
}

interface AyahEditionResponse {
  data: { text: string };
}

interface AyahAudioEditionResponse {
  data: { audio: string };
}

/** Used for editions not published on api.quran.com (e.g. Kanzul Iman, Jalalayn). */
export async function getSurahEditionText(
  surahId: number,
  editionIdentifier: string
): Promise<Record<number, string>> {
  const url = `${ALQURAN_CLOUD_API_BASE_URL}/surah/${surahId}/${editionIdentifier}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${editionIdentifier} for surah ${surahId} (status ${response.status})`);
  }

  const data = (await response.json()) as SurahEditionResponse;
  const byAyahNumber: Record<number, string> = {};
  data.data.ayahs.forEach((ayah) => {
    byAyahNumber[ayah.numberInSurah] = ayah.text;
  });
  return byAyahNumber;
}

export async function getAyahEditionText(verseKey: string, editionIdentifier: string): Promise<string> {
  const url = `${ALQURAN_CLOUD_API_BASE_URL}/ayah/${verseKey}/${editionIdentifier}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${editionIdentifier} for ${verseKey} (status ${response.status})`);
  }

  const data = (await response.json()) as AyahEditionResponse;
  return data.data.text;
}

/** Same endpoint as getAyahEditionText, but for audio (versebyverse) editions — returns the mp3 URL. */
export async function getAyahEditionAudio(verseKey: string, editionIdentifier: string): Promise<string> {
  const url = `${ALQURAN_CLOUD_API_BASE_URL}/ayah/${verseKey}/${editionIdentifier}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${editionIdentifier} audio for ${verseKey} (status ${response.status})`);
  }

  const data = (await response.json()) as AyahAudioEditionResponse;
  return data.data.audio;
}
