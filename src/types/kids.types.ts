import type { TranslationKey } from 'i18n';

export interface AlphabetLetter {
  id: string;
  order: number;
  arabic: string;
  transliteration: string;
  /** public/audio/kids-alphabet/{id}.mp3 */
  audioUrl: string;
}

export type KidsFigureType = 'prophet' | 'sahabi';

export interface KidsStory {
  id: string;
  type: KidsFigureType;
  nameArabic: string;
  nameEnglish: string;
  /** Short, kid-friendly, cross-checked against a general reference — not a narrative retelling. */
  summary: string;
  /**
   * Detailed, kid-friendly narrative retelling (paragraphs, shown in order
   * on the story page). Quran-based and uncontroversial; the `summary`
   * remains the card blurb. Sahabah stories keep this empty.
   */
  sections?: string[];
  /** Real Quran verse keys about this figure — fetched live (api/quran/quranClient.ts), not paraphrased. */
  verseRefs: string[];
  /** Key into the symbolic (non-figurative) illustration map — features/kids/components/StoryIllustration.tsx. */
  illustrationSymbol: string;
  accentColor: string;
}

export interface BeginnerLesson {
  surahId: number;
  /** Surah name — proper noun, intentionally untranslated. */
  title: string;
  focusKey: TranslationKey;
}

export interface MannerTip {
  id: string;
  tipKey: TranslationKey;
  bookSlug: string;
  idInBook: number;
}

export interface SimplifiedHadithRef {
  id: string;
  bookSlug: string;
  idInBook: number;
  kidFramingKey: TranslationKey;
}

export type RamadanEidOccasion = 'ramadan' | 'eid';

export interface RamadanEidActivity {
  id: string;
  occasion: RamadanEidOccasion;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}

export type BadgeId =
  | 'alphabet-explorer'
  | 'quiz-whiz'
  | 'story-time'
  | 'daily-learner'
  | 'quran-beginner'
  | 'good-manners';

export interface BadgeDefinition {
  id: BadgeId;
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface LetterLearnedPayload {
  kind: 'letterLearned';
  letterId: string;
}

export interface QuizResultPayload {
  kind: 'quizResult';
  quizId: string;
  score: number;
  total: number;
}

export interface BadgeEarnedPayload {
  kind: 'badgeEarned';
  badgeId: BadgeId;
}

export interface LessonCompletedPayload {
  kind: 'lessonCompleted';
  surahId: number;
}

export interface DailyActivityPayload {
  kind: 'dailyActivity';
  date: string;
  actionsCount: number;
}

export type ViewedContentCategory = 'story' | 'mannerTip';

export interface ContentViewedPayload {
  kind: 'contentViewed';
  category: ViewedContentCategory;
  itemId: string;
}

export type KidsProgressPayload =
  | LetterLearnedPayload
  | QuizResultPayload
  | BadgeEarnedPayload
  | LessonCompletedPayload
  | DailyActivityPayload
  | ContentViewedPayload;
