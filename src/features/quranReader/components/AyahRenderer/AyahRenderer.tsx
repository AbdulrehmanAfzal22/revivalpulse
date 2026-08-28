import { useEffect, useRef } from 'react';
import { BookMarked, Loader2, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Ayah } from 'types/quran.types';
import type { ReadingDirection } from 'types/readingPreferences.types';
import { HIGHLIGHT_COLOR_PRESETS } from 'constants/readingPreferences';
import { buildTafsirPath } from 'constants/routes';
import WordByWord from 'features/quranReader/components/WordByWord';
import AyahActionsMenu from 'features/quranReader/components/AyahActionsMenu';
import * as engine from 'features/quranReader/services/playbackEngine';
import { usePlaybackStore } from 'stores/playbackStore';
import { useReadingPreferencesStore } from 'stores/readingPreferencesStore';
import { getHighlightColorId, useCollectionsStore } from 'stores/collectionsStore';
import Button from 'components/ui/Button';
import useTranslation from 'hooks/useTranslation';
import styles from './AyahRenderer.module.css';

export interface AyahRendererProps {
  ayah: Ayah;
  showArabic: boolean;
  showTranslation: boolean;
  selectedTranslationId?: string;
  arabicDirection: ReadingDirection;
  isLastRead?: boolean;
  hasBeenVisible?: boolean;
}

export default function AyahRenderer({
  ayah,
  showArabic,
  showTranslation,
  selectedTranslationId,
  arabicDirection,
  isLastRead = false,
  hasBeenVisible = false,
}: AyahRendererProps) {
  const source = usePlaybackStore((state) => state.source);
  const activeVerseKey = usePlaybackStore((state) => state.verseKey);
  const isStorePlaying = usePlaybackStore((state) => state.isPlaying);
  const isLoading = usePlaybackStore((state) => state.isLoading);
  const highlights = useCollectionsStore((state) => state.highlights);
  const autoScrollEnabled = useReadingPreferencesStore((state) => state.preferences.autoScrollEnabled);
  const { t } = useTranslation();

  const isActiveAyah = source === 'surah' && activeVerseKey === ayah.verseKey;
  const isPlayingThis = isActiveAyah && isStorePlaying;
  const highlightColorId = getHighlightColorId(highlights, ayah.verseKey);
  const highlightColor = HIGHLIGHT_COLOR_PRESETS.find((preset) => preset.id === highlightColorId)?.value;
  const selectedTranslation = ayah.translations.find(
    (translation) => translation.translationId === selectedTranslationId
  ) ?? ayah.translations[0];

  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isActiveAyah && autoScrollEnabled) {
      articleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Only when this ayah newly becomes the active one — not on every render while it stays active.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActiveAyah]);

  const handleToggle = (): void => {
    if (isActiveAyah) {
      isStorePlaying ? engine.pause() : engine.resume();
    } else {
      void engine.playSurah(ayah.chapterId, ayah.verseNumber);
    }
  };

  return (
    <article
      ref={articleRef}
      className={[styles.ayah, hasBeenVisible && styles.ayahVisible, isActiveAyah && styles.ayahActive]
        .filter(Boolean)
        .join(' ')}
      id={`ayah-${ayah.verseNumber}`}
      style={highlightColor ? { backgroundColor: `color-mix(in srgb, ${highlightColor} 35%, transparent)` } : undefined}
    >
      {isLastRead && <div className={styles.lastReadMarker}>You left off here</div>}
      <div className={styles.meta} dir={arabicDirection}>
        <span className={styles.number} aria-hidden="true">
          {ayah.verseNumber}
        </span>
        <Button
          variant="icon"
          size="sm"
          onClick={handleToggle}
          disabled={isActiveAyah && isLoading}
          aria-label={isPlayingThis ? t('quran.pauseRecitation') : t('quran.playRecitationFromHere')}
          leadingIcon={
            isActiveAyah && isLoading ? (
              <Loader2 size={14} className={styles.spin} />
            ) : isPlayingThis ? (
              <Pause size={14} />
            ) : (
              <Play size={14} />
            )
          }
        />
        {ayah.sajdahNumber !== null && (
          <span className={styles.sajdah}>
            <span aria-hidden="true">۩</span> {t('quran.sajdah')}
          </span>
        )}
        <Link
          to={buildTafsirPath(ayah.chapterId, ayah.verseNumber)}
          className={styles.tafsirLink}
          aria-label={t('quran.readTafsirForVerse', { number: ayah.verseNumber })}
        >
          <BookMarked size={14} />
          {t('quran.tafsirLink')}
        </Link>
        <AyahActionsMenu ayah={ayah} />
      </div>

      <div
        className={[
          styles.contentGrid,
          arabicDirection === 'ltr' ? styles.arabicRight : styles.arabicLeft,
        ].join(' ')}
      >
        {showTranslation && selectedTranslation && (
          <div className={styles.translationBlock}>
            <p className={styles.translation} dir="ltr" lang="en">
              {selectedTranslation.text}
            </p>
          </div>
        )}

        {showArabic && (
          <div className={styles.arabicBlock}>
            {ayah.words.length > 0 ? (
              <WordByWord words={ayah.words} surahId={ayah.chapterId} direction={arabicDirection} />
            ) : (
              <p className={styles.arabic} dir="rtl" lang="ar">
                {ayah.textUthmani}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
