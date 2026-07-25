import type { ReadingMode, ReadingPreferences } from 'types/readingPreferences.types';
import type { TranslationKey } from 'i18n';

export const READING_MODES: ReadingMode[] = [
  'standard',
  'focus',
  'study',
  'memorization',
  'teacher',
  'child',
];

export const READING_MODE_LABEL_KEYS: Record<ReadingMode, TranslationKey> = {
  standard: 'quran.readingMode.standard.label',
  focus: 'quran.readingMode.focus.label',
  study: 'quran.readingMode.study.label',
  memorization: 'quran.readingMode.memorization.label',
  teacher: 'quran.readingMode.teacher.label',
  child: 'quran.readingMode.child.label',
};

export const READING_MODE_DESCRIPTION_KEYS: Record<ReadingMode, TranslationKey> = {
  standard: 'quran.readingMode.standard.description',
  focus: 'quran.readingMode.focus.description',
  study: 'quran.readingMode.study.description',
  memorization: 'quran.readingMode.memorization.description',
  teacher: 'quran.readingMode.teacher.description',
  child: 'quran.readingMode.child.description',
};

/** Applying a mode sets these fields; every field stays individually adjustable afterward. */
export const READING_MODE_PRESETS: Record<ReadingMode, Partial<ReadingPreferences>> = {
  standard: {
    arabicFontSize: 28,
    translationFontSize: 16,
    lineSpacing: 2,
    paragraphSpacing: 16,
    showTranslation: true,
  },
  focus: {
    arabicFontSize: 32,
    translationFontSize: 15,
    lineSpacing: 2.2,
    paragraphSpacing: 20,
    showTranslation: false,
  },
  study: {
    arabicFontSize: 26,
    translationFontSize: 17,
    lineSpacing: 2,
    paragraphSpacing: 24,
    showTranslation: true,
  },
  memorization: {
    arabicFontSize: 34,
    translationFontSize: 16,
    lineSpacing: 2.4,
    paragraphSpacing: 20,
    showTranslation: false,
  },
  teacher: {
    arabicFontSize: 40,
    translationFontSize: 20,
    lineSpacing: 2.2,
    paragraphSpacing: 24,
    showTranslation: true,
  },
  child: {
    arabicFontSize: 36,
    translationFontSize: 18,
    lineSpacing: 2.4,
    wordSpacing: 4,
    paragraphSpacing: 24,
    showTranslation: true,
  },
};
