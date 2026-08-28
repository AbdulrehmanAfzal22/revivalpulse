import type { ColorPreset, PageWidth, ReadingPreferences } from 'types/readingPreferences.types';
import { DEFAULT_TRANSLATION_IDS } from 'constants/translations';
import { DEFAULT_RECITER_ID } from 'constants/reciters';

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  arabicFont: 'uthmani',
  arabicFontSize: 33,
  translationFontSize: 19,
  lineSpacing: 1.8,
  wordSpacing: 12,
  paragraphSpacing: 24,
  pageWidth: 'full',
  pagePadding: 48,
  backgroundColorId: 'default',
  highlightColorId: 'blue',
  readingDirection: 'rtl',
  hadithTranslationLanguage: 'en',
  readingMode: 'standard',
  showArabic: true,
  showTranslation: true,
  activeTranslationIds: DEFAULT_TRANSLATION_IDS,
  selectedReciterId: DEFAULT_RECITER_ID,
  wordPlaybackSpeed: 1,
  autoScrollEnabled: true,
  wordHighlightEnabled: true,
};

export interface PageWidthOption {
  id: PageWidth;
  label: string;
  maxWidth: string;
}

export const PAGE_WIDTH_OPTIONS: PageWidthOption[] = [
  { id: 'narrow', label: 'Narrow', maxWidth: '28rem' },
  { id: 'medium', label: 'Medium', maxWidth: '40rem' },
  { id: 'wide', label: 'Wide', maxWidth: '56rem' },
  { id: 'full', label: 'Full', maxWidth: '100%' },
];

/** 'default' tracks the app theme (light/dark) rather than a fixed color. */
export const BACKGROUND_COLOR_PRESETS: ColorPreset[] = [
  { id: 'default', label: 'Default', value: 'var(--color-bg)' },
  { id: 'sepia', label: 'Sepia', value: '#f4ecd8' },
  { id: 'gray', label: 'Gray', value: '#e7e7e7' },
  { id: 'dark', label: 'Dark', value: '#1c1d21' },
];

export const HIGHLIGHT_COLOR_PRESETS: ColorPreset[] = [
  { id: 'yellow', label: 'Yellow', value: '#fde68a' },
  { id: 'green', label: 'Green', value: '#bbf7d0' },
  { id: 'blue', label: 'Blue', value: '#bfdbfe' },
  { id: 'pink', label: 'Pink', value: '#fbcfe8' },
];

export const SLIDER_BOUNDS = {
  arabicFontSize: { min: 20, max: 48, step: 1 },
  translationFontSize: { min: 12, max: 24, step: 1 },
  lineSpacing: { min: 1.4, max: 3, step: 0.1 },
  wordSpacing: { min: 0, max: 12, step: 1 },
  paragraphSpacing: { min: 0, max: 40, step: 2 },
  pagePadding: { min: 0, max: 48, step: 2 },
} as const;
