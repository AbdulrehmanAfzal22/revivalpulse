import { useEffect } from 'react';
import { Check, Download } from 'lucide-react';
import Drawer from 'components/ui/Drawer';
import Button from 'components/ui/Button';
import Slider from 'components/ui/Slider';
import Typography from 'components/ui/Typography';
import useInterfaceLanguage from 'hooks/useInterfaceLanguage';
import useReadingPreferences from 'hooks/useReadingPreferences';
import useTranslation from 'hooks/useTranslation';
import { ARABIC_FONTS } from 'constants/fonts';
import { READING_MODES, READING_MODE_LABEL_KEYS, READING_MODE_DESCRIPTION_KEYS } from 'constants/readingModes';
import { RECITERS, getReciterById } from 'constants/reciters';
import { WORD_PLAYBACK_SPEED_BOUNDS } from 'constants/wordAudio';
import { SURAHS } from 'data/quran/surahs';
import {
  DEFAULT_READING_PREFERENCES,
  HIGHLIGHT_COLOR_PRESETS,
  PAGE_WIDTH_OPTIONS,
  SLIDER_BOUNDS,
} from 'constants/readingPreferences';
import type { ReadingDirection } from 'types/readingPreferences.types';
import type { LoopMode } from 'types/audioPlayer.types';
import PillGroup from 'components/ui/PillGroup';
import SwatchGroup from 'components/ui/SwatchGroup';
import { usePlaybackStore } from 'stores/playbackStore';
import { useDownloadsStore } from 'stores/downloadsStore';
import * as engine from 'features/quranReader/services/playbackEngine';
import styles from './ReadingSettingsPanel.module.css';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export interface ReadingSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Needed for the "download for offline" button — omitted where no surah is in context. */
  surahId?: number;
}

export default function ReadingSettingsPanel({ isOpen, onClose, surahId }: ReadingSettingsPanelProps) {
  const { interfaceLanguage } = useInterfaceLanguage();
  const { preferences, update, applyMode } = useReadingPreferences();
  const { t } = useTranslation();
  const side = interfaceLanguage.dir === 'rtl' ? 'left' : 'right';

  const reciterId = usePlaybackStore((state) => state.reciterId);
  const loopMode = usePlaybackStore((state) => state.loopMode);
  const range = usePlaybackStore((state) => state.range);
  const autoplayEnabled = usePlaybackStore((state) => state.autoplayEnabled);
  const playbackSpeed = usePlaybackStore((state) => state.playbackSpeed);
  const urduTranslationAudioEnabled = usePlaybackStore((state) => state.urduTranslationAudioEnabled);
  const englishTranslationAudioEnabled = usePlaybackStore((state) => state.englishTranslationAudioEnabled);
  const setAutoplayEnabled = usePlaybackStore((state) => state.setAutoplayEnabled);
  const setUrduTranslationAudioEnabled = usePlaybackStore((state) => state.setUrduTranslationAudioEnabled);
  const setEnglishTranslationAudioEnabled = usePlaybackStore((state) => state.setEnglishTranslationAudioEnabled);

  const downloads = useDownloadsStore((state) => state.downloads);
  const startDownload = useDownloadsStore((state) => state.startDownload);
  const refreshDownloads = useDownloadsStore((state) => state.refresh);

  useEffect(() => {
    void refreshDownloads();
  }, [refreshDownloads]);

  const reciter = getReciterById(reciterId);
  const download = surahId !== undefined ? downloads[`${reciterId}:${surahId}`] : undefined;
  const surah = surahId !== undefined ? SURAHS.find((item) => item.id === surahId) : undefined;

  const READING_DIRECTIONS: { id: ReadingDirection; label: string }[] = [
    { id: 'rtl', label: t('quran.directionRtl') },
    { id: 'ltr', label: t('quran.directionLtr') },
  ];

  const LOOP_MODES: { id: LoopMode; label: string }[] = [
    { id: 'off', label: t('quran.loopOff') },
    { id: 'ayah', label: t('quran.loopAyah') },
    { id: 'range', label: t('quran.loopRange') },
    { id: 'surah', label: t('quran.loopSurah') },
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
            options={RECITERS.map((item) => ({
              id: item.id,
              label: item.style ? `${item.name} (${item.style})` : item.name,
            }))}
            value={reciterId}
            onChange={(id) => engine.setReciter(id)}
          />
          {reciter && !reciter.supportsWordSync && (
            <Typography variant="caption" muted className={styles.note}>
              {t('quran.wordSyncNote')}
            </Typography>
          )}
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
          <Typography variant="caption" muted className={styles.sectionLabel}>
            {t('quran.speed')}
          </Typography>
          <PillGroup
            options={SPEEDS.map((speed) => ({ id: String(speed), label: `${speed}x` }))}
            value={String(playbackSpeed)}
            onChange={(id) => engine.setSpeed(Number(id))}
          />
        </section>

        <section className={styles.section}>
          <Typography variant="caption" muted className={styles.sectionLabel}>
            {t('quran.loop')}
          </Typography>
          <PillGroup
            options={LOOP_MODES}
            value={loopMode}
            onChange={(id) => engine.setLoopMode(id as LoopMode)}
          />
          {loopMode === 'range' && surah && (
            <div className={styles.rangeRow}>
              <label className={styles.rangeField}>
                {t('quran.from')}
                <input
                  type="number"
                  min={1}
                  max={surah.versesCount}
                  value={range?.startAyah ?? 1}
                  onChange={(event) =>
                    engine.setRange({
                      startAyah: Number(event.target.value),
                      endAyah: range?.endAyah ?? surah.versesCount,
                    })
                  }
                />
              </label>
              <label className={styles.rangeField}>
                {t('quran.to')}
                <input
                  type="number"
                  min={1}
                  max={surah.versesCount}
                  value={range?.endAyah ?? surah.versesCount}
                  onChange={(event) =>
                    engine.setRange({
                      startAyah: range?.startAyah ?? 1,
                      endAyah: Number(event.target.value),
                    })
                  }
                />
              </label>
            </div>
          )}
          <label className={styles.toggleRow}>
            <span>{t('quran.autoplayNextAyah')}</span>
            <input
              type="checkbox"
              checked={autoplayEnabled}
              onChange={(event) => setAutoplayEnabled(event.target.checked)}
            />
          </label>
        </section>

        <section className={styles.section}>
          <Typography variant="caption" muted className={styles.sectionLabel}>
            {t('quran.translationAudioSectionLabel')}
          </Typography>
          <div className={styles.translationToggleRow}>
            <button
              type="button"
              className={[styles.translationToggle, urduTranslationAudioEnabled && styles.translationToggleActive]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={urduTranslationAudioEnabled}
              onClick={() => {
                setUrduTranslationAudioEnabled(!urduTranslationAudioEnabled);
                engine.refreshTranslationEditions();
              }}
            >
              {t('quran.urduAudioTranslationToggle', {
                state: urduTranslationAudioEnabled ? t('quran.toggleOn') : t('quran.toggleOff'),
              })}
            </button>
            <button
              type="button"
              className={[
                styles.translationToggle,
                englishTranslationAudioEnabled && styles.translationToggleActive,
                englishTranslationAudioEnabled && styles.englishToggleActive,
              ]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={englishTranslationAudioEnabled}
              onClick={() => {
                setEnglishTranslationAudioEnabled(!englishTranslationAudioEnabled);
                engine.refreshTranslationEditions();
              }}
            >
              {t('quran.englishAudioTranslationToggle', {
                state: englishTranslationAudioEnabled ? t('quran.toggleOn') : t('quran.toggleOff'),
              })}
            </button>
          </div>
          {(urduTranslationAudioEnabled || englishTranslationAudioEnabled) && (
            <Typography variant="caption" muted className={styles.note}>
              {t('quran.translationAudioGroupNote')}
            </Typography>
          )}
        </section>

        {surahId !== undefined && (
          <section className={styles.section}>
            <Button
              variant="secondary"
              disabled={download?.status === 'downloading' || download?.status === 'downloaded'}
              onClick={() => void startDownload(reciterId, surahId)}
              leadingIcon={download?.status === 'downloaded' ? <Check size={16} /> : <Download size={16} />}
            >
              {download?.status === 'downloaded'
                ? t('quran.downloaded')
                : download?.status === 'downloading'
                  ? t('quran.downloading', { completed: download.completedFiles, total: download.totalFiles })
                  : t('quran.downloadForOffline')}
            </Button>
          </section>
        )}

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
