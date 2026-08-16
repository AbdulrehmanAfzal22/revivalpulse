import type { TrueFalseQuestion } from 'types/quiz.types';
import { TRUE_FALSE_PROPHETS } from './prophets';
import { TRUE_FALSE_WORSHIP_SALAH } from './worshipSalah';
import { TRUE_FALSE_DUAS_ADAB } from './duasAdab';
import { TRUE_FALSE_QURAN_BASICS } from './quranBasics';
import { TRUE_FALSE_ARABIC_BASICS } from './arabicBasics';
import { TRUE_FALSE_CALENDAR } from './calendar';

/**
 * Phase 4 expanded true/false bank (1000+ statements across 6 topics).
 *
 * Content discipline:
 * - Every statement carries at least one source (Qur'an, hadith, seerah, or
 *   mainstream-fiqh consensus) in `sources` with `needsVerification: true`.
 * - A TRUE statement asserts a sourced fact; a FALSE statement contradicts a
 *   sourced fact (its `sources` support the correct answer).
 * - Written for a kids audience (plain language, no unnecessary scare or
 *   gore details).
 * - ids are unique across the whole bank (`topic-slug` pattern).
 * - `TRUE_FALSE_CONTENT_REVIEWED` stays false until a human has fact-checked
 *   the expanded bank.
 */
export const TRUE_FALSE_BANK: TrueFalseQuestion[] = [
  ...TRUE_FALSE_PROPHETS,
  ...TRUE_FALSE_WORSHIP_SALAH,
  ...TRUE_FALSE_DUAS_ADAB,
  ...TRUE_FALSE_QURAN_BASICS,
  ...TRUE_FALSE_ARABIC_BASICS,
  ...TRUE_FALSE_CALENDAR,
];

export const TRUE_FALSE_CONTENT_REVIEWED = false;

export const TRUE_FALSE_CONTENT_REVIEW_BANNER =
  'True/false content is a draft pending human review (see src/data/kids/trueFalseBank/).';