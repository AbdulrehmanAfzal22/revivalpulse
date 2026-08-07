import { useMemo } from 'react';
import { ChevronLeft, RotateCw } from 'lucide-react';
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
import styles from './HadithChapterPage.module.css';

export default function HadithChapterPage() {
  const { bookSlug, chapterId } = useParams<{ bookSlug: string; chapterId: string }>();
  const { t, tp } = useTranslation();

  const book = HADITH_BOOKS.find((item) => item.slug === bookSlug);
  const { data: content, isPending, isError, error, refetch, isFetching } = useHadithBook(book);

  const chapter = content?.chapters.find((item) => item.id === Number(chapterId));

  // idInBook is monotonically increasing within a chapter in the source data,
  // so sorting by it gives the correct in-chapter reading order to number against.
  const chapterHadiths = useMemo(() => {
    if (!content || !chapter) return [];
    return content.hadiths
      .filter((hadith) => hadith.chapterId === chapter.id)
      .sort((a, b) => a.idInBook - b.idInBook);
  }, [content, chapter]);

  if (!book) {
    return (
      <div className="container-reading">
        <EmptyState title={t('hadith.bookNotFoundTitle')} description={t('hadith.bookNotFoundDescription')} />
      </div>
    );
  }

  return (
    <div className="container-reading">
      <Link to={buildHadithBookPath(book.slug)} className={styles.backLink}>
        <ChevronLeft size={16} />
        {t('hadith.backToChapters')}
      </Link>

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

          <div className={styles.list}>
            {chapterHadiths.map((hadith, index) => (
              <HadithRenderer key={hadith.id} hadith={hadith} book={book} displayNumber={index + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
