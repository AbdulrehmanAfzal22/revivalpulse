import { useRef, useState } from 'react';
import { BookText, ChevronLeft, ChevronRight, Maximize, Minimize, Settings, Star } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { SURAHS } from 'data/quran/surahs';
import SurahView from 'features/quranReader/components/SurahView';
import ReadingSettingsPanel from 'features/quranReader/components/ReadingSettingsPanel';
import TranslationSwitcher from 'features/quranReader/components/TranslationSwitcher';
import { getReaderCssVars } from 'features/quranReader/services/readerStyles';
import Typography from 'components/ui/Typography';
import EmptyState from 'components/feedback/EmptyState';
import Button from 'components/ui/Button';
import useReadingPreferences from 'hooks/useReadingPreferences';
import useFullscreen from 'hooks/useFullscreen';
import { isFavoriteSurah, useCollectionsStore } from 'stores/collectionsStore';
import useTranslation from 'hooks/useTranslation';
import styles from './SurahPage.module.css';

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

  if (!surah) {
    return (
      <div className={styles.page}>
        <EmptyState title={t('emptyState.surahNotFoundTitle')} description={t('emptyState.surahNotFoundDescription')} />
      </div>
    );
  }

  const targetAyahParam = searchParams.get('ayah');
  const targetAyah = targetAyahParam ? Number(targetAyahParam) : undefined;
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
