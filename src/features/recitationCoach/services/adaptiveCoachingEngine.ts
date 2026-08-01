import type { CoachingLevel } from './coachingEngine';
import type { LearningProfile, WeaknessCategory, WeaknessRanking } from './learningProfileEngine';
import type { TranslationKey } from 'i18n/types';

/**
 * The Adaptive Coaching Engine: decides what CoachingLevel this reciter's
 * history suggests, and which weakness topics deserve extra coaching
 * attention because they've shown up repeatedly rather than once. This is
 * a *decision*, not a behavior change in itself — coachingEngine.ts and its
 * CoachingLevel config are untouched; the caller (useLearningProfile /
 * RecitationCoachPage) is the one that applies this decision, e.g. as the
 * default level shown to a first-time-this-session user, exactly the same
 * way scoringEngine.ts's output is consumed without scoringEngine ever
 * reaching into coachingEngine's internals.
 */

export interface AdaptiveCoachingDecision {
  recommendedLevel: CoachingLevel;
  reasonKey: TranslationKey;
  /** Weaknesses that have shown up frequently enough, across enough sessions, to warrant increased coaching attention — see thresholds below. */
  attentionTopics: WeaknessCategory[];
}

/** Fewer sessions than this and there simply isn't enough history to trust an elevated level yet — defaults to the most supportive level regardless of any single good session. */
const MIN_SESSIONS_FOR_INTERMEDIATE = 5;
const MIN_SESSIONS_FOR_ADVANCED = 15;
const ADVANCED_ACCURACY_THRESHOLD = 85;
const ADVANCED_TAJWEED_THRESHOLD = 80;
const INTERMEDIATE_ACCURACY_THRESHOLD = 65;

/** A weakness needs to appear in at least this fraction of analyzed sessions, across at least this many sessions, before it's "repeated across multiple sessions" rather than a one-off. */
const ATTENTION_FREQUENCY_THRESHOLD = 40;
const MIN_SESSIONS_FOR_ATTENTION = 3;

export function decideAdaptiveCoaching(profile: LearningProfile, weaknesses: WeaknessRanking[]): AdaptiveCoachingDecision {
  let recommendedLevel: CoachingLevel;
  let reasonKey: TranslationKey;

  if (profile.totalSessions < MIN_SESSIONS_FOR_INTERMEDIATE) {
    recommendedLevel = 'beginner';
    reasonKey = 'recitationCoach.learning.adaptive.reason.newLearner';
  } else if (
    profile.totalSessions >= MIN_SESSIONS_FOR_ADVANCED &&
    profile.averageAccuracy >= ADVANCED_ACCURACY_THRESHOLD &&
    profile.averageTajweedScore >= ADVANCED_TAJWEED_THRESHOLD
  ) {
    recommendedLevel = 'advanced';
    reasonKey = 'recitationCoach.learning.adaptive.reason.experienced';
  } else if (profile.averageAccuracy >= INTERMEDIATE_ACCURACY_THRESHOLD) {
    recommendedLevel = 'intermediate';
    reasonKey = 'recitationCoach.learning.adaptive.reason.progressing';
  } else {
    recommendedLevel = 'beginner';
    reasonKey = 'recitationCoach.learning.adaptive.reason.needsSupport';
  }

  const attentionTopics = weaknesses
    .filter((weakness) => weakness.frequency >= ATTENTION_FREQUENCY_THRESHOLD && weakness.sessionsAnalyzed >= MIN_SESSIONS_FOR_ATTENTION)
    .map((weakness) => weakness.category);

  return { recommendedLevel, reasonKey, attentionTopics };
}
