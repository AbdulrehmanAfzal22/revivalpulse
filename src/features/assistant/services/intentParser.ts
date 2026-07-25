import { SURAHS } from 'data/quran/surahs';
import { VERSE_NICKNAMES } from 'data/assistant/verseNicknames';
import type { ParsedIntent } from 'types/assistant.types';
import type { DuaCategoryId } from 'types/duas.types';

const DUA_CATEGORY_SYNONYMS: Record<DuaCategoryId, string[]> = {
  morning: ['morning'],
  evening: ['evening'],
  sleeping: ['sleep', 'sleeping', 'bed', 'bedtime'],
  wakingUp: ['waking', 'wake up', 'wake'],
  eating: ['eating', 'food', 'meal', 'drink'],
  traveling: ['travel', 'traveling', 'travelling', 'journey', 'trip'],
  illness: ['illness', 'sick', 'sickness', 'ill', 'health'],
  prayer: ['prayer', 'salah', 'salat'],
  ramadan: ['ramadan', 'fasting', 'fast'],
  hajj: ['hajj', 'umrah', 'pilgrimage'],
  protection: ['protection', 'safety', 'safe', 'protect'],
  forgiveness: ['forgiveness', 'forgive', 'repentance'],
};

/** Lowercase, punctuation -> single spaces, collapsed — used for all fuzzy phrase/keyword matching below. */
function normalizeLoose(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isValidVerseKey(surahId: number, ayahNumber: number): boolean {
  const surah = SURAHS.find((item) => item.id === surahId);
  return Boolean(surah) && ayahNumber >= 1 && ayahNumber <= (surah?.versesCount ?? 0);
}

function extractVerseKey(rawText: string): string | null {
  const directMatch = rawText.match(/\b(\d{1,3})\s*[:.]\s*(\d{1,3})\b/);
  if (directMatch) {
    const surahId = Number(directMatch[1]);
    const ayahNumber = Number(directMatch[2]);
    if (isValidVerseKey(surahId, ayahNumber)) return `${surahId}:${ayahNumber}`;
  }

  const normalized = normalizeLoose(rawText);
  for (const [nickname, verseKey] of Object.entries(VERSE_NICKNAMES)) {
    if (normalized.includes(nickname)) return verseKey;
  }

  const numberMatch = normalized.match(/\b(\d{1,3})\b/);
  if (numberMatch) {
    const candidateNumber = Number(numberMatch[1]);
    const surah = SURAHS.find((item) => {
      const name = normalizeLoose(item.nameSimple);
      return name.length > 2 && normalized.includes(name);
    });
    if (surah && isValidVerseKey(surah.id, candidateNumber)) {
      return `${surah.id}:${candidateNumber}`;
    }
  }

  return null;
}

function matchDuaCategory(normalizedText: string): DuaCategoryId | null {
  const entry = (Object.entries(DUA_CATEGORY_SYNONYMS) as [DuaCategoryId, string[]][]).find(
    ([, synonyms]) => synonyms.some((word) => normalizedText.includes(word))
  );
  return entry ? entry[0] : null;
}

const TRANSLATION_COMPARE_KEYWORDS = ['compare translation', 'different translation', 'translations of', 'side by side'];
const TAFSIR_KEYWORDS = ['tafsir', 'commentary', 'interpretation', 'exegesis'];
const DUA_KEYWORDS = ['dua', 'supplication'];
const HADITH_KEYWORDS = ['hadith', 'narrated', 'sunnah'];

/**
 * Deterministic, rule-based — no free-text generation. Every branch either
 * resolves to real, verifiable app data or falls through to 'unrecognized',
 * which the UI renders as an explicit "no confident answer" state rather
 * than guessing (see features/assistant/services/assistantEngine.ts).
 */
export function parseIntent(rawText: string): ParsedIntent {
  const normalized = normalizeLoose(rawText);
  if (!normalized) return { type: 'unrecognized' };

  const verseKey = extractVerseKey(rawText);

  if (TRANSLATION_COMPARE_KEYWORDS.some((keyword) => normalized.includes(keyword)) && verseKey) {
    return { type: 'translation-compare', verseKey };
  }

  if (TAFSIR_KEYWORDS.some((keyword) => normalized.includes(keyword)) && verseKey) {
    return { type: 'tafsir', verseKey };
  }

  if (DUA_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return { type: 'dua-search', query: rawText, categoryId: matchDuaCategory(normalized) };
  }

  if (HADITH_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    const stripped = HADITH_KEYWORDS.reduce((text, keyword) => text.replace(keyword, ''), normalized).trim();
    return { type: 'hadith-search', query: stripped || rawText };
  }

  if (verseKey) {
    return { type: 'verse-explain', verseKey };
  }

  return { type: 'unrecognized' };
}
