import { EVERYAYAH_BASE_URL } from 'constants/everyAyahAudio';

function pad3(value: number): string {
  return String(value).padStart(3, '0');
}

/** Pure URL builder — everyayah.com serves one static file per ayah, no API call needed. */
export function buildAyahAudioUrl(folderName: string, surahId: number, ayahNumber: number): string {
  return `${EVERYAYAH_BASE_URL}/${folderName}/${pad3(surahId)}${pad3(ayahNumber)}.mp3`;
}
