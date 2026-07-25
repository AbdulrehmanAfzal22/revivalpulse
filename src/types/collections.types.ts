export interface BookmarkPayload {
  verseKey: string;
}

export interface NotePayload {
  verseKey: string;
  text: string;
}

export interface HighlightPayload {
  verseKey: string;
  colorId: string;
}

export interface ReadingHistoryPayload {
  verseKey: string;
  surahId: number;
  lastReadAt: number;
}

export interface LastReadPayload {
  verseKey: string;
  surahId: number;
  readAt: number;
}

export interface FavoriteSurahPayload {
  type: 'surah';
  surahId: number;
}

export interface FavoriteHadithBookPayload {
  type: 'hadithBook';
  bookSlug: string;
}

export type FavoritePayload = FavoriteSurahPayload | FavoriteHadithBookPayload;
