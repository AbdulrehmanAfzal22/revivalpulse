import { useMemo, useState } from 'react';
import { ChevronRight, RotateCw, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import useHadithBook from 'features/hadith/hooks/useHadithBook';
import { searchHadiths } from 'features/hadith/services/hadithSearch';
import HadithRenderer from 'features/hadith/components/HadithRenderer';
import Skeleton from 'components/ui/Skeleton';
import Button from 'components/ui/Button';
import EmptyState from 'components/feedback/EmptyState';
import Typography from 'components/ui/Typography';
import { buildHadithChapterPath } from 'constants/routes';
import type { HadithBook } from 'types/hadith.types';
import useTranslation from 'hooks/useTranslation';
import styles from './HadithBookView.module.css';

export interface HadithBookViewProps {
  book: HadithBook;
}

/**
 * Book landing view: chapters/topics list by default (clicking one opens
 * features/hadith/../HadithChapterPage, numbered 1..N within that topic) —
 * searching switches to a flat, book-wide result list instead, since results
 * spanning multiple chapters can't sensibly use per-chapter numbering.
 */
export default function HadithBookView({ book }: HadithBookViewProps) {
  const { data: content, isPending, isError, error, refetch, isFetching } = useHadithBook(book);
  const [query, setQuery] = useState('');
  const { t, tp } = useTranslation();

  const searchResults = useMemo(() => {
    if (!content || !query.trim()) return null;
    return searchHadiths(content, { query, chapterId: null });
  }, [content, query]);

  const chapterCounts = useMemo(() => {
    const counts = new Map<number, number>();
    if (!content) return counts;
    for (const hadith of content.hadiths) {
      counts.set(hadith.chapterId, (counts.get(hadith.chapterId) ?? 0) + 1);
    }
    return counts;
  }, [content]);

  if (isPending) {
    return (
      <div className={styles.list} aria-busy="true" aria-label={t('hadith.loadingBook', { book: book.nameEnglish })}>
        <Typography variant="caption" muted className={styles.loadingNote}>
          {t('hadith.loadingBookWithCount', { book: book.nameEnglish, count: book.totalHadiths.toLocaleString() })}
        </Typography>
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className={styles.skeletonRow}>
            <Skeleton variant="text" width="90%" height="1.5rem" />
            <Skeleton variant="text" width="70%" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title={t('emptyState.hadith.loadFailed')}
        description={error.message}
        action={
          <Button variant="secondary" onClick={() => refetch()} disabled={isFetching} leadingIcon={<RotateCw size={16} />}>
            {isFetching ? t('common.retrying') : t('common.retry')}
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <label className={styles.field} aria-label={`${t('hadith.searchPlaceholder')} (${book.nameEnglish})`}>
        <Search size={16} className={styles.fieldIcon} />
        <input
          type="search"
          className={styles.input}
          placeholder={t('hadith.searchPlaceholder')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      {searchResults ? (
        searchResults.length === 0 ? (
          <EmptyState title={t('emptyState.hadith.noMatches')} />
        ) : (
          <div className={styles.list}>
            {searchResults.map((hadith) => (
              <HadithRenderer key={hadith.id} hadith={hadith} book={book} />
            ))}
            <Typography variant="caption" muted className={styles.count}>
              {tp('hadith.hadithsCount', searchResults.length)}
            </Typography>
          </div>
        )
      ) : (
        <>
          <Typography variant="h4" as="h2" className={styles.chaptersHeading}>
            {t('hadith.chapters')}
          </Typography>
          <ul className={styles.chapterGrid} role="list">
          {content.chapters.map((chapter) => (
            <li key={chapter.id} className={styles.card}>
              <Link to={buildHadithChapterPath(book.slug, chapter.id)} className={styles.cardLink}>
                <span className={styles.cardText}>
                  <Typography variant="body" className={styles.chapterName}>
                    {chapter.nameEnglish}
                  </Typography>
                  <Typography variant="h4" as="span" className={styles.chapterArabic} dir="rtl" lang="ar">
                    {chapter.nameArabic}
                  </Typography>
                </span>
                <span className={styles.cardMeta}>
                  <Typography variant="caption" muted>
                    {tp('hadith.hadithsCount', chapterCounts.get(chapter.id) ?? 0)}
                  </Typography>
                  <ChevronRight size={16} />
                </span>
              </Link>
            </li>
          ))}
          </ul>
        </>
      )}
    </div>
  );
}
