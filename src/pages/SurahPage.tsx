import { useEffect, useRef, useState } from 'react';
import { BookText, ChevronLeft, ChevronRight, Loader2, Maximize, Minimize, Settings, Star } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { SURAHS } from 'data/quran/surahs';
import SurahView from 'features/quranReader/components/SurahView';
import ReadingSettingsPanel from 'features/quranReader/components/ReadingSettingsPanel';
import TranslationSwitcher from 'features/quranReader/components/TranslationSwitcher';
import { getReaderCssVars } from 'features/quranReader/services/readerStyles';
import { preloadSurah } from 'features/quranReader/services/playbackEngine';
import { usePlaybackStore } from 'stores/playbackStore';
import Typography from 'components/ui/Typography';
import EmptyState from 'components/feedback/EmptyState';
import Button from 'components/ui/Button';
import useReadingPreferences from 'hooks/useReadingPreferences';
import useFullscreen from 'hooks/useFullscreen';
import { isFavoriteSurah, useCollectionsStore } from 'stores/collectionsStore';
import useTranslation from 'hooks/useTranslation';
import styles from './SurahPage.module.css';

/** Only surface a loading affordance if preloading is still running after this long — most preloads finish well under it, and flashing a spinner for a near-instant background fetch would be noise, not signal. */
const SLOW_PRELOAD_HINT_DELAY_MS = 600;

const BISMILLAH_ARABIC = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

export default function SurahPage() {
  const { surahId } = useParams<{ surahId: string }>();
  const [searchParams] = useSearchParams();
  const { preferences } = useReadingPreferences();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTranslationsOpen, setIsTranslationsOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(pageRef);
  const favorites = useCollectionsStore((state) => state.favorites);
  const toggleFavoriteSurah = useCollectionsStore((state) => state.toggleFavoriteSurah);
  const { t } = useTranslation();

  const id = Number(surahId);
  const surah = SURAHS.find((item) => item.id === id);
  const isFavorite = isFavoriteSurah(favorites, id);
  const targetAyahParam = searchParams.get('ayah');
  const targetAyah = targetAyahParam ? Number(targetAyahParam) : undefined;

  const isSurahPreloading = usePlaybackStore((state) => state.isSurahPreloading);
  const [showSlowPreloadHint, setShowSlowPreloadHint] = useState(false);

  // Start warming audio + verse/translation caches the instant a surah is
  // opened — well before Play is pressed — so playback can start instantly
  // once the user actually taps it. See playbackEngine.preloadSurah.
  useEffect(() => {
    if (!surah) return;
    preloadSurah(surah.id, targetAyah ?? 1);
  }, [surah, targetAyah]);

  // Only worth telling the user anything if preloading is unusually slow —
  // the common case finishes well within this window and should stay silent.
  useEffect(() => {
    if (!isSurahPreloading) {
      setShowSlowPreloadHint(false);
      return undefined;
    }
    const timeout = setTimeout(() => setShowSlowPreloadHint(true), SLOW_PRELOAD_HINT_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [isSurahPreloading]);

  if (!surah) {
    return (
      <div className={styles.page}>
        <EmptyState title={t('emptyState.surahNotFoundTitle')} description={t('emptyState.surahNotFoundDescription')} />
      </div>
    );
  }

  const previousSurah = SURAHS.find((item) => item.id === surah.id - 1);
  const nextSurah = SURAHS.find((item) => item.id === surah.id + 1);

  return (
    <div ref={pageRef} className={styles.page} style={getReaderCssVars(preferences)}>
      <div className={styles.toolbar}>
        <Button
          variant="icon"
          onClick={() => toggleFavoriteSurah(surah.id)}
          aria-label={isFavorite ? t('quran.removeFavoriteSurah') : t('quran.addFavoriteSurah')}
          leadingIcon={<Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />}
        />
        <Button
          variant="icon"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? t('quran.exitFullScreen') : t('quran.enterFullScreen')}
          leadingIcon={isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        />
        <Button
          variant="icon"
          onClick={() => setIsTranslationsOpen(true)}
          aria-label={t('quran.chooseTranslations')}
          leadingIcon={<BookText size={16} />}
        />
        <Button
          variant="icon"
          onClick={() => setIsSettingsOpen(true)}
          aria-label={t('quran.readingSettings')}
          leadingIcon={<Settings size={16} />}
        />
      </div>

      <header className={styles.header}>
        <Typography variant="caption" muted>
          {t('quran.surahOfTotal', {
            number: surah.id,
            place: surah.revelationPlace === 'makkah' ? t('quran.meccan') : t('quran.medinan'),
          })}
        </Typography>
        <Typography variant="h1" className={styles.arabicTitle} dir="rtl" lang="ar">
          {surah.nameArabic}
        </Typography>
        <Typography variant="h3">{surah.nameSimple}</Typography>
        <Typography variant="body" muted>
          {t('quran.nameAndVerses', { name: surah.translatedName, count: surah.versesCount })}
        </Typography>

        {showSlowPreloadHint && (
          <Typography variant="caption" muted className={styles.preloadHint}>
            <Loader2 size={12} className={styles.spin} /> {t('quran.preparingAudio')}
          </Typography>
        )}

        {surah.bismillahPre && surah.id !== 1 && (
          <p className={styles.bismillah} dir="rtl" lang="ar">
            {BISMILLAH_ARABIC}
          </p>
        )}
      </header>

      <SurahView surahId={surah.id} targetAyah={targetAyah} />

      <nav className={styles.pager} aria-label={t('quran.surahNavigation')}>
        {previousSurah ? (
          <Link to={`/quran/${previousSurah.id}`} className={styles.pagerLink}>
            <Button variant="secondary" leadingIcon={<ChevronLeft size={16} />}>
              {previousSurah.nameSimple}
            </Button>
          </Link>
        ) : (
          <span />
        )}

        {nextSurah && (
          <Link to={`/quran/${nextSurah.id}`} className={styles.pagerLink}>
            <Button variant="secondary" trailingIcon={<ChevronRight size={16} />}>
              {nextSurah.nameSimple}
            </Button>
          </Link>
        )}
      </nav>

      <ReadingSettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} surahId={surah.id} />
      <TranslationSwitcher isOpen={isTranslationsOpen} onClose={() => setIsTranslationsOpen(false)} />
    </div>
  );
}
