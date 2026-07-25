import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { readLocal, syncDomain, upsertLocal } from 'services/syncEngine';
import type { SyncRecord } from 'types/sync.types';
import type {
  BadgeId,
  ContentViewedPayload,
  KidsProgressPayload,
  QuizResultPayload,
  ViewedContentCategory,
} from 'types/kids.types';

/** Matches public/data/kidsAlphabet.json's length (29 letters incl. hamza). */
const TOTAL_ALPHABET_LETTERS = 29;
const STORIES_FOR_BADGE = 5;
const MANNER_TIPS_FOR_BADGE = 5;
const STREAK_DAYS_FOR_BADGE = 7;

function currentUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function persistAndSync(record: SyncRecord<KidsProgressPayload>): SyncRecord<KidsProgressPayload>[] {
  const userId = currentUserId();
  const next = upsertLocal<KidsProgressPayload>('kidsProgress', userId, record);
  if (userId) void syncDomain<KidsProgressPayload>('kidsProgress', userId);
  return next;
}

// --- pure selectors ---

function active(records: SyncRecord<KidsProgressPayload>[]): SyncRecord<KidsProgressPayload>[] {
  return records.filter((record) => !record.deleted);
}

export function getLearnedLetterIds(records: SyncRecord<KidsProgressPayload>[]): string[] {
  return active(records)
    .map((r) => r.payload)
    .filter((p): p is Extract<KidsProgressPayload, { kind: 'letterLearned' }> => p.kind === 'letterLearned')
    .map((p) => p.letterId);
}

export function getQuizResults(records: SyncRecord<KidsProgressPayload>[]): QuizResultPayload[] {
  return active(records)
    .map((r) => r.payload)
    .filter((p): p is QuizResultPayload => p.kind === 'quizResult');
}

export function getEarnedBadgeIds(records: SyncRecord<KidsProgressPayload>[]): BadgeId[] {
  return active(records)
    .map((r) => r.payload)
    .filter((p): p is Extract<KidsProgressPayload, { kind: 'badgeEarned' }> => p.kind === 'badgeEarned')
    .map((p) => p.badgeId);
}

export function getCompletedLessonSurahIds(records: SyncRecord<KidsProgressPayload>[]): number[] {
  return active(records)
    .map((r) => r.payload)
    .filter((p): p is Extract<KidsProgressPayload, { kind: 'lessonCompleted' }> => p.kind === 'lessonCompleted')
    .map((p) => p.surahId);
}

export function getViewedContentIds(
  records: SyncRecord<KidsProgressPayload>[],
  category: ViewedContentCategory
): string[] {
  return active(records)
    .map((r) => r.payload)
    .filter((p): p is ContentViewedPayload => p.kind === 'contentViewed' && p.category === category)
    .map((p) => p.itemId);
}

/** Consecutive calendar days (ending today or yesterday) with a dailyActivity record. */
export function getStreak(records: SyncRecord<KidsProgressPayload>[]): number {
  const days = new Set(
    active(records)
      .map((r) => r.payload)
      .filter((p): p is Extract<KidsProgressPayload, { kind: 'dailyActivity' }> => p.kind === 'dailyActivity')
      .map((p) => p.date)
  );
  if (days.size === 0) return 0;

  const cursor = new Date();
  if (!days.has(todayKeyFor(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(todayKeyFor(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(todayKeyFor(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function todayKeyFor(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getTodayActivityCount(records: SyncRecord<KidsProgressPayload>[]): number {
  const today = active(records)
    .map((r) => r.payload)
    .find(
      (p): p is Extract<KidsProgressPayload, { kind: 'dailyActivity' }> =>
        p.kind === 'dailyActivity' && p.date === todayKey()
    );
  return today?.actionsCount ?? 0;
}

// --- store ---

interface KidsProgressState {
  records: SyncRecord<KidsProgressPayload>[];
  markLetterLearned: (letterId: string) => void;
  recordQuizResult: (quizId: string, score: number, total: number) => void;
  completeLesson: (surahId: number) => void;
  markContentViewed: (category: ViewedContentCategory, itemId: string) => void;
}

function logDailyActivity(get: () => KidsProgressState, set: (partial: Partial<KidsProgressState>) => void): void {
  const date = todayKey();
  const id = `daily:${date}`;
  const existing = get().records.find((r) => r.id === id && !r.deleted);
  const existingCount =
    existing && existing.payload.kind === 'dailyActivity' ? existing.payload.actionsCount : 0;
  const record: SyncRecord<KidsProgressPayload> = {
    id,
    updatedAt: Date.now(),
    deleted: false,
    payload: { kind: 'dailyActivity', date, actionsCount: existingCount + 1 },
  };
  set({ records: persistAndSync(record) });
}

function awardBadgeIfNew(
  get: () => KidsProgressState,
  set: (partial: Partial<KidsProgressState>) => void,
  badgeId: BadgeId
): void {
  const id = `badge:${badgeId}`;
  if (get().records.some((r) => r.id === id && !r.deleted)) return;
  const record: SyncRecord<KidsProgressPayload> = {
    id,
    updatedAt: Date.now(),
    deleted: false,
    payload: { kind: 'badgeEarned', badgeId },
  };
  set({ records: persistAndSync(record) });
}

function evaluateBadges(get: () => KidsProgressState, set: (partial: Partial<KidsProgressState>) => void): void {
  const records = get().records;
  const learnedLetters = getLearnedLetterIds(records);
  if (learnedLetters.length >= TOTAL_ALPHABET_LETTERS) awardBadgeIfNew(get, set, 'alphabet-explorer');

  const quizzes = getQuizResults(records);
  if (quizzes.some((q) => q.total > 0 && q.score === q.total)) awardBadgeIfNew(get, set, 'quiz-whiz');

  const storiesRead = getViewedContentIds(records, 'story');
  if (storiesRead.length >= STORIES_FOR_BADGE) awardBadgeIfNew(get, set, 'story-time');

  const mannersRead = getViewedContentIds(records, 'mannerTip');
  if (mannersRead.length >= MANNER_TIPS_FOR_BADGE) awardBadgeIfNew(get, set, 'good-manners');

  if (getCompletedLessonSurahIds(records).length >= 1) awardBadgeIfNew(get, set, 'quran-beginner');

  if (getStreak(records) >= STREAK_DAYS_FOR_BADGE) awardBadgeIfNew(get, set, 'daily-learner');
}

export const useKidsProgressStore = create<KidsProgressState>((set, get) => ({
  records: readLocal<KidsProgressPayload>('kidsProgress', currentUserId()),

  markLetterLearned: (letterId) => {
    const id = `letter:${letterId}`;
    if (get().records.some((r) => r.id === id && !r.deleted)) return;
    const record: SyncRecord<KidsProgressPayload> = {
      id,
      updatedAt: Date.now(),
      deleted: false,
      payload: { kind: 'letterLearned', letterId },
    };
    set({ records: persistAndSync(record) });
    logDailyActivity(get, set);
    evaluateBadges(get, set);
  },

  recordQuizResult: (quizId, score, total) => {
    const id = `quiz:${quizId}:${Date.now()}`;
    const record: SyncRecord<KidsProgressPayload> = {
      id,
      updatedAt: Date.now(),
      deleted: false,
      payload: { kind: 'quizResult', quizId, score, total },
    };
    set({ records: persistAndSync(record) });
    logDailyActivity(get, set);
    evaluateBadges(get, set);
  },

  completeLesson: (surahId) => {
    const id = `lesson:${surahId}`;
    if (get().records.some((r) => r.id === id && !r.deleted)) return;
    const record: SyncRecord<KidsProgressPayload> = {
      id,
      updatedAt: Date.now(),
      deleted: false,
      payload: { kind: 'lessonCompleted', surahId },
    };
    set({ records: persistAndSync(record) });
    logDailyActivity(get, set);
    evaluateBadges(get, set);
  },

  markContentViewed: (category, itemId) => {
    const id = `viewed:${category}:${itemId}`;
    if (get().records.some((r) => r.id === id && !r.deleted)) return;
    const record: SyncRecord<KidsProgressPayload> = {
      id,
      updatedAt: Date.now(),
      deleted: false,
      payload: { kind: 'contentViewed', category, itemId },
    };
    set({ records: persistAndSync(record) });
    logDailyActivity(get, set);
    evaluateBadges(get, set);
  },
}));

// --- re-hydrate from the server once a guest signs in (mirrors collectionsStore.ts) ---

let lastSyncedUserId: string | null = currentUserId();

useAuthStore.subscribe((state) => {
  const userId = state.user?.id ?? null;
  if (userId === lastSyncedUserId) return;
  lastSyncedUserId = userId;
  if (!userId) return;

  void syncDomain<KidsProgressPayload>('kidsProgress', userId).then((records) => {
    useKidsProgressStore.setState({ records });
  });
});
