import Drawer from 'components/ui/Drawer';
import Button from 'components/ui/Button';
import Slider from 'components/ui/Slider';
import Typography from 'components/ui/Typography';
import useInterfaceLanguage from 'hooks/useInterfaceLanguage';
import useReadingPreferences from 'hooks/useReadingPreferences';
import useTranslation from 'hooks/useTranslation';
import { ARABIC_FONTS } from 'constants/fonts';
import { READING_MODES, READING_MODE_LABEL_KEYS, READING_MODE_DESCRIPTION_KEYS } from 'constants/readingModes';
import { RECITERS } from 'constants/reciters';
import { WORD_PLAYBACK_SPEED_BOUNDS } from 'constants/wordAudio';
import {
  BACKGROUND_COLOR_PRESETS,
  DEFAULT_READING_PREFERENCES,
  HIGHLIGHT_COLOR_PRESETS,
  PAGE_WIDTH_OPTIONS,
  SLIDER_BOUNDS,
} from 'constants/readingPreferences';
import type { ReadingDirection } from 'types/readingPreferences.types';
import PillGroup from 'components/ui/PillGroup';
import SwatchGroup from 'components/ui/SwatchGroup';
import styles from './ReadingSettingsPanel.module.css';

export interface ReadingSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReadingSettingsPanel({ isOpen, onClose }: ReadingSettingsPanelProps) {
  const { interfaceLanguage } = useInterfaceLanguage();
  const { preferences, update, applyMode } = useReadingPreferences();
  const { t } = useTranslation();
  const side = interfaceLanguage.dir === 'rtl' ? 'left' : 'right';

  const READING_DIRECTIONS: { id: ReadingDirection; label: string }[] = [
    { id: 'rtl', label: t('quran.directionRtl') },
    { id: 'ltr', label: t('quran.directionLtr') },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side={side}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <Typography variant="h3">{t('quran.readingSettings')}</Typography>
          <Button variant="ghost" size="sm" onClick={() => update(DEFAULT_READING_PREFERENCES)}>
            {t('quran.resetSettings')}
          </Button>
        </div>

        <section className={styles.section}>
          <Typography variant="caption" muted className={styles.sectionLabel}>
            {t('quran.readingMode')}
          </Typography>
          <div className={styles.modeGrid}>
            {READING_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className={[styles.modeCard, preferences.readingMode === mode && styles.modeCardActive]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => applyMode(mode)}
              >
                <span className={styles.modeTitle}>{t(READING_MODE_LABEL_KEYS[mode])}</span>
                <span className={styles.modeDescription}>{t(READING_MODE_DESCRIPTION_KEYS[mode])}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <Typography variant="caption" muted className={styles.sectionLabel}>
            {t('quran.arabicFont')}
          </Typography>
          <PillGroup
            options={ARABIC_FONTS.map((font) => ({ id: font.id, label: font.label }))}
            value={preferences.arabicFont}
            onChange={(id) => update({ arabicFont: id as typeof preferences.arabicFont })}
          />
        </section>

        <section className={styles.section}>
          <Slider
            label={t('quran.arabicTextSize')}
            value={preferences.arabicFontSize}
            min={SLIDER_BOUNDS.arabicFontSize.min}
            max={SLIDER_BOUNDS.arabicFontSize.max}
            step={SLIDER_BOUNDS.arabicFontSize.step}
            valueLabel={`${preferences.arabicFontSize}px`}
            onChange={(value) => update({ arabicFontSize: value })}
          />
          <Slider
            label={t('quran.translationTextSize')}
            value={preferences.translationFontSize}
            min={SLIDER_BOUNDS.translationFontSize.min}
            max={SLIDER_BOUNDS.translationFontSize.max}
            step={SLIDER_BOUNDS.translationFontSize.step}
            valueLabel={`${preferences.translationFontSize}px`}
            onChange={(value) => update({ translationFontSize: value })}
          />
          <Slider
            label={t('quran.lineSpacing')}
            value={preferences.lineSpacing}
            min={SLIDER_BOUNDS.lineSpacing.min}
            max={SLIDER_BOUNDS.lineSpacing.max}
            step={SLIDER_BOUNDS.lineSpacing.step}
            valueLabel={preferences.lineSpacing.toFixed(1)}
            onChange={(value) => update({ lineSpacing: value })}
          />
          <Slider
            label={t('quran.wordSpacing')}
            value={preferences.wordSpacing}
            min={SLIDER_BOUNDS.wordSpacing.min}
            max={SLIDER_BOUNDS.wordSpacing.max}
            step={SLIDER_BOUNDS.wordSpacing.step}
            valueLabel={`${preferences.wordSpacing}px`}
            onChange={(value) => update({ wordSpacing: value })}
          />
          <Slider
            label={t('quran.paragraphSpacing')}
            value={preferences.paragraphSpacing}
            min={SLIDER_BOUNDS.paragraphSpacing.min}
            max={SLIDER_BOUNDS.paragraphSpacing.max}
            step={SLIDER_BOUNDS.paragraphSpacing.step}
            valueLabel={`${preferences.paragraphSpacing}px`}
            onChange={(value) => update({ paragraphSpacing: value })}
          />
        </section>

        <section className={styles.section}>
          <Typography variant="caption" muted className={styles.sectionLabel}>
            {t('quran.pageWidth')}
          </Typography>
          <PillGroup
            options={PAGE_WIDTH_OPTIONS.map((option) => ({ id: option.id, label: option.label }))}
            value={preferences.pageWidth}
            onChange={(id) => update({ pageWidth: id as typeof preferences.pageWidth })}
          />
          <Slider
            label={t('quran.pagePadding')}
            value={preferences.pagePadding}
            min={SLIDER_BOUNDS.pagePadding.min}
            max={SLIDER_BOUNDS.pagePadding.max}
            step={SLIDER_BOUNDS.pagePadding.step}
            valueLabel={`${preferences.pagePadding}px`}
            onChange={(value) => update({ pagePadding: value })}
          />
        </section>

        <section className={styles.section}>
          <Typography variant="caption" muted className={styles.sectionLabel}>
            {t('quran.backgroundColor')}
          </Typography>
          <SwatchGroup
            options={BACKGROUND_COLOR_PRESETS}
            value={preferences.backgroundColorId}
            onChange={(id) => update({ backgroundColorId: id })}
          />

          <Typography variant="caption" muted className={styles.sectionLabel}>
            {t('quran.highlightColor')}
          </Typography>
          <SwatchGroup
            options={HIGHLIGHT_COLOR_PRESETS}
            value={preferences.highlightColorId}
            onChange={(id) => update({ highlightColorId: id })}
          />
        </section>

        <section className={styles.section}>
          <Typography variant="caption" muted className={styles.sectionLabel}>
            {t('quran.arabicTextDirection')}
          </Typography>
          <PillGroup
            options={READING_DIRECTIONS}
            value={preferences.readingDirection}
            onChange={(id) => update({ readingDirection: id as ReadingDirection })}
          />
        </section>

        <section className={styles.section}>
          <Typography variant="caption" muted className={styles.sectionLabel}>
            {t('settings.reciter')}
          </Typography>
          <PillGroup
            options={RECITERS.map((reciter) => ({
              id: reciter.id,
              label: reciter.style ? `${reciter.name} (${reciter.style})` : reciter.name,
            }))}
            value={preferences.selectedReciterId}
            onChange={(id) => update({ selectedReciterId: id })}
          />
          <Slider
            label={t('quran.wordAudioSpeed')}
            value={preferences.wordPlaybackSpeed}
            min={WORD_PLAYBACK_SPEED_BOUNDS.min}
            max={WORD_PLAYBACK_SPEED_BOUNDS.max}
            step={WORD_PLAYBACK_SPEED_BOUNDS.step}
            valueLabel={`${preferences.wordPlaybackSpeed}x`}
            onChange={(value) => update({ wordPlaybackSpeed: value })}
          />
        </section>

        <section className={styles.section}>
          <label className={styles.toggleRow}>
            <span>{t('quran.showArabic')}</span>
            <input
              type="checkbox"
              checked={preferences.showArabic}
              onChange={(event) => {
                if (!event.target.checked && !preferences.showTranslation) return;
                update({ showArabic: event.target.checked });
              }}
            />
          </label>
          <label className={styles.toggleRow}>
            <span>{t('quran.showTranslation')}</span>
            <input
              type="checkbox"
              checked={preferences.showTranslation}
              onChange={(event) => {
                if (!event.target.checked && !preferences.showArabic) return;
                update({ showTranslation: event.target.checked });
              }}
            />
          </label>
        </section>
      </div>
    </Drawer>
  );
}
