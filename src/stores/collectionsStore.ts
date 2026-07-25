import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { readLocal, syncDomain, upsertLocal } from 'services/syncEngine';
import type { SyncDomain, SyncRecord } from 'types/sync.types';
import type {
  BookmarkPayload,
  FavoritePayload,
  HighlightPayload,
  LastReadPayload,
  NotePayload,
  ReadingHistoryPayload,
} from 'types/collections.types';

function currentUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

function persistAndSync<T>(domain: SyncDomain, record: SyncRecord<T>): SyncRecord<T>[] {
  const userId = currentUserId();
  const next = upsertLocal<T>(domain, userId, record);
  if (userId) void syncDomain<T>(domain, userId);
  return next;
}

interface CollectionsStoreState {
  bookmarks: SyncRecord<BookmarkPayload>[];
  notes: SyncRecord<NotePayload>[];
  highlights: SyncRecord<HighlightPayload>[];
  readingHistory: SyncRecord<ReadingHistoryPayload>[];
  lastRead: SyncRecord<LastReadPayload>[];
  /** Both favorite surahs and favorite hadith books live in this one sync domain. */
  favorites: SyncRecord<FavoritePayload>[];

  toggleBookmark: (verseKey: string) => void;
  setNote: (verseKey: string, text: string) => void;
  removeNote: (verseKey: string) => void;
  setHighlight: (verseKey: string, colorId: string) => void;
  removeHighlight: (verseKey: string) => void;
  toggleFavoriteSurah: (surahId: number) => void;
  toggleFavoriteHadithBook: (bookSlug: string) => void;
  logReading: (surahId: number, verseKey: string) => void;
}

export const useCollectionsStore = create<CollectionsStoreState>((set, get) => ({
  bookmarks: readLocal<BookmarkPayload>('bookmarks', currentUserId()),
  notes: readLocal<NotePayload>('notes', currentUserId()),
  highlights: readLocal<HighlightPayload>('highlights', currentUserId()),
  readingHistory: readLocal<ReadingHistoryPayload>('readingHistory', currentUserId()),
  lastRead: readLocal<LastReadPayload>('lastRead', currentUserId()),
  favorites: readLocal<FavoritePayload>('favorites', currentUserId()),

  toggleBookmark: (verseKey) => {
    const existing = get().bookmarks.find((item) => item.id === verseKey && !item.deleted);
    const record: SyncRecord<BookmarkPayload> = {
      id: verseKey,
      updatedAt: Date.now(),
      deleted: Boolean(existing),
      payload: { verseKey },
    };
    set({ bookmarks: persistAndSync('bookmarks', record) });
  },

  setNote: (verseKey, text) => {
    const record: SyncRecord<NotePayload> = {
      id: verseKey,
      updatedAt: Date.now(),
      deleted: false,
      payload: { verseKey, text },
    };
    set({ notes: persistAndSync('notes', record) });
  },

  removeNote: (verseKey) => {
    const existing = get().notes.find((item) => item.id === verseKey);
    const record: SyncRecord<NotePayload> = {
      id: verseKey,
      updatedAt: Date.now(),
      deleted: true,
      payload: existing?.payload ?? { verseKey, text: '' },
    };
    set({ notes: persistAndSync('notes', record) });
  },

  setHighlight: (verseKey, colorId) => {
    const record: SyncRecord<HighlightPayload> = {
      id: verseKey,
      updatedAt: Date.now(),
      deleted: false,
      payload: { verseKey, colorId },
    };
    set({ highlights: persistAndSync('highlights', record) });
  },

  removeHighlight: (verseKey) => {
    const existing = get().highlights.find((item) => item.id === verseKey);
    const record: SyncRecord<HighlightPayload> = {
      id: verseKey,
      updatedAt: Date.now(),
      deleted: true,
      payload: existing?.payload ?? { verseKey, colorId: '' },
    };
    set({ highlights: persistAndSync('highlights', record) });
  },

  toggleFavoriteSurah: (surahId) => {
    const id = `surah-${surahId}`;
    const existing = get().favorites.find((item) => item.id === id && !item.deleted);
    const record: SyncRecord<FavoritePayload> = {
      id,
      updatedAt: Date.now(),
      deleted: Boolean(existing),
      payload: { type: 'surah', surahId },
    };
    set({ favorites: persistAndSync('favorites', record) });
  },

  toggleFavoriteHadithBook: (bookSlug) => {
    const id = `book-${bookSlug}`;
    const existing = get().favorites.find((item) => item.id === id && !item.deleted);
    const record: SyncRecord<FavoritePayload> = {
      id,
      updatedAt: Date.now(),
      deleted: Boolean(existing),
      payload: { type: 'hadithBook', bookSlug },
    };
    set({ favorites: persistAndSync('favorites', record) });
  },

  logReading: (surahId, verseKey) => {
    const now = Date.now();
    const historyRecord: SyncRecord<ReadingHistoryPayload> = {
      id: verseKey,
      updatedAt: now,
      deleted: false,
      payload: { verseKey, surahId, lastReadAt: now },
    };
    const lastReadRecord: SyncRecord<LastReadPayload> = {
      id: 'last-read',
      updatedAt: now,
      deleted: false,
      payload: { verseKey, surahId, readAt: now },
    };
    set({
      readingHistory: persistAndSync('readingHistory', historyRecord),
      lastRead: persistAndSync('lastRead', lastReadRecord),
    });
  },
}));

// --- pure selectors (operate on already-fetched arrays, filter out soft-deletes) ---

export function isBookmarked(bookmarks: SyncRecord<BookmarkPayload>[], verseKey: string): boolean {
  return bookmarks.some((item) => item.id === verseKey && !item.deleted);
}

export function getNoteText(notes: SyncRecord<NotePayload>[], verseKey: string): string | null {
  return notes.find((item) => item.id === verseKey && !item.deleted)?.payload.text ?? null;
}

export function getHighlightColorId(highlights: SyncRecord<HighlightPayload>[], verseKey: string): string | null {
  return highlights.find((item) => item.id === verseKey && !item.deleted)?.payload.colorId ?? null;
}

export function isFavoriteSurah(favorites: SyncRecord<FavoritePayload>[], surahId: number): boolean {
  return favorites.some((item) => item.id === `surah-${surahId}` && !item.deleted);
}

export function isFavoriteHadithBook(favorites: SyncRecord<FavoritePayload>[], bookSlug: string): boolean {
  return favorites.some((item) => item.id === `book-${bookSlug}` && !item.deleted);
}

export function favoriteSurahIds(favorites: SyncRecord<FavoritePayload>[]): number[] {
  return favorites
    .filter((item) => !item.deleted && item.payload.type === 'surah')
    .map((item) => (item.payload as { type: 'surah'; surahId: number }).surahId);
}

export function favoriteHadithBookSlugs(favorites: SyncRecord<FavoritePayload>[]): string[] {
  return favorites
    .filter((item) => !item.deleted && item.payload.type === 'hadithBook')
    .map((item) => (item.payload as { type: 'hadithBook'; bookSlug: string }).bookSlug);
}

/** Consecutive calendar days (ending today or yesterday) with at least one reading-history entry. */
export function calculateReadingStreak(history: SyncRecord<ReadingHistoryPayload>[]): number {
  const days = new Set(
    history.filter((item) => !item.deleted).map((item) => new Date(item.payload.lastReadAt).toDateString())
  );
  if (days.size === 0) return 0;

  const cursor = new Date();
  if (!days.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(cursor.toDateString())) return 0;
  }

  let streak = 0;
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// --- re-hydrate from the server once a guest signs in ---

let lastSyncedUserId: string | null = currentUserId();
const COLLECTION_DOMAINS: SyncDomain[] = ['bookmarks', 'notes', 'highlights', 'readingHistory', 'lastRead', 'favorites'];

useAuthStore.subscribe((state) => {
  const userId = state.user?.id ?? null;
  if (userId === lastSyncedUserId) return;
  lastSyncedUserId = userId;
  if (!userId) return;

  void Promise.all(COLLECTION_DOMAINS.map((domain) => syncDomain(domain, userId))).then(
    ([bookmarks, notes, highlights, readingHistory, lastRead, favorites]) => {
      useCollectionsStore.setState({
        bookmarks: bookmarks as SyncRecord<BookmarkPayload>[],
        notes: notes as SyncRecord<NotePayload>[],
        highlights: highlights as SyncRecord<HighlightPayload>[],
        readingHistory: readingHistory as SyncRecord<ReadingHistoryPayload>[],
        lastRead: lastRead as SyncRecord<LastReadPayload>[],
        favorites: favorites as SyncRecord<FavoritePayload>[],
      });
    }
  );
});
