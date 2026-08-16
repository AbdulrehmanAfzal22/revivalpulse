import type { QuizQuestion } from 'types/quiz.types';
import { QUIZ_PROPHETS } from './prophets';
import { QUIZ_SALAH } from './salah';
import { QUIZ_DUAS } from './duas';
import { QUIZ_ADAB } from './adab';
import { QUIZ_QURAN } from './quran';
import { QUIZ_WORSHIP } from './worship';
import { QUIZ_CALENDAR } from './calendar';

/**
 * Phase 4 expanded quiz bank (1000+ questions across 7 topics).
 *
 * Content discipline:
 * - Every question carries at least one source (Qur'an, hadith, seerah, or
 *   mainstream-fiqh consensus) in `sources` with `needsVerification: true`.
 * - Every question is written for a kids audience (plain language, no
 *   unnecessary scare or gore details).
 * - ids are unique across the whole bank (`topic-slug` pattern).
 * - `QUIZ_CONTENT_REVIEWED` stays false until a human has fact-checked the
 *   expanded bank; the banner is shown in the quiz UI.
 */
export const QUIZ_BANK: QuizQuestion[] = [
  ...QUIZ_PROPHETS,
  ...QUIZ_SALAH,
  ...QUIZ_DUAS,
  ...QUIZ_ADAB,
  ...QUIZ_QURAN,
  ...QUIZ_WORSHIP,
  ...QUIZ_CALENDAR,
];

export const QUIZ_CONTENT_REVIEWED = false;

export const QUIZ_CONTENT_REVIEW_BANNER =
  'Quiz content is a draft pending human review (see src/data/kids/quizBank/).';

export function quizQuestionsByCategory(category: string): QuizQuestion[] {
  return QUIZ_BANK.filter((q) => q.category === category);
}
