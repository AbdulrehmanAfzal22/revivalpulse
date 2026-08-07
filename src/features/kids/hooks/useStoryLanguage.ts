import { useCallback, useMemo, useState } from 'react';
import type { LocalizedText } from 'types/kidsStories.types';

export type StoryLanguage = 'en' | 'ur';

const STORY_LANG_STORAGE_KEY = 'kids.story-language';

function getStoredLanguage(): StoryLanguage {
  const stored = window.localStorage.getItem(STORY_LANG_STORAGE_KEY);
  return stored === 'ur' ? 'ur' : 'en';
}

/** Bilingual helper: prefer the requested language, fall back to English. */
export function localText(text: LocalizedText, language: StoryLanguage): string {
  return text[language]?.trim() ? text[language] as string : text.en;
}

/** English/Urdu toggle scoped to the Stories feature (not the global UI language). */
export function useStoryLanguage() {
  const [language, setLanguageState] = useState<StoryLanguage>(getStoredLanguage);

  const setLanguage = useCallback((next: StoryLanguage) => {
    setLanguageState(next);
    window.localStorage.setItem(STORY_LANG_STORAGE_KEY, next);
  }, []);

  return useMemo(() => ({ language, setLanguage }), [language, setLanguage]);
}