import { BookOpen, ChevronLeft, ChevronRight, RotateCw, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { SURAHS } from 'data/quran/surahs';
import { TAFSIRS, DEFAULT_TAFSIR_ID } from 'constants/tafsirs';
import { ROUTES, buildTafsirPath } from 'constants/routes';
import useVerseArabicText from 'features/quranReader/hooks/useVerseArabicText';
import useAyahTafsir from 'features/quranReader/hooks/useAyahTafsir';
import TafsirSwitcher from 'features/quranReader/components/TafsirSwitcher';
import YouTubeSearchLink from 'components/media/YouTubeSearchLink';
import Typography from 'components/ui/Typography';
import Skeleton from 'components/ui/Skeleton';
import Button from 'components/ui/Button';
import EmptyState from 'components/feedback/EmptyState';
import useTranslation from 'hooks/useTranslation';
import styles from './TafsirPage.module.css';

export default function TafsirPage() {
  const { surahId, ayahNumber } = useParams<{ surahId: string; ayahNumber: string }>();
  const [tafsirId, setTafsirId] = useState(DEFAULT_TAFSIR_ID);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const { t } = useTranslation();

  const activeTafsir = TAFSIRS.find((item) => item.id === tafsirId) ?? TAFSIRS[0];
  const isArabicTafsir = activeTafsir?.languageCode === 'ar';
  const isVideoTafsir = activeTafsir?.source === 'youtube';

  const surahNumber = Number(surahId);
  const verseNumber = Number(ayahNumber);
  const surah = SURAHS.find((item) => item.id === surahNumber);
  const verseKey = `${surahNumber}:${verseNumber}`;

  const arabicText = useVerseArabicText(verseKey);
  const tafsir = useAyahTafsir(isVideoTafsir ? '' : tafsirId, verseKey);

  if (!surah || !Number.isInteger(verseNumber) || verseNumber < 1 || verseNumber > surah.versesCount) {
    return (
      <div className="container-reading">
        <Link to={ROUTES.TAFSIR_SURAHS} className={styles.backLink}>
          <ArrowLeft size={14} />
          {t('tafsir.backToSurahs')}
        </Link>
        <EmptyState
          title={t('emptyState.tafsir.verseNotFoundTitle')}
          description={t('emptyState.tafsir.verseNotFoundDescription')}
        />
      </div>
    );
  }

  const previousAyah = verseNumber > 1 ? verseNumber - 1 : null;
  const nextAyah = verseNumber < surah.versesCount ? verseNumber + 1 : null;

  return (
    <div className="container-reading">
      <Link to={ROUTES.TAFSIR_SURAHS} className={styles.backLink}>
        <ArrowLeft size={14} />
        {t('tafsir.backToSurahs')}
      </Link>

      <Typography variant="caption" muted>
        {t('tafsir.verseCaption', { surah: surah.nameSimple, verse: verseNumber })}
      </Typography>

      <div className={styles.verseCard}>
        {arabicText.isPending && <Skeleton variant="text" height="2rem" />}
        {arabicText.isError && (
          <Typography variant="body" muted>
            {arabicText.error.message}
          </Typography>
        )}
        {arabicText.data && (
          <p className={styles.arabic} dir="rtl" lang="ar">
            {arabicText.data}
          </p>
        )}
      </div>

      <Button
        variant="secondary"
        onClick={() => setIsSwitcherOpen(true)}
        leadingIcon={<BookOpen size={16} />}
        aria-label={t('tafsir.chooseTafsir')}
      >
        {activeTafsir?.label}
      </Button>
      <TafsirSwitcher
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
        tafsirId={tafsirId}
        onSelect={setTafsirId}
      />

      <div className={styles.content}>
        {isVideoTafsir ? (
          <>
            <Typography variant="caption" muted className={styles.videoNote}>
              {t('tafsir.videoTafsirNote')}
            </Typography>
            <YouTubeSearchLink
              query={`${activeTafsir.sourceId} ${surah.nameSimple}`}
              label={t('tafsir.watchOnYouTube', { name: activeTafsir.label })}
            />
          </>
        ) : (
          <>
            {tafsir.isPending && (
              <div aria-busy="true" aria-label={t('tafsir.loadingTafsir')}>
                <Skeleton variant="text" count={5} />
              </div>
            )}

            {tafsir.isError && (
              <EmptyState
                title={t('emptyState.tafsir.loadFailed')}
                description={tafsir.error.message}
                action={
                  <Button
                    variant="secondary"
                    onClick={() => tafsir.refetch()}
                    leadingIcon={<RotateCw size={16} />}
                  >
                    {t('common.retry')}
                  </Button>
                }
              />
            )}

            {tafsir.data && (
              <>
                {tafsir.data.trim().length === 0 ? (
                  <EmptyState title={t('tafsir.noText')} />
                ) : (
                  // Sanitized with DOMPurify in useAyahTafsir before it reaches here.
                  <div
                    className={isArabicTafsir ? `${styles.tafsirText} ${styles.tafsirTextArabic}` : styles.tafsirText}
                    dir={isArabicTafsir ? 'rtl' : 'auto'}
                    lang={activeTafsir?.languageCode}
                    dangerouslySetInnerHTML={{ __html: tafsir.data }}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      <nav className={styles.pager} aria-label={t('tafsir.verseNavigation')}>
        {previousAyah ? (
          <Link to={buildTafsirPath(surah.id, previousAyah)} className={styles.pagerLink}>
            <Button variant="secondary" leadingIcon={<ChevronLeft size={16} />}>
              {t('tafsir.verseLabel', { number: previousAyah })}
            </Button>
          </Link>
        ) : (
          <span />
        )}

        {nextAyah && (
          <Link to={buildTafsirPath(surah.id, nextAyah)} className={styles.pagerLink}>
            <Button variant="secondary" trailingIcon={<ChevronRight size={16} />}>
              {t('tafsir.verseLabel', { number: nextAyah })}
            </Button>
          </Link>
        )}
      </nav>
    </div>
  );
}
