import type { PracticeQueueItem } from './practiceQueueEngine';
import type { WeaknessRanking } from './learningProfileEngine';
import type { ReviewScheduleEntry } from './reviewScheduler';
import type { DailyGoal } from './goalEngine';
import type { PracticeModeConfig } from './practiceModes';
import type { TranslationKey } from 'i18n/types';

/**
 * The Adaptive Session Builder: picks one concrete practice-mode
 * recommendation from everything else this phase already computes
 * (Practice Queue, Weakness Analysis, Review Schedule, Goals) plus the
 * time the reciter actually has available. It's a pure decision function
 * — a fixed, documented priority order of "does this situation apply"
 * checks, each producing a genuinely different config depending on the
 * inputs, never a fixed script.
 */

export interface BuiltPracticeSession {
  modeConfig: PracticeModeConfig;
  rationaleKey: TranslationKey;
  rationaleParams?: Record<string, string>;
  estimatedMinutes: number;
}

export interface SessionBuilderContext {
  practiceQueue: PracticeQueueItem[];
  weaknesses: WeaknessRanking[];
  dueReviews: ReviewScheduleEntry[];
  dailyGoal: DailyGoal;
  /** How much time the reciter actually has for this session — every estimate below is capped at this, never exceeding what they asked for. */
  availableMinutes: number;
}

const MIN_SESSION_MINUTES = 5;
const MINUTES_PER_REVIEW_ITEM = 2;
const MINUTES_PER_WORD_ITEM = 1;
const MINUTES_PER_MISTAKE_AYAH = 2;
const MIN_WORD_ITEMS_FOR_WEAK_WORDS_MODE = 3;

/**
 * Priority order, most urgent first: overdue spaced-repetition reviews
 * take precedence (spaced repetition only works if due reviews actually
 * happen close to their due date), then a cluster of specific difficult
 * words, then a dominant tajweed weakness, then any lingering
 * frequently-missed ayahs, falling back to continuing the current surah
 * when nothing more specific stands out.
 */
export function buildAdaptiveSession(context: SessionBuilderContext): BuiltPracticeSession {
  if (context.dueReviews.length > 0) {
    const surahId = context.dueReviews[0]!.surahId;
    return {
      modeConfig: { mode: 'revision-mode', surahId, ayahNumbers: context.dueReviews.map((review) => review.ayahNumber) },
      rationaleKey: 'recitationCoach.memorization.sessionBuilder.reasonDueReviews',
      rationaleParams: { count: String(context.dueReviews.length) },
      estimatedMinutes: Math.min(context.availableMinutes, Math.max(MIN_SESSION_MINUTES, context.dueReviews.length * MINUTES_PER_REVIEW_ITEM)),
    };
  }

  const wordItems = context.practiceQueue.filter((item) => item.type === 'word');
  if (wordItems.length >= MIN_WORD_ITEMS_FOR_WEAK_WORDS_MODE) {
    const ayahNumbers = Array.from(new Set(wordItems.map((item) => item.ayahNumber).filter((ayah): ayah is number => ayah !== undefined)));
    return {
      modeConfig: { mode: 'weak-words', surahId: wordItems[0]!.surahId, ayahNumbers },
      rationaleKey: 'recitationCoach.memorization.sessionBuilder.reasonWeakWords',
      rationaleParams: { count: String(wordItems.length) },
      estimatedMinutes: Math.min(context.availableMinutes, Math.max(MIN_SESSION_MINUTES, wordItems.length * MINUTES_PER_WORD_ITEM)),
    };
  }

  const topWeakness = context.weaknesses[0];
  if (topWeakness && (topWeakness.category === 'shortens-madd' || topWeakness.category === 'ghunnah-mistakes')) {
    const ruleId = topWeakness.category === 'shortens-madd' ? 'madd' : 'ghunnah';
    return {
      modeConfig: { mode: 'tajweed-practice', ruleId },
      rationaleKey: 'recitationCoach.memorization.sessionBuilder.reasonTajweedFocus',
      rationaleParams: { rule: ruleId },
      estimatedMinutes: Math.min(context.availableMinutes, Math.max(MIN_SESSION_MINUTES, context.dailyGoal.targetMinutes)),
    };
  }

  const ayahItems = context.practiceQueue.filter((item) => item.type === 'ayah');
  if (ayahItems.length > 0) {
    const ayahNumbers = ayahItems.map((item) => item.ayahNumber).filter((ayah): ayah is number => ayah !== undefined);
    return {
      modeConfig: { mode: 'mistake-review', surahId: ayahItems[0]!.surahId, ayahNumbers },
      rationaleKey: 'recitationCoach.memorization.sessionBuilder.reasonMistakeReview',
      rationaleParams: { count: String(ayahItems.length) },
      estimatedMinutes: Math.min(context.availableMinutes, Math.max(MIN_SESSION_MINUTES, ayahItems.length * MINUTES_PER_MISTAKE_AYAH)),
    };
  }

  return {
    modeConfig: { mode: 'full-surah' },
    rationaleKey: 'recitationCoach.memorization.sessionBuilder.reasonContinue',
    estimatedMinutes: Math.min(context.availableMinutes, Math.max(MIN_SESSION_MINUTES, context.dailyGoal.targetMinutes)),
  };
}
