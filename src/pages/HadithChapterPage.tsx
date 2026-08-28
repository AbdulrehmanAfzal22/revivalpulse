import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Settings, RotateCw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { HADITH_BOOKS } from 'data/hadith/books';
import useHadithBook from 'features/hadith/hooks/useHadithBook';
import HadithRenderer from 'features/hadith/components/HadithRenderer';
import Typography from 'components/ui/Typography';
import Skeleton from 'components/ui/Skeleton';
import Button from 'components/ui/Button';
import EmptyState from 'components/feedback/EmptyState';
import { buildHadithBookPath } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import useReadingPreferences from 'hooks/useReadingPreferences';
import styles from './HadithChapterPage.module.css';
import { getReaderCssVars } from 'features/quranReader/services/readerStyles';
import HadithTranslationSettings from 'features/hadith/components/HadithTranslationSettings/HadithTranslationSettings';
import useHadithTranslationLanguages from 'features/hadith/hooks/useHadithTranslation';
import { useHadithTranslation } from 'features/hadith/hooks/useHadithTranslation';
import type { HadithTranslationLanguage } from 'features/hadith/services/hadithTranslationClient';
import useHadithReadingTracker from 'features/hadith/hooks/useHadithReadingTracker';
import { useReadingPositionStore } from 'stores/readingPositionStore';

export default function HadithChapterPage() {
  const { bookSlug, chapterId } = useParams<{ bookSlug: string; chapterId: string }>();
  const { t, tp } = useTranslation();
  const { preferences } = useReadingPreferences();
  const [isTranslationSettingsOpen, setIsTranslationSettingsOpen] = useState(false);

  const book = HADITH_BOOKS.find((item) => item.slug === bookSlug);
  const { data: content, isPending, isError, error, refetch, isFetching } = useHadithBook(book);

  const chapter = content?.chapters.find((item) => item.id === Number(chapterId));
  const languagesQuery = useHadithTranslationLanguages(bookSlug ?? '');
  const availableLanguages: HadithTranslationLanguage[] = languagesQuery.data ?? [];
  const selectedLanguage = availableLanguages.find((language) => language.code === preferences.hadithTranslationLanguage);
  const translationQuery = useHadithTranslation(bookSlug ?? '', selectedLanguage);
  const savedPosition = useReadingPositionStore((state) => state.positions.hadith);

  // idInBook is monotonically increasing within a chapter in the source data,
  // so sorting by it gives the correct in-chapter reading order to number against.
  const chapterHadiths = useMemo(() => {
    if (!content || !chapter) return [];
    return content.hadiths
      .filter((hadith) => hadith.chapterId === chapter.id)
      .sort((a, b) => a.idInBook - b.idInBook);
  }, [content, chapter]);

  useHadithReadingTracker(bookSlug ?? '', Number(chapterId), chapterHadiths);

  useEffect(() => {
    if (!chapterHadiths || savedPosition?.module !== 'hadith' || savedPosition.bookSlug !== bookSlug
      || savedPosition.chapterId !== Number(chapterId)) return;
    document.getElementById(`hadith-${savedPosition.hadithNumber}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [bookSlug, chapterId, chapterHadiths, savedPosition]);

  if (!book) {
    return (
      <div className={styles.readerShell}>
        <EmptyState title={t('hadith.bookNotFoundTitle')} description={t('hadith.bookNotFoundDescription')} />
      </div>
    );
  }

  return (
    <div className={styles.readerShell} style={getReaderCssVars(preferences)}>
      <div className={styles.readerHeader}>
        <div className={styles.topBar}>
          <Link to={buildHadithBookPath(book.slug)} className={styles.backLink}>
            <ChevronLeft size={16} />
            {t('hadith.backToChapters')}
          </Link>
          <Button
            variant="icon"
            onClick={() => setIsTranslationSettingsOpen(true)}
            aria-label="Hadith reading settings"
            leadingIcon={<Settings size={16} />}
          />
        </div>
        {chapter && (
          <>
            {translationQuery.isError && (
              <Typography variant="caption" muted className={styles.translationNotice}>
                Translation unavailable. Showing English.
              </Typography>
            )}
            <header className={styles.header}>
              <Typography variant="caption" muted>
                {book.nameEnglish}
              </Typography>
              <Typography variant="h2">{chapter.nameEnglish}</Typography>
              <Typography variant="h3" as="p" className={styles.chapterArabic} dir="rtl" lang="ar">
                {chapter.nameArabic}
              </Typography>
              <Typography variant="caption" muted>
                {tp('hadith.hadithsCount', chapterHadiths.length)}
              </Typography>
            </header>
          </>
        )}
      </div>

      <HadithTranslationSettings
        bookSlug={book.slug}
        isOpen={isTranslationSettingsOpen}
        onClose={() => setIsTranslationSettingsOpen(false)}
      />

      {isPending && (
        <div aria-busy="true" aria-label={t('hadith.loadingBook', { book: book.nameEnglish })}>
          <Skeleton variant="text" width="60%" height="1.75rem" />
          <Skeleton variant="text" count={4} />
        </div>
      )}

      {isError && (
        <EmptyState
          title={t('emptyState.hadith.loadFailed')}
          description={error.message}
          action={
            <Button variant="secondary" onClick={() => refetch()} disabled={isFetching} leadingIcon={<RotateCw size={16} />}>
              {isFetching ? t('common.retrying') : t('common.retry')}
            </Button>
          }
        />
      )}

      {content && !chapter && (
        <EmptyState title={t('hadith.chapterNotFoundTitle')} description={t('hadith.chapterNotFoundDescription')} />
      )}

      {chapter && (
        <>
          <div className={styles.list}>
            {chapterHadiths.map((hadith, index) => (
              <HadithRenderer
                key={hadith.id}
                hadith={hadith}
                book={book}
                displayNumber={index + 1}
                translation={translationQuery.data?.[hadith.idInBook]}
                isLastRead={savedPosition?.module === 'hadith' && savedPosition.bookSlug === book.slug
                  && savedPosition.chapterId === chapter.id && savedPosition.hadithNumber === hadith.idInBook}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
