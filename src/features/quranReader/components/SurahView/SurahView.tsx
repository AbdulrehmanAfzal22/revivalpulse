import { useEffect, useState } from 'react';
import { RotateCw } from 'lucide-react';
import useChapterVerses from 'features/quranReader/hooks/useChapterVerses';
import AyahRenderer from 'features/quranReader/components/AyahRenderer';
import Skeleton from 'components/ui/Skeleton';
import Button from 'components/ui/Button';
import EmptyState from 'components/feedback/EmptyState';
import Typography from 'components/ui/Typography';
import useReadingPreferences from 'hooks/useReadingPreferences';
import { usePlaybackStore } from 'stores/playbackStore';
import useReadingTracker from 'features/quranReader/hooks/useReadingTracker';
import useTranslation from 'hooks/useTranslation';
import styles from './SurahView.module.css';

export interface SurahViewProps {
  surahId: number;
  targetAyah?: number;
  lastReadAyah?: number;
}

export default function SurahView({ surahId, targetAyah, lastReadAyah }: SurahViewProps) {
  const [seenVerseNumbers, setSeenVerseNumbers] = useState<Set<number>>(() => new Set());
  const { preferences } = useReadingPreferences();
  const { t, tp } = useTranslation();
  const { data: verses, isPending, isError, error, refetch, isFetching } = useChapterVerses(
    surahId,
    preferences.activeTranslationIds
  );

  const activeVerseKey = usePlaybackStore((state) => state.verseKey);
  const playbackSource = usePlaybackStore((state) => state.source);

  useReadingTracker(surahId, verses);

  useEffect(() => {
    if (!targetAyah || !verses) return;
    const target = document.getElementById(`ayah-${targetAyah}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [targetAyah, verses]);

  useEffect(() => {
    if (playbackSource !== 'surah' || !activeVerseKey) return;
    const [activeSurahId, ayahNumber] = activeVerseKey.split(':');
    if (Number(activeSurahId) !== surahId) return;
    const target = document.getElementById(`ayah-${ayahNumber}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeVerseKey, playbackSource, surahId]);

  useEffect(() => {
    if (!verses) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setSeenVerseNumbers(new Set(verses.map((ayah) => ayah.verseNumber)));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const newlySeen = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => Number(entry.target.id.replace('ayah-', '')))
          .filter((verseNumber) => Number.isInteger(verseNumber));
        if (newlySeen.length === 0) return;

        setSeenVerseNumbers((previous) => {
          const next = new Set(previous);
          newlySeen.forEach((verseNumber) => next.add(verseNumber));
          return next.size === previous.size ? previous : next;
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    document.querySelectorAll(`#surah-${surahId} article, [id^="ayah-"]`).forEach((article) => observer.observe(article));
    return () => observer.disconnect();
  }, [surahId, verses]);

  if (isPending) {
    return (
      <div className={styles.list} aria-busy="true" aria-label={t('quran.loadingVerses')}>
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className={styles.skeletonRow}>
            <Skeleton variant="text" width="90%" height="1.75rem" />
            <Skeleton variant="text" width="70%" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title={t('emptyState.quran.loadFailed')}
        description={error.message}
        action={
          <Button
            variant="secondary"
            onClick={() => refetch()}
            disabled={isFetching}
            leadingIcon={<RotateCw size={16} />}
          >
            {isFetching ? t('common.retrying') : t('common.retry')}
          </Button>
        }
      />
    );
  }

  if (verses.length === 0) {
    return <EmptyState title={t('emptyState.quran.noVerses')} description={t('quran.noVersesDescription')} />;
  }

  return (
    <div className={styles.list}>
      {verses.map((ayah) => (
        <AyahRenderer
          key={ayah.id}
          ayah={ayah}
          isLastRead={lastReadAyah === ayah.verseNumber}
          hasBeenVisible={seenVerseNumbers.has(ayah.verseNumber)}
          showArabic={preferences.showArabic}
          showTranslation={preferences.showTranslation}
          selectedTranslationId={preferences.activeTranslationIds[0]}
          arabicDirection={preferences.readingDirection}
        />
      ))}
      <Typography variant="caption" muted className={styles.count}>
        {tp('quran.versesCount', verses.length)}
      </Typography>
    </div>
  );
}
