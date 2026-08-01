import type { StoredSessionSummary } from './learningProfileEngine';
import type { TajweedRuleId } from './tajweedAnalysisEngine';
import type { AyahMemorizationRecord } from './memorizationEngine';
import { effectiveStatus } from './memorizationEngine';
import type { ReviewScheduleEntry } from './reviewScheduler';
import type { TranslationKey } from 'i18n/types';

/**
 * The Practice Queue Engine: a prioritized review queue built fresh from
 * the current session history every time it's called — there is no
 * separately persisted "queue order" to mutate, so "automatically reorder
 * the queue after every session" is satisfied by construction: a new call
 * with a new history entry naturally produces a new ranking, nothing needs
 * to be explicitly reshuffled.
 *
 * Phase 7 extends this same engine (rather than introducing a competing
 * "Practice Queue Engine" module under a different name) with two more
 * signals — forgotten/needs-review ayahs from the Memorization Engine and
 * overdue spaced-repetition reviews — via `buildSmartPracticeQueue`, which
 * reuses `buildPracticeQueue` internally instead of duplicating its logic.
 */

export type PracticeQueueItemType =
  | 'ayah'
  | 'word'
  | 'tajweed-rule'
  | 'surah-reinforcement'
  | 'low-confidence-session'
  | 'forgotten-ayah'
  | 'needs-review-ayah'
  | 'due-review';

export interface PracticeQueueItem {
  type: PracticeQueueItemType;
  /** 0-100, higher is more urgent to review — the queue's sort key, not shown as a literal number. */
  priority: number;
  surahId?: number;
  ayahNumber?: number;
  wordIndex?: number;
  ruleId?: TajweedRuleId;
  textKey: TranslationKey;
  params?: Record<string, string>;
}

function groupBySurah(history: StoredSessionSummary[]): Map<number, StoredSessionSummary[]> {
  const map = new Map<number, StoredSessionSummary[]>();
  for (const session of history) {
    const list = map.get(session.surahId) ?? [];
    list.push(session);
    map.set(session.surahId, list);
  }
  return map;
}

interface AyahMissCount {
  surahId: number;
  ayahNumber: number;
  count: number;
}

function tallyMissedAyahs(history: StoredSessionSummary[]): AyahMissCount[] {
  const byKey = new Map<string, AyahMissCount>();
  for (const session of history) {
    for (const ayahNumber of session.weakestAyahs) {
      const key = `${session.surahId}:${ayahNumber}`;
      const entry = byKey.get(key) ?? { surahId: session.surahId, ayahNumber, count: 0 };
      entry.count += 1;
      byKey.set(key, entry);
    }
  }
  return Array.from(byKey.values());
}

interface WordMissCount {
  surahId: number;
  ayahNumber: number;
  wordIndex: number;
  count: number;
}

function tallyDifficultWords(history: StoredSessionSummary[]): WordMissCount[] {
  const byKey = new Map<string, WordMissCount>();
  for (const session of history) {
    for (const word of session.mostDifficultWords) {
      const key = `${session.surahId}:${word.ayahNumber}:${word.wordIndex}`;
      const entry = byKey.get(key) ?? { surahId: session.surahId, ayahNumber: word.ayahNumber, wordIndex: word.wordIndex, count: 0 };
      entry.count += word.mistakeAttempts;
      byKey.set(key, entry);
    }
  }
  return Array.from(byKey.values());
}

interface RuleMissCount {
  ruleId: TajweedRuleId;
  count: number;
}

function tallyWeakTajweedRules(history: StoredSessionSummary[]): RuleMissCount[] {
  const byRule = new Map<TajweedRuleId, number>();
  for (const session of history) {
    for (const ruleId of session.weakestTajweedRules) byRule.set(ruleId, (byRule.get(ruleId) ?? 0) + 1);
  }
  return Array.from(byRule.entries()).map(([ruleId, count]) => ({ ruleId, count }));
}

/** A surah counts as "recently learned" (still worth reinforcing, not yet a settled strength) when it appears within the recent session window and hasn't been attempted more than a handful of times overall. */
function recentlyLearnedSurahIds(history: StoredSessionSummary[], recentWindow: number, maxAttempts: number): number[] {
  const recentSurahIds = new Set(history.slice(-recentWindow).map((session) => session.surahId));
  const bySurah = groupBySurah(history);
  return Array.from(recentSurahIds).filter((surahId) => (bySurah.get(surahId)?.length ?? 0) <= maxAttempts);
}

const DEFAULT_QUEUE_LIMIT = 10;
const LOW_CONFIDENCE_THRESHOLD = 55;
const RECENTLY_LEARNED_SESSION_WINDOW = 10;
const RECENTLY_LEARNED_MAX_ATTEMPTS = 3;

/**
 * Combines every prioritization signal the requirement names (frequently
 * missed ayahs, difficult words, weak tajweed rules, recently learned
 * surahs, low-confidence recitations) into one ranked list, capped at
 * `limit`. Each signal's priority formula is intentionally simple and
 * documented rather than tuned against real usage data (none exists in
 * this environment) — the ordering is defensible, not claimed to be
 * optimal.
 */
export function buildPracticeQueue(history: StoredSessionSummary[], limit: number = DEFAULT_QUEUE_LIMIT): PracticeQueueItem[] {
  if (history.length === 0) return [];

  const items: PracticeQueueItem[] = [];

  for (const miss of tallyMissedAyahs(history)) {
    items.push({
      type: 'ayah',
      priority: Math.min(100, miss.count * 25),
      surahId: miss.surahId,
      ayahNumber: miss.ayahNumber,
      textKey: 'recitationCoach.learning.queue.ayah',
      params: { surahId: String(miss.surahId), ayah: String(miss.ayahNumber) },
    });
  }

  for (const miss of tallyDifficultWords(history)) {
    items.push({
      type: 'word',
      priority: Math.min(100, miss.count * 20),
      surahId: miss.surahId,
      ayahNumber: miss.ayahNumber,
      wordIndex: miss.wordIndex,
      textKey: 'recitationCoach.learning.queue.word',
      params: { surahId: String(miss.surahId), ayah: String(miss.ayahNumber) },
    });
  }

  for (const miss of tallyWeakTajweedRules(history)) {
    items.push({
      type: 'tajweed-rule',
      priority: Math.min(100, miss.count * 15),
      ruleId: miss.ruleId,
      textKey: 'recitationCoach.learning.queue.tajweedRule',
      params: { rule: miss.ruleId },
    });
  }

  for (const surahId of recentlyLearnedSurahIds(history, RECENTLY_LEARNED_SESSION_WINDOW, RECENTLY_LEARNED_MAX_ATTEMPTS)) {
    items.push({
      type: 'surah-reinforcement',
      priority: 40,
      surahId,
      textKey: 'recitationCoach.learning.queue.surahReinforcement',
      params: { surahId: String(surahId) },
    });
  }

  for (const session of history.filter((s) => s.overallConfidence < LOW_CONFIDENCE_THRESHOLD)) {
    items.push({
      type: 'low-confidence-session',
      priority: Math.round(100 - session.overallConfidence),
      surahId: session.surahId,
      textKey: 'recitationCoach.learning.queue.lowConfidence',
      params: { surahId: String(session.surahId), confidence: String(session.overallConfidence) },
    });
  }

  return items.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

const FORGOTTEN_AYAH_PRIORITY = 90;
const NEEDS_REVIEW_AYAH_PRIORITY = 70;
const DUE_REVIEW_BASE_PRIORITY = 60;
/** Extra priority per day a review sits overdue, so a review due weeks ago outranks one that just became due today. */
const DUE_REVIEW_OVERDUE_BONUS_PER_DAY = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Everything `buildPracticeQueue` already ranks, plus the two Phase-7
 * signals the requirement adds: forgotten/needs-review ayahs (from the
 * Memorization Engine's already-computed status, consumed as output only)
 * and overdue spaced-repetition reviews (from the Review Scheduler's
 * already-filtered due list). Re-sorts and re-caps the combined set, so a
 * genuinely urgent forgotten ayah can outrank a merely-frequent mistake.
 */
export function buildSmartPracticeQueue(
  history: StoredSessionSummary[],
  ayahRecords: AyahMemorizationRecord[],
  dueReviews: ReviewScheduleEntry[],
  nowIso: string,
  limit: number = DEFAULT_QUEUE_LIMIT
): PracticeQueueItem[] {
  const baseItems = buildPracticeQueue(history, Number.MAX_SAFE_INTEGER);
  const extraItems: PracticeQueueItem[] = [];

  for (const record of ayahRecords) {
    const status = effectiveStatus(record, nowIso);
    if (status === 'forgotten') {
      extraItems.push({
        type: 'forgotten-ayah',
        priority: FORGOTTEN_AYAH_PRIORITY,
        surahId: record.surahId,
        ayahNumber: record.ayahNumber,
        textKey: 'recitationCoach.memorization.queue.forgottenAyah',
        params: { surahId: String(record.surahId), ayah: String(record.ayahNumber) },
      });
    } else if (status === 'needs-review') {
      extraItems.push({
        type: 'needs-review-ayah',
        priority: NEEDS_REVIEW_AYAH_PRIORITY,
        surahId: record.surahId,
        ayahNumber: record.ayahNumber,
        textKey: 'recitationCoach.memorization.queue.needsReviewAyah',
        params: { surahId: String(record.surahId), ayah: String(record.ayahNumber) },
      });
    }
  }

  const now = new Date(nowIso).getTime();
  for (const review of dueReviews) {
    const overdueDays = Math.max(0, Math.floor((now - new Date(review.dueDateIso).getTime()) / DAY_MS));
    extraItems.push({
      type: 'due-review',
      priority: Math.min(100, DUE_REVIEW_BASE_PRIORITY + overdueDays * DUE_REVIEW_OVERDUE_BONUS_PER_DAY),
      surahId: review.surahId,
      ayahNumber: review.ayahNumber,
      textKey: 'recitationCoach.memorization.queue.dueReview',
      params: { surahId: String(review.surahId), ayah: String(review.ayahNumber) },
    });
  }

  return [...baseItems, ...extraItems].sort((a, b) => b.priority - a.priority).slice(0, limit);
}
