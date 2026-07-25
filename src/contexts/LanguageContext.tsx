import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { LanguageContextValue, LanguageOption } from 'types/language.types';
import type { WithChildren } from 'types/common.types';
import { DEFAULT_LANGUAGE_CODE, LANGUAGES } from 'constants/languages';
import { LANGUAGE_STORAGE_KEY } from 'constants/theme';

const LanguageContext = createContext<LanguageContextValue | null>(null);

function findLanguage(code: string): LanguageOption {
  return LANGUAGES.find((lang) => lang.code === code) ?? (LANGUAGES[0] as LanguageOption);
}

function getInitialLanguage(): LanguageOption {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return findLanguage(stored ?? DEFAULT_LANGUAGE_CODE);
}

export function LanguageProvider({ children }: WithChildren) {
  const [interfaceLanguage, setInterfaceLanguageState] = useState<LanguageOption>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = interfaceLanguage.code;
    document.documentElement.dir = interfaceLanguage.dir;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, interfaceLanguage.code);
  }, [interfaceLanguage]);

  const setInterfaceLanguage = useCallback((code: string) => {
    setInterfaceLanguageState(findLanguage(code));
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ interfaceLanguage, languages: LANGUAGES, setInterfaceLanguage }),
    [interfaceLanguage, setInterfaceLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguageContext(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}
