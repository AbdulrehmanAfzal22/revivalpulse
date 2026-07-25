import { Check } from 'lucide-react';
import Dialog from 'components/ui/Dialog';
import Typography from 'components/ui/Typography';
import useTranslation from 'hooks/useTranslation';
import type { TranslationKey } from 'i18n';
import styles from './ResourceSwitcher.module.css';

export interface SwitchableResource {
  id: string;
  label: string;
  authorName: string;
  languageCode: string;
}

export interface ResourceSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  titleKey: TranslationKey;
  hintKey: TranslationKey;
  /** Single: clicking an item selects it and closes the dialog (radio-like). Multi: checkboxes, stays open. */
  mode: 'single' | 'multi';
  resources: SwitchableResource[];
  activeIds: string[];
  onToggle: (id: string) => void;
  /** Maps a resource's languageCode to a translation key for the group header — falls back to the raw code. */
  languageLabelKeys: Partial<Record<string, TranslationKey>>;
}

/**
 * Shared Dialog-based picker for both the Translation switcher (multi-select)
 * and the Tafsir switcher (single-select) — same grouped-by-language list UI,
 * different selection cardinality. See hardening-phase-4 for why this isn't
 * two components.
 */
export default function ResourceSwitcher({
  isOpen,
  onClose,
  titleKey,
  hintKey,
  mode,
  resources,
  activeIds,
  onToggle,
  languageLabelKeys,
}: ResourceSwitcherProps) {
  const { t } = useTranslation();
  const languages = Array.from(new Set(resources.map((resource) => resource.languageCode)));

  const handleSelect = (id: string): void => {
    onToggle(id);
    if (mode === 'single') onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t(titleKey)}>
      <Typography variant="caption" muted className={styles.hint}>
        {t(hintKey)}
      </Typography>

      {languages.map((language) => (
        <section key={language} className={styles.group}>
          <Typography variant="caption" muted className={styles.groupLabel}>
            {languageLabelKeys[language] ? t(languageLabelKeys[language] as TranslationKey) : language}
          </Typography>
          {resources
            .filter((resource) => resource.languageCode === language)
            .map((resource) => {
              const isActive = activeIds.includes(resource.id);
              return (
                <label key={resource.id} className={styles.row}>
                  {mode === 'multi' ? (
                    <input type="checkbox" checked={isActive} onChange={() => handleSelect(resource.id)} />
                  ) : (
                    <input
                      type="radio"
                      checked={isActive}
                      onChange={() => handleSelect(resource.id)}
                      className={styles.radio}
                    />
                  )}
                  <span>
                    <span className={styles.rowLabel}>{resource.label}</span>
                    <span className={styles.rowAuthor}>{resource.authorName}</span>
                  </span>
                  {mode === 'single' && isActive && <Check size={16} className={styles.check} />}
                </label>
              );
            })}
        </section>
      ))}
    </Dialog>
  );
}
