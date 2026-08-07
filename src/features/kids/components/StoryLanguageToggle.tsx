import useTranslation from 'hooks/useTranslation';
import type { StoryLanguage } from 'features/kids/hooks/useStoryLanguage';
import styles from './StoryLanguageToggle.module.css';

export interface StoryLanguageToggleProps {
  language: StoryLanguage;
  onChange: (language: StoryLanguage) => void;
}

/**
 * English / Urdu toggle, scoped to Stories only. Urdu may lag behind English
 * per story — the chapter page shows the English fallback with a notice when
 * a story has no Urdu translation yet.
 */
export default function StoryLanguageToggle({ language, onChange }: StoryLanguageToggleProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.toggle} role="group" aria-label="Story language">
      {(['en', 'ur'] as const).map((code) => (
        <button
          key={code}
          type="button"
          className={[styles.option, language === code && styles.optionActive].filter(Boolean).join(' ')}
          onClick={() => onChange(code)}
          aria-pressed={language === code}
        >
          {code === 'en' ? t('kids.english') : t('kids.urdu')}
        </button>
      ))}
    </div>
  );
}