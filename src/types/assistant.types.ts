import type { DuaCategoryId } from 'types/duas.types';

export type SourceMode = 'general' | 'quran' | 'hadith' | 'tafsir' | 'history';

export type ParsedIntent =
  | { type: 'verse-explain'; verseKey: string }
  | { type: 'translation-compare'; verseKey: string }
  | { type: 'tafsir'; verseKey: string }
  | { type: 'hadith-search'; query: string }
  | { type: 'dua-search'; query: string; categoryId: DuaCategoryId | null }
  | { type: 'unrecognized' };

export interface SourceCitation {
  type: 'quran' | 'hadith' | 'tafsir' | 'dua';
  reference: string;
  text: string;
}

export interface Citation {
  type: 'quran' | 'tafsir' | 'hadith' | 'dua';
  label: string;
}

export type AssistantSection =
  | {
      kind: 'verse';
      verseKey: string;
      surahLabel: string;
      arabic: string;
      translations: { label: string; text: string }[];
    }
  | { kind: 'tafsir'; verseKey: string; authorName: string; text: string }
  | {
      kind: 'hadith';
      bookName: string;
      idInBook: number;
      arabic: string;
      englishText: string;
      narrator: string | null;
    }
  | { kind: 'dua'; title: string; arabic: string; translation: string; categoryLabel: string }
  | { kind: 'note'; text: string };

export interface AssistantAnswer {
  sections: AssistantSection[];
  citations: Citation[];
  /** false => show the "no confident source-backed answer" state instead of guessing. */
  confident: boolean;
  sources: SourceCitation[];
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  answer?: AssistantAnswer;
  createdAt: number;
}
