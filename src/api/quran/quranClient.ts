import { QURAN_API_BASE_URL, VERSE_STRUCTURAL_FIELDS, VERSE_TEXT_FIELDS } from 'constants/quranApi';
import { WORD_AUDIO_BASE_URL } from 'constants/wordAudio';
import type { Ayah, AyahTranslation } from 'types/quran.types';
import type { TranslationResource } from 'types/translation.types';
import type { AudioSegment, ChapterRecitation, Word, WordCharType } from 'types/word.types';

interface RawVerseTranslation {
  id: number;
  resource_id: number;
  text: string;
}

interface RawWord {
  id: number;
  position: number;
  audio_url: string | null;
  char_type_name: WordCharType;
  text_uthmani: string;
  translation: { text: string | null };
  transliteration: { text: string | null };
}

interface RawVerse {
  id: number;
  verse_key: string;
  verse_number: number;
  text_uthmani: string;
  juz_number: number;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  page_number: number;
  translations?: RawVerseTranslation[];
  words?: RawWord[];
}

interface VersesByChapterResponse {
  verses: RawVerse[];
}

const WORD_FIELDS = 'text_uthmani,transliteration,translation,audio_url';

/** api.quran.com translation/tafsir text carries markers like `<sup foot_note=123>1</sup>`. */
function stripFootnotes(html: string): string {
  return html.replace(/<sup[^>]*>.*?<\/sup>/g, '').trim();
}

function mapWord(word: RawWord, verseKey: string): Word {
  return {
    id: word.id,
    position: word.position,
    verseKey,
    textUthmani: word.text_uthmani,
    translation: word.translation.text,
    transliteration: word.transliteration.text,
    audioUrl: word.audio_url ? `${WORD_AUDIO_BASE_URL}${word.audio_url}` : null,
    charType: word.char_type_name,
  };
}

function mapVerse(verse: RawVerse, resourceIdToTranslationId: Map<number, string>): Ayah {
  const chapterId = Number(verse.verse_key.split(':')[0]);
  const translations: AyahTranslation[] = (verse.translations ?? [])
    .map((translation) => {
      const translationId = resourceIdToTranslationId.get(translation.resource_id);
      return translationId ? { translationId, text: stripFootnotes(translation.text) } : null;
    })
    .filter((item): item is AyahTranslation => item !== null);

  return {
    id: verse.id,
    verseKey: verse.verse_key,
    verseNumber: verse.verse_number,
    chapterId,
    textUthmani: verse.text_uthmani,
    translations,
    words: (verse.words ?? []).map((word) => mapWord(word, verse.verse_key)),
    juzNumber: verse.juz_number,
    hizbNumber: verse.hizb_number,
    rubNumber: verse.rub_el_hizb_number,
    rukuNumber: verse.ruku_number,
    manzilNumber: verse.manzil_number,
    sajdahNumber: verse.sajdah_number,
    pageNumber: verse.page_number,
  };
}

/** `translationResources` must be quran.com-sourced; other sources are fetched separately. */
export async function getChapterVerses(
  chapterId: number,
  translationResources: TranslationResource[]
): Promise<Ayah[]> {
  const resourceIdToTranslationId = new Map<number, string>(
    translationResources.map((resource) => [Number(resource.sourceId), resource.id])
  );
  const translationsParam = translationResources.map((resource) => resource.sourceId).join(',');
  const translationsQuery = translationsParam ? `&translations=${translationsParam}` : '';

  const url =
    `${QURAN_API_BASE_URL}/verses/by_chapter/${chapterId}` +
    `?language=en&words=true&word_fields=${WORD_FIELDS}` +
    `&fields=${VERSE_TEXT_FIELDS},${VERSE_STRUCTURAL_FIELDS}${translationsQuery}&per_page=300`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load surah ${chapterId} (status ${response.status})`);
  }

  const data = (await response.json()) as VersesByChapterResponse;
  return data.verses.map((verse) => mapVerse(verse, resourceIdToTranslationId));
}

export async function getVerseArabicText(verseKey: string): Promise<string> {
  const url = `${QURAN_API_BASE_URL}/verses/by_key/${verseKey}?fields=text_uthmani`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load verse ${verseKey} (status ${response.status})`);
  }
  const data = (await response.json()) as { verse: { text_uthmani: string } };
  return data.verse.text_uthmani;
}

export async function getSingleTranslationText(resourceId: number, verseKey: string): Promise<string> {
  const url = `${QURAN_API_BASE_URL}/verses/by_key/${verseKey}?translations=${resourceId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load translation (status ${response.status})`);
  }
  const data = (await response.json()) as { verse: { translations: RawVerseTranslation[] } };
  const text = data.verse.translations[0]?.text;
  return text ? stripFootnotes(text) : '';
}

export async function getTafsirText(tafsirResourceId: number, verseKey: string): Promise<string> {
  const url = `${QURAN_API_BASE_URL}/tafsirs/${tafsirResourceId}/by_ayah/${verseKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load tafsir (status ${response.status})`);
  }
  const data = (await response.json()) as { tafsir: { text: string } };
  return data.tafsir.text;
}

interface RawTimestamp {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
  segments: unknown[];
}

interface ChapterRecitationResponse {
  audio_file: {
    audio_url: string;
    timestamps: RawTimestamp[];
  };
}

/** Some segment triplets in this API are malformed (e.g. `[1]` with no ms values) — skip those. */
function mapSegments(raw: unknown[]): AudioSegment[] {
  return raw
    .filter((segment): segment is [number, number, number] => Array.isArray(segment) && segment.length === 3)
    .map(([wordPosition, startMs, endMs]) => ({ wordPosition, startMs, endMs }));
}

export async function getChapterRecitation(
  recitationId: number,
  chapterId: number
): Promise<ChapterRecitation> {
  const url = `${QURAN_API_BASE_URL}/chapter_recitations/${recitationId}/${chapterId}?segments=true`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load recitation audio (status ${response.status})`);
  }

  const data = (await response.json()) as ChapterRecitationResponse;
  return {
    audioUrl: data.audio_file.audio_url,
    timestamps: data.audio_file.timestamps.map((timestamp) => ({
      verseKey: timestamp.verse_key,
      timestampFrom: timestamp.timestamp_from,
      timestampTo: timestamp.timestamp_to,
      segments: mapSegments(timestamp.segments),
    })),
  };
}
