import { TAFSIRS } from 'constants/tafsirs';
import ResourceSwitcher from 'features/quranReader/components/ResourceSwitcher';
import type { TranslationKey } from 'i18n';

export interface TafsirSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  tafsirId: string;
  onSelect: (id: string) => void;
}

const LANGUAGE_LABEL_KEYS: Partial<Record<string, TranslationKey>> = {
  ar: 'quran.search.translationLangArabic',
  en: 'quran.search.translationLangEnglish',
  ur: 'quran.search.translationLangUrdu',
};

export default function TafsirSwitcher({ isOpen, onClose, tafsirId, onSelect }: TafsirSwitcherProps) {
  return (
    <ResourceSwitcher
      isOpen={isOpen}
      onClose={onClose}
      titleKey="tafsir.dialogTitle"
      hintKey="tafsir.dialogHint"
      mode="single"
      resources={TAFSIRS}
      activeIds={[tafsirId]}
      onToggle={onSelect}
      languageLabelKeys={LANGUAGE_LABEL_KEYS}
    />
  );
}
