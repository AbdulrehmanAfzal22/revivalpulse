import type { EngineId } from './gameRegistry';

export type Tier = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  [engine: string]: {
    easy: DifficultyValues;
    medium: DifficultyValues;
    hard: DifficultyValues;
  };
}

export type DifficultyValue = string | number | boolean | [number, number];
export type DifficultyValues = Record<string, DifficultyValue>;

export const DIFFICULTY_CONFIG: DifficultyConfig = {
  match: {
    easy: { pairCount: 3, timeLimit: 0, scoreMultiplier: 1.0, hintAfterMs: 8000 },
    medium: { pairCount: 5, timeLimit: 0, scoreMultiplier: 1.25, hintAfterMs: 6000 },
    hard: { pairCount: 7, timeLimit: 0, scoreMultiplier: 1.5, hintAfterMs: 4000 },
  },
  memory: {
    easy: { pairCount: 4, timeLimit: 0, scoreMultiplier: 1.0, previewMs: 2000 },
    medium: { pairCount: 6, timeLimit: 0, scoreMultiplier: 1.25, previewMs: 1500 },
    hard: { pairCount: 8, timeLimit: 0, scoreMultiplier: 1.5, previewMs: 1000 },
  },
  pop: {
    easy: { balloonCount: 4, riseSpeedMultiplier: 1.0, spawnInterval: 1.2, timeLimit: 0, scoreMultiplier: 1.0 },
    medium: { balloonCount: 6, riseSpeedMultiplier: 0.85, spawnInterval: 0.9, timeLimit: 0, scoreMultiplier: 1.25 },
    hard: { balloonCount: 8, riseSpeedMultiplier: 0.7, spawnInterval: 0.6, timeLimit: 0, scoreMultiplier: 1.5 },
  },
  spot: {
    easy: { optionCount: 4, timeLimit: 0, scoreMultiplier: 1.0, showTargetMs: 0 },
    medium: { optionCount: 6, timeLimit: 0, scoreMultiplier: 1.25, showTargetMs: 0 },
    hard: { optionCount: 8, timeLimit: 5000, scoreMultiplier: 1.5, showTargetMs: 3000 },
  },
  hunt: {
    easy: { cellCount: 20, targetCount: 5, timeLimit: 0, scoreMultiplier: 1.0, highlightTarget: true },
    medium: { cellCount: 25, targetCount: 5, timeLimit: 0, scoreMultiplier: 1.25, highlightTarget: false },
    hard: { cellCount: 30, targetCount: 7, timeLimit: 30000, scoreMultiplier: 1.5, highlightTarget: false },
  },
  order: {
    easy: { itemCount: 4, maxGap: 1, timeLimit: 0, scoreMultiplier: 1.0, showNumbers: true },
    medium: { itemCount: 5, maxGap: 2, timeLimit: 0, scoreMultiplier: 1.25, showNumbers: true },
    hard: { itemCount: 6, maxGap: 3, timeLimit: 20000, scoreMultiplier: 1.5, showNumbers: false },
  },
  spell: {
    easy: { distractorCount: 2, wordCount: 5, timeLimit: 0, scoreMultiplier: 1.0, showWordFirst: true },
    medium: { distractorCount: 4, wordCount: 5, timeLimit: 0, scoreMultiplier: 1.25, showWordFirst: true },
    hard: { distractorCount: 6, wordCount: 5, timeLimit: 30000, scoreMultiplier: 1.5, showWordFirst: false },
  },
  countstars: {
    easy: { minCount: 2, maxCount: 6, spread: 1, timeLimit: 0, scoreMultiplier: 1.0, showCount: false },
    medium: { minCount: 4, maxCount: 8, spread: 2, timeLimit: 0, scoreMultiplier: 1.25, showCount: false },
    hard: { minCount: 5, maxCount: 10, spread: 3, timeLimit: 10000, scoreMultiplier: 1.5, showCount: false },
  },
  truefalse: {
    easy: { roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.0 },
    medium: { roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.25 },
    hard: { roundsToWin: 12, timeLimit: 8000, scoreMultiplier: 1.5 },
  },
  storyquiz: {
    easy: { filterDifficulty: 'easy', roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.0 },
    medium: { filterDifficulty: 'medium', roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.25 },
    hard: { filterDifficulty: 'hard', roundsToWin: 12, timeLimit: 15000, scoreMultiplier: 1.5 },
  },
  wordfinder: {
    easy: { optionCount: 4, roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.0, showEnglish: true },
    medium: { optionCount: 6, roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.25, showEnglish: true },
    hard: { optionCount: 8, roundsToWin: 12, timeLimit: 15000, scoreMultiplier: 1.5, showEnglish: false },
  },
  lettercount: {
    easy: { wordLengthRange: [3, 5] as [number, number], roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.0, showArabic: true },
    medium: { wordLengthRange: [5, 7] as [number, number], roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.25, showArabic: true },
    hard: { wordLengthRange: [7, 9] as [number, number], roundsToWin: 12, timeLimit: 10000, scoreMultiplier: 1.5, showArabic: false },
  },

  // --- NEW REPLACEMENT GAMES (Phase 7) ---

  /** Halal or Haram: drag items into two baskets — basic fiqh categorization */
  halalharam: {
    easy: { itemCount: 6, optionCount: 2, roundsToWin: 6, timeLimit: 0, scoreMultiplier: 1.0, showCategoryHint: true },
    medium: { itemCount: 8, optionCount: 2, roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.25, showCategoryHint: true },
    hard: { itemCount: 10, optionCount: 2, roundsToWin: 10, timeLimit: 20000, scoreMultiplier: 1.5, showCategoryHint: false },
  },

  /** Good Manners Scenario: short situation, pick the Islamically good response */
  goodmanners: {
    easy: { optionCount: 2, roundsToWin: 6, timeLimit: 0, scoreMultiplier: 1.0, showHadithRef: true },
    medium: { optionCount: 3, roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.25, showHadithRef: true },
    hard: { optionCount: 3, roundsToWin: 10, timeLimit: 15000, scoreMultiplier: 1.5, showHadithRef: false },
  },

  /** Wudu Order Rush: tap body parts in correct wudu sequence on illustrated figure */
  wuduorder: {
    easy: { stepCount: 6, roundsToWin: 5, timeLimit: 0, scoreMultiplier: 1.0, showNumbers: true, allowSkip: true },
    medium: { stepCount: 8, roundsToWin: 6, timeLimit: 0, scoreMultiplier: 1.25, showNumbers: true, allowSkip: false },
    hard: { stepCount: 10, roundsToWin: 8, timeLimit: 30000, scoreMultiplier: 1.5, showNumbers: false, allowSkip: false },
  },

  /** 99 Names Meaning Match: given a Name, tap its correct meaning */
  namesmeaning: {
    easy: { optionCount: 3, roundsToWin: 6, timeLimit: 0, scoreMultiplier: 1.0, showArabic: true, showTransliteration: true },
    medium: { optionCount: 4, roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.25, showArabic: true, showTransliteration: true },
    hard: { optionCount: 5, roundsToWin: 10, timeLimit: 15000, scoreMultiplier: 1.5, showArabic: true, showTransliteration: false },
  },

  /** Prophet Timeline Sort: drag Prophet name-cards onto chronological order slider */
  prophettimeline: {
    easy: { prophetCount: 5, roundsToWin: 5, timeLimit: 0, scoreMultiplier: 1.0, showDates: true, snapTolerance: 2 },
    medium: { prophetCount: 8, roundsToWin: 6, timeLimit: 0, scoreMultiplier: 1.25, showDates: true, snapTolerance: 1 },
    hard: { prophetCount: 12, roundsToWin: 8, timeLimit: 45000, scoreMultiplier: 1.5, showDates: false, snapTolerance: 0 },
  },

  /** Cause and Effect: Good Deeds — short scenario, pick the outcome that follows */
  causeeffect: {
    easy: { optionCount: 2, roundsToWin: 6, timeLimit: 0, scoreMultiplier: 1.0, showLesson: true },
    medium: { optionCount: 3, roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.25, showLesson: true },
    hard: { optionCount: 3, roundsToWin: 10, timeLimit: 15000, scoreMultiplier: 1.5, showLesson: false },
  },

  /** Dua for the Moment: given situation icon, tap matching short dua */
  duamoment: {
    easy: { optionCount: 3, roundsToWin: 6, timeLimit: 0, scoreMultiplier: 1.0, showArabic: true, showTranslation: true },
    medium: { optionCount: 4, roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.25, showArabic: true, showTranslation: true },
    hard: { optionCount: 5, roundsToWin: 10, timeLimit: 15000, scoreMultiplier: 1.5, showArabic: true, showTranslation: false },
  },

  /** Letter Sound Match: hear Arabic letter sound, tap matching letter */
  lettersound: {
    easy: { optionCount: 4, roundsToWin: 8, timeLimit: 0, scoreMultiplier: 1.0, allowReplay: true, similarSounds: false },
    medium: { optionCount: 5, roundsToWin: 10, timeLimit: 0, scoreMultiplier: 1.25, allowReplay: true, similarSounds: true },
    hard: { optionCount: 6, roundsToWin: 12, timeLimit: 15000, scoreMultiplier: 1.5, allowReplay: false, similarSounds: true },
  },
};

export function getDifficultyConfig(engine: EngineId, tier: Tier) {
  return DIFFICULTY_CONFIG[engine]?.[tier] ?? {};
}

export function getAllDifficultyConfigs(engine: EngineId) {
  return DIFFICULTY_CONFIG[engine] ?? { easy: {}, medium: {}, hard: {} };
}