import { useEffect, useMemo, useRef, useState } from 'react';
import { computeSurahMastery, computeWordMasteryFromHistory, updateAyahMemorization } from '../services/memorizationEngine';
import type { AyahMemorizationRecord, SurahMastery, WordMastery } from '../services/memorizationEngine';
import { computeReviewQuality, getDueReviews, scheduleNextReview } from '../services/reviewScheduler';
import type { ReviewScheduleEntry } from '../services/reviewScheduler';
import {
  addUnlockedAchievements,
  loadMemorizationStore,
  saveMemorizationStore,
  upsertAyahRecord,
  upsertReviewScheduleEntry,
} from '../services/memorizationStorage';
import type { MemorizationStoreData } from '../services/memorizationStorage';
import { evaluateNewAchievements } from '../services/achievementEngine';
import type { AchievementEvaluationContext, AchievementId } from '../services/achievementEngine';
import { buildSmartPracticeQueue } from '../services/practiceQueueEngine';
import type { PracticeQueueItem } from '../services/practiceQueueEngine';
import {
  computeDailyProgress,
  computeWeeklyProgress,
  generateDailyGoal,
  generateWeeklyGoal,
} from '../services/goalEngine';
import type { DailyGoal, DailyGoalProgress, WeeklyGoal, WeeklyGoalProgress } from '../services/goalEngine';
import { buildAdaptiveSession } from '../services/sessionBuilder';
import type { BuiltPracticeSession } from '../services/sessionBuilder';
import type { UseScoringEngineResult } from './useScoringEngine';
import type { UseLearningProfileResult } from './useLearningProfile';

export interface UseMemorizationResult {
  ayahRecords: AyahMemorizationRecord[];
  reviewSchedule: ReviewScheduleEntry[];
  unlockedAchievements: AchievementId[];
  dueReviews: ReviewScheduleEntry[];
  smartPracticeQueue: PracticeQueueItem[];
  dailyGoal: DailyGoal;
  dailyProgress: DailyGoalProgress;
  weeklyGoal: WeeklyGoal;
  weeklyProgress: WeeklyGoalProgress;
  builtSession: BuiltPracticeSession;
  wordMastery: WordMastery[];
  surahMasteryFor: (surahId: number) => SurahMastery;
}

/**
 * Wraps the Phase 7 engines (Memorization, Review Scheduler, Achievement,
 * Practice Queue extension, Goal, Session Builder) with persistence and
 * live wiring — the same shape as useLearningProfile: everything here is
 * gated on Phase 5's `scoring.sessionRecord` appearing (never the per-word
 * hot path), and every downstream computation is a `useMemo` keyed on the
 * persisted store, so this hook's cost is paid once per completed session,
 * not once per render.
 *
 * Consumes Phase 5's fresh, in-memory `scoring.report.ayahAnalyses`
 * directly (the same per-ayah detail Phase 6 deliberately doesn't persist
 * long-term) and Phase 6's already-computed `learning.history`/`profile` —
 * never reaching into Scoring, Tajweed, Coaching, or Learning-Profile
 * internals.
 */
export function useMemorization(scoring: UseScoringEngineResult, learning: UseLearningProfileResult): UseMemorizationResult {
  const [store, setStore] = useState<MemorizationStoreData>(() => loadMemorizationStore());
  const storeRef = useRef(store);
  storeRef.current = store;
  const lastProcessedSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    const record = scoring.sessionRecord;
    if (!record || record.id === lastProcessedSessionIdRef.current) return;

    // Waits for Phase 6's history to actually include this session before
    // evaluating achievements against it — the same cross-hook-timing
    // consideration useScoringEngine applies when waiting on Tajweed's
    // report: both hooks react to the same session-completion signal in
    // the same commit, but useLearningProfile's own state update needs one
    // more render to propagate down as this hook's `learning.history` prop.
    const latestInHistory = learning.history[learning.history.length - 1];
    if (!latestInHistory || latestInHistory.id !== record.id) return;

    lastProcessedSessionIdRef.current = record.id;

    const dateIso = record.dateIso;
    const surahId = record.surahId;
    let nextStore = storeRef.current;

    for (const ayah of record.report.ayahAnalyses) {
      const existingRecord = nextStore.ayahRecords.find((r) => r.surahId === surahId && r.ayahNumber === ayah.ayahNumber) ?? null;
      const updatedRecord = updateAyahMemorization(
        existingRecord,
        { accuracy: ayah.accuracy, tajweedScore: ayah.tajweedScore, fluency: ayah.fluency, mistakes: ayah.mistakes },
        surahId,
        ayah.ayahNumber,
        dateIso
      );
      nextStore = upsertAyahRecord(nextStore, updatedRecord);

      const existingReview = nextStore.reviewSchedule.find((entry) => entry.surahId === surahId && entry.ayahNumber === ayah.ayahNumber) ?? null;
      const quality = computeReviewQuality({
        accuracy: ayah.accuracy,
        tajweedScore: ayah.tajweedScore,
        averageConfidence: ayah.averageConfidence,
        mistakes: ayah.mistakes,
      });
      const nextReview = scheduleNextReview(existingReview, surahId, ayah.ayahNumber, quality, dateIso);
      nextStore = upsertReviewScheduleEntry(nextStore, nextReview);
    }

    const achievementContext: AchievementEvaluationContext = {
      latestSessionSummary: latestInHistory,
      latestAyahQualities: record.report.ayahAnalyses.map((ayah) => ({ accuracy: ayah.accuracy, mistakes: ayah.mistakes })),
      history: learning.history,
      profile: learning.profile,
    };
    const newlyUnlocked = evaluateNewAchievements(achievementContext, nextStore.unlockedAchievements);
    nextStore = addUnlockedAchievements(nextStore, newlyUnlocked);

    storeRef.current = nextStore;
    saveMemorizationStore(nextStore);
    setStore(nextStore);
  }, [scoring.sessionRecord, learning.history, learning.profile]);

  return useMemo(() => {
    const nowIso = new Date().toISOString();
    const dueReviews = getDueReviews(store.reviewSchedule, nowIso);
    const smartPracticeQueue = buildSmartPracticeQueue(learning.history, store.ayahRecords, dueReviews, nowIso);
    const dailyGoal = generateDailyGoal(learning.profile, dueReviews.length, learning.weaknesses);
    const dailyProgress = computeDailyProgress(learning.history, store.reviewSchedule, nowIso);
    const weeklyGoal = generateWeeklyGoal(learning.profile, learning.history);
    const weeklyProgress = computeWeeklyProgress(learning.history, nowIso);
    const wordMastery = computeWordMasteryFromHistory(learning.history);
    const builtSession = buildAdaptiveSession({
      practiceQueue: smartPracticeQueue,
      weaknesses: learning.weaknesses,
      dueReviews,
      dailyGoal,
      availableMinutes: Math.max(dailyGoal.targetMinutes, 5),
    });

    return {
      ayahRecords: store.ayahRecords,
      reviewSchedule: store.reviewSchedule,
      unlockedAchievements: store.unlockedAchievements,
      dueReviews,
      smartPracticeQueue,
      dailyGoal,
      dailyProgress,
      weeklyGoal,
      weeklyProgress,
      builtSession,
      wordMastery,
      surahMasteryFor: (surahId: number) => computeSurahMastery(surahId, store.ayahRecords, nowIso),
    };
  }, [store, learning.history, learning.profile, learning.weaknesses]);
}
