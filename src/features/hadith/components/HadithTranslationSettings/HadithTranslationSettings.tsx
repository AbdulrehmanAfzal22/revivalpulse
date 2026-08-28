import { Languages } from 'lucide-react';
import Drawer from 'components/ui/Drawer';
import Button from 'components/ui/Button';
import Slider from 'components/ui/Slider';
import Typography from 'components/ui/Typography';
import PillGroup from 'components/ui/PillGroup';
import useInterfaceLanguage from 'hooks/useInterfaceLanguage';
import useReadingPreferences from 'hooks/useReadingPreferences';
import useHadithTranslationLanguages from 'features/hadith/hooks/useHadithTranslation';
import type { HadithTranslationLanguage } from 'features/hadith/services/hadithTranslationClient';
import styles from './HadithTranslationSettings.module.css';
import { ARABIC_FONTS } from 'constants/fonts';
import { SLIDER_BOUNDS } from 'constants/readingPreferences';

interface HadithTranslationSettingsProps {
  bookSlug: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function HadithTranslationSettings({ bookSlug, isOpen, onClose }: HadithTranslationSettingsProps) {
  const { interfaceLanguage } = useInterfaceLanguage();
  const { preferences, update } = useReadingPreferences();
  const languagesQuery = useHadithTranslationLanguages(bookSlug);
  const side = interfaceLanguage.dir === 'rtl' ? 'left' : 'right';
  const languages: HadithTranslationLanguage[] = languagesQuery.data ?? [];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side={side}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <Typography variant="h3">Hadith reading settings</Typography>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>

        <section className={styles.section}>
          <Slider label="Arabic text size" value={preferences.arabicFontSize} min={SLIDER_BOUNDS.arabicFontSize.min} max={SLIDER_BOUNDS.arabicFontSize.max} step={SLIDER_BOUNDS.arabicFontSize.step} valueLabel={`${preferences.arabicFontSize}px`} onChange={(value) => update({ arabicFontSize: value })} />
          <Slider label="Translation text size" value={preferences.translationFontSize} min={SLIDER_BOUNDS.translationFontSize.min} max={SLIDER_BOUNDS.translationFontSize.max} step={SLIDER_BOUNDS.translationFontSize.step} valueLabel={`${preferences.translationFontSize}px`} onChange={(value) => update({ translationFontSize: value })} />
        </section>

        <section className={styles.section}>
          <Typography variant="caption" muted className={styles.sectionLabel}>Arabic font</Typography>
          <PillGroup options={ARABIC_FONTS.map((font) => ({ id: font.id, label: font.label }))} value={preferences.arabicFont} onChange={(id) => update({ arabicFont: id as typeof preferences.arabicFont })} />
          <label className={styles.toggle}>
            <input type="checkbox" checked={preferences.showArabic} onChange={(event) => update({ showArabic: event.target.checked })} />
            Show Arabic text
          </label>
        </section>

        <section className={styles.section}>
          <Typography variant="caption" muted className={styles.sectionLabel}>
            Translation language
          </Typography>
          {languagesQuery.isPending && <Typography variant="caption" muted>Loading available languages...</Typography>}
          {languagesQuery.isError && (
            <Typography variant="caption" muted>English is available while languages load.</Typography>
          )}
          {!languagesQuery.isPending && !languagesQuery.isError && languages.length === 0 && (
            <Typography variant="caption" muted>No translated editions are available for this book.</Typography>
          )}
          {languages.length > 0 && (
            <PillGroup
              options={languages.map((language) => ({ id: language.code, label: language.label }))}
              value={languages.some((language) => language.code === preferences.hadithTranslationLanguage)
                ? preferences.hadithTranslationLanguage
                : 'en'}
              onChange={(id) => update({ hadithTranslationLanguage: id })}
            />
          )}
        </section>

        <div className={styles.sourceNote}>
          <Languages size={15} aria-hidden="true" />
          <Typography variant="caption" muted>
            Languages shown here are editions confirmed for this book.
          </Typography>
        </div>
      </div>
    </Drawer>
  );
}
