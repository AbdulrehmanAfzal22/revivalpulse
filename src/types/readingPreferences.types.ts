export type ArabicFontId = 'uthmani' | 'indopak' | 'kingFahad' | 'naskh' | 'kufi';
export type PageWidth = 'narrow' | 'medium' | 'wide' | 'full';
export type ReadingMode = 'standard' | 'focus' | 'study' | 'memorization' | 'teacher' | 'child';
export type ReadingDirection = 'rtl' | 'ltr';

export interface ColorPreset {
  id: string;
  label: string;
  value: string;
}

export interface ReadingPreferences {
  arabicFont: ArabicFontId;
  arabicFontSize: number;
  translationFontSize: number;
  lineSpacing: number;
  wordSpacing: number;
  paragraphSpacing: number;
  pageWidth: PageWidth;
  pagePadding: number;
  backgroundColorId: string;
  highlightColorId: string;
  readingDirection: ReadingDirection;
  readingMode: ReadingMode;
  showArabic: boolean;
  showTranslation: boolean;
  activeTranslationIds: string[];
  selectedReciterId: string;
  wordPlaybackSpeed: number;
  autoScrollEnabled: boolean;
  wordHighlightEnabled: boolean;
}
