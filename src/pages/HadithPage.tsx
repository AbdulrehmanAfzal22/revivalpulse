import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { HADITH_BOOKS } from 'data/hadith/books';
import { buildHadithBookPath } from 'constants/routes';
import { isFavoriteHadithBook, useCollectionsStore } from 'stores/collectionsStore';
import Typography from 'components/ui/Typography';
import Button from 'components/ui/Button';
import EmptyState from 'components/feedback/EmptyState';
import useTranslation from 'hooks/useTranslation';
import styles from './HadithPage.module.css';
import ContinueReadingCard from 'components/ui/ContinueReadingCard';
import { useReadingPositionStore } from 'stores/readingPositionStore';

export default function HadithPage() {
  const [query, setQuery] = useState('');
  const favorites = useCollectionsStore((state) => state.favorites);
  const toggleFavoriteHadithBook = useCollectionsStore((state) => state.toggleFavoriteHadithBook);
  const { t, tp } = useTranslation();
  const hadithPosition = useReadingPositionStore((state) => state.positions.hadith);
  const lastReadBook = hadithPosition?.module === 'hadith'
    ? HADITH_BOOKS.find((book) => book.slug === hadithPosition.bookSlug)
    : undefined;

  const filteredBooks = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return HADITH_BOOKS;
    return HADITH_BOOKS.filter(
      (book) => book.nameEnglish.toLowerCase().includes(term) || book.authorEnglish.toLowerCase().includes(term)
    );
  }, [query]);

  return (
    <div className={styles.page}>
        <Typography variant="h2">{t('hadith.title')}</Typography>
        <p className={styles.subtitle}>{t('hadith.subtitle')}</p>

        {hadithPosition?.module === 'hadith' && lastReadBook && (
          <ContinueReadingCard
            title="Continue Reading"
            description={`${lastReadBook.nameEnglish} · Chapter ${hadithPosition.chapterId} · Hadith ${hadithPosition.hadithNumber}`}
            preview={hadithPosition.preview}
            to={`/hadith/${hadithPosition.bookSlug}/${hadithPosition.chapterId}`}
          />
        )}

        <label className={styles.searchField}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            placeholder={t('hadith.searchBooksPlaceholder')}
            className={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        {filteredBooks.length === 0 ? (
          <EmptyState title={t('emptyState.hadith.noBooksMatch')} />
        ) : (
          <ul className={styles.bookGrid}>
            {filteredBooks.map((book) => {
              const isFavorite = isFavoriteHadithBook(favorites, book.slug);
              return (
                <li key={book.slug} className={styles.card}>
                  <Link to={buildHadithBookPath(book.slug)} className={styles.cardLink}>
                    <span className={styles.arabicName} dir="rtl" lang="ar">
                      {book.nameArabic}
                    </span>
                    <span className={styles.cardText}>
                      <span className={styles.cardTitle}>{book.nameEnglish}</span>
                      <span className={styles.cardSubtitle}>{book.authorEnglish}</span>
                    </span>
                  </Link>
                  <div className={styles.cardFooter}>
                    <span className={styles.hadithCount}>{tp('hadith.hadithsCount', book.totalHadiths)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavoriteHadithBook(book.slug)}
                      aria-label={isFavorite ? t('hadith.removeFromFavorites') : t('hadith.addToFavorites')}
                      leadingIcon={<Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
    </div>
  );
}
