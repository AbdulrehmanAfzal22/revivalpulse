export type TextDirection = 'ltr' | 'rtl';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  dir: TextDirection;
}

export interface LanguageContextValue {
  /** Drives interface chrome only (nav, menus, settings, buttons) — never Quran translation text. */
  interfaceLanguage: LanguageOption;
  languages: LanguageOption[];
  setInterfaceLanguage: (code: string) => void;
}
