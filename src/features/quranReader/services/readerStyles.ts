import type { CSSProperties } from 'react';
import { ARABIC_FONTS } from 'constants/fonts';
import { BACKGROUND_COLOR_PRESETS, HIGHLIGHT_COLOR_PRESETS, PAGE_WIDTH_OPTIONS } from 'constants/readingPreferences';
import type { ReadingPreferences } from 'types/readingPreferences.types';

/** Translates stored preferences into CSS custom properties for the reader tree. */
export function getReaderCssVars(preferences: ReadingPreferences): CSSProperties {
  const font = ARABIC_FONTS.find((item) => item.id === preferences.arabicFont);
  const background = BACKGROUND_COLOR_PRESETS.find((item) => item.id === preferences.backgroundColorId);
  const highlight = HIGHLIGHT_COLOR_PRESETS.find((item) => item.id === preferences.highlightColorId);
  const pageWidth = PAGE_WIDTH_OPTIONS.find((item) => item.id === preferences.pageWidth);

  return {
    '--reader-arabic-font': font?.fontFamily ?? 'inherit',
    '--reader-arabic-size': `${preferences.arabicFontSize}px`,
    '--reader-translation-size': `${preferences.translationFontSize}px`,
    '--reader-line-height': preferences.lineSpacing,
    '--reader-word-spacing': `${preferences.wordSpacing}px`,
    '--reader-paragraph-spacing': `${preferences.paragraphSpacing}px`,
    '--reader-page-width': pageWidth?.maxWidth ?? '40rem',
    '--reader-page-padding': `${preferences.pagePadding}px`,
    '--reader-bg': background?.value ?? 'var(--color-bg)',
    '--reader-highlight': highlight?.value ?? '#fde68a',
  } as CSSProperties;
}
