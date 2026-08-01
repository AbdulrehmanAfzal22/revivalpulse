import type { TajweedRuleId } from './tajweedAnalysisEngine';

/**
 * The practice-mode vocabulary shared by the Session Builder and the
 * revision dashboard. This is a data model only — deliberately not wired
 * into `useRecitationSession`, which always tracks a full detected surah
 * start-to-finish and has no concept of "only these ayahs" today. Adding
 * that would mean changing `start()`'s signature, which this phase treats
 * as existing architecture to preserve rather than rewrite. The Session
 * Builder below produces a genuine, data-driven recommendation of *which*
 * mode and *which* ayahs/words/rules it targets; acting on that
 * recommendation to constrain live recitation is a follow-up integration,
 * not something silently pretended to already work here.
 */
export type PracticeMode =
  | 'full-surah'
  | 'selected-ayah'
  | 'weak-words'
  | 'tajweed-practice'
  | 'mistake-review'
  | 'revision-mode'
  | 'random-ayah-challenge'
  | 'timed-challenge'
  | 'continuous-recitation';

export const ALL_PRACTICE_MODES: PracticeMode[] = [
  'full-surah',
  'selected-ayah',
  'weak-words',
  'tajweed-practice',
  'mistake-review',
  'revision-mode',
  'random-ayah-challenge',
  'timed-challenge',
  'continuous-recitation',
];

export interface PracticeModeConfig {
  mode: PracticeMode;
  surahId?: number;
  ayahNumbers?: number[];
  ruleId?: TajweedRuleId;
  timeLimitMinutes?: number;
}
