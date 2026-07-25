import type { ArabicFontId } from 'types/readingPreferences.types';

export interface ArabicFontOption {
  id: ArabicFontId;
  label: string;
  fontFamily: string;
}

/**
 * "Uthmani" and "King Fahad" are commonly the proprietary KFGQPC Mushaf
 * fonts; see src/styles/fonts.css for the open-license stand-ins actually
 * loaded here until real KFGQPC files are available to self-host.
 */
export const ARABIC_FONTS: ArabicFontOption[] = [
  { id: 'uthmani', label: 'Uthmani', fontFamily: "'Reader Uthmani', serif" },
  { id: 'indopak', label: 'IndoPak', fontFamily: "'Reader IndoPak', serif" },
  { id: 'kingFahad', label: 'King Fahad', fontFamily: "'Reader King Fahad', serif" },
  { id: 'naskh', label: 'Naskh', fontFamily: "'Reader Naskh', serif" },
  { id: 'kufi', label: 'Kufi', fontFamily: "'Reader Kufi', serif" },
];
