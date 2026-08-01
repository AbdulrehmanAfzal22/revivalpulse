import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildAllTrends,
  deriveLearningProfile,
  detectStrengths,
  detectWeaknesses,
  generateLearningInsights,
  generateMotivationMessages,
  toStoredSessionSummary,
} from '../services/learningProfileEngine';
import type {
  LearningProfile,
  StoredSessionSummary,
  StrengthRanking,
  TrendDimension,
  TrendSeries,
  WeaknessRanking,
} from '../services/learningProfileEngine';
import { appendSessionToStore, loadLearningStore, saveLearningStore } from '../services/learningProfileStorage';
import type { LearningStoreData } from '../services/learningProfileStorage';
import { generateDailyPracticePlan, generateSmartRecommendations } from '../services/recommendationEngine';
import type { DailyPracticePlan, RecommendationContext, SmartRecommendation } from '../services/recommendationEngine';
import { buildPracticeQueue } from '../services/practiceQueueEngine';
import type { PracticeQueueItem } from '../services/practiceQueueEngine';
import { decideAdaptiveCoaching } from '../services/adaptiveCoachingEngine';
import type { AdaptiveCoachingDecision } from '../services/adaptiveCoachingEngine';
import type { CoachingAnalyticsEvent } from '../services/coachingEngine';
import type { ScoreInsight } from '../services/scoringEngine';
import type { UseScoringEngineResult } from './useScoringEngine';

export interface UseLearningProfileResult {
  profile: LearningProfile;
  history: StoredSessionSummary[];
  weaknesses: WeaknessRanking[];
  strengths: StrengthRanking[];
  trends: Record<TrendDimension, TrendSeries>;
  motivationMessages: ScoreInsight[];
  learningInsights: ScoreInsight[];
  smartRecommendations: SmartRecommendation[];
  dailyPracticePlan: DailyPracticePlan;
  practiceQueue: PracticeQueueItem[];
  adaptiveDecision: AdaptiveCoachingDecision;
}

/**
 * Wraps the four pure Phase 6 engines (Learning Profile, Recommendation,
 * Practice Queue, Adaptive Coaching) with persistence and live wiring:
 * loads the on-device store once on mount, appends a new
 * StoredSessionSummary whenever Phase 5's Scoring Engine finishes a
 * session (consuming only its already-computed `sessionRecord` output,
 * never reaching into scoring/tajweed/coaching internals), and re-derives
 * every downstream analysis via `useMemo` keyed on the store — so none of
 * this ever runs on the per-word hot path, only once per completed
 * session. That's what makes this "asynchronous" and non-blocking for live
 * recitation: it is structurally impossible for this hook's work to be
 * triggered by anything other than a session finishing.
 */
export function useLearningProfile(scoring: UseScoringEngineResult, recentCoachingEvents: CoachingAnalyticsEvent[]): UseLearningProfileResult {
  const [store, setStore] = useState<LearningStoreData>(() => loadLearningStore());
  const lastProcessedSessionIdRef = useRef<string | null>(null);
  const recentCoachingEventsRef = useRef(recentCoachingEvents);
  recentCoachingEventsRef.current = recentCoachingEvents;

  useEffect(() => {
    const record = scoring.sessionRecord;
    if (!record || record.id === lastProcessedSessionIdRef.current) return;
    lastProcessedSessionIdRef.current = record.id;

    const summary = toStoredSessionSummary(record, recentCoachingEventsRef.current);
    setStore((prev) => {
      const next = appendSessionToStore(prev, summary);
      saveLearningStore(next);
      return next;
    });
  }, [scoring.sessionRecord]);

  return useMemo(() => {
    const profile = deriveLearningProfile(store.totals);
    const weaknesses = detectWeaknesses(store.history);
    const strengths = detectStrengths(store.history);
    const trends = buildAllTrends(store.history);
    const motivationMessages = generateMotivationMessages(store.history);
    const learningInsights = generateLearningInsights(store.history);
    const latestSession = store.history.length > 0 ? store.history[store.history.length - 1]! : null;

    const recommendationContext: RecommendationContext = { history: store.history, weaknesses, latestSession };
    const smartRecommendations = generateSmartRecommendations(recommendationContext);
    const dailyPracticePlan = generateDailyPracticePlan(recommendationContext);
    const practiceQueue = buildPracticeQueue(store.history);
    const adaptiveDecision = decideAdaptiveCoaching(profile, weaknesses);

    return {
      profile,
      history: store.history,
      weaknesses,
      strengths,
      trends,
      motivationMessages,
      learningInsights,
      smartRecommendations,
      dailyPracticePlan,
      practiceQueue,
      adaptiveDecision,
    };
  }, [store]);
}
