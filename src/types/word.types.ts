export type WordCharType = 'word' | 'end';

export interface Word {
  id: number;
  position: number;
  verseKey: string;
  textUthmani: string;
  translation: string | null;
  transliteration: string | null;
  audioUrl: string | null;
  charType: WordCharType;
}

/** Sourced from a static corpus, not api.quran.com — see public/data/morphology/. */
export interface WordMorphology {
  root: string | null;
  lemma: string | null;
  pos: string;
  grammar: string[];
}

export interface AudioSegment {
  wordPosition: number;
  startMs: number;
  endMs: number;
}

export interface VerseTimestamp {
  verseKey: string;
  timestampFrom: number;
  timestampTo: number;
  segments: AudioSegment[];
}

export interface ChapterRecitation {
  audioUrl: string;
  timestamps: VerseTimestamp[];
}

interface ReciterBase {
  id: string;
  name: string;
  style: string | null;
}

/** quran.com: one whole-chapter file with word+verse-level segment timing. */
export interface QuranComReciter extends ReciterBase {
  source: 'quran.com';
  recitationId: number;
  supportsWordSync: true;
}

/** everyayah.com: one file per ayah — real ayah boundaries, no word-level timing. */
export interface EveryAyahReciter extends ReciterBase {
  source: 'everyayah.com';
  folderName: string;
  supportsWordSync: false;
}

export type Reciter = QuranComReciter | EveryAyahReciter;
