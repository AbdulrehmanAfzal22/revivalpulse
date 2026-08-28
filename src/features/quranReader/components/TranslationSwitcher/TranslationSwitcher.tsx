import useReadingPreferences from 'hooks/useReadingPreferences';
import { TRANSLATIONS } from 'constants/translations';
import ResourceSwitcher from 'features/quranReader/components/ResourceSwitcher';
import type { TranslationKey } from 'i18n';

export interface TranslationSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGE_LABEL_KEYS: Partial<Record<string, TranslationKey>> = {
  en: 'quran.search.translationLangEnglish',
  ur: 'quran.search.translationLangUrdu',
  fa: 'quran.search.translationLangPersian',
  fr: 'quran.search.translationLangFrench',
  id: 'quran.search.translationLangIndonesian',
  ms: 'quran.search.translationLangMalay',
  tr: 'quran.search.translationLangTurkish',
  bn: 'quran.search.translationLangBengali',
  hi: 'quran.search.translationLangHindi',
  de: 'quran.search.translationLangGerman',
};

export default function TranslationSwitcher({ isOpen, onClose }: TranslationSwitcherProps) {
  const { preferences, update } = useReadingPreferences();
  const active = preferences.activeTranslationIds;

  const toggle = (id: string): void => {
    update({ activeTranslationIds: [id] });
  };

  return (
    <ResourceSwitcher
      isOpen={isOpen}
      onClose={onClose}
      titleKey="quran.translationsDialogTitle"
      hintKey="quran.translationsHint"
      mode="single"
      resources={TRANSLATIONS}
      activeIds={active.slice(0, 1)}
      onToggle={toggle}
      languageLabelKeys={LANGUAGE_LABEL_KEYS}
    />
  );
}
