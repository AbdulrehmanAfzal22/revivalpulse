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

export default function HadithPage() {
  const [query, setQuery] = useState('');
  const favorites = useCollectionsStore((state) => state.favorites);
  const toggleFavoriteHadithBook = useCollectionsStore((state) => state.toggleFavoriteHadithBook);
  const { t, tp } = useTranslation();

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
        <ul className={styles.list}>
          {filteredBooks.map((book) => {
            const isFavorite = isFavoriteHadithBook(favorites, book.slug);
            return (
              <li key={book.slug} className={styles.row}>
                <Link to={buildHadithBookPath(book.slug)} className={styles.rowLink}>
                  <span className={styles.rowText}>
                    <span className={styles.rowTitle}>{book.nameEnglish}</span>
                    <span className={styles.rowSubtitle}>
                      {book.authorEnglish} · {tp('hadith.hadithsCount', book.totalHadiths)}
                    </span>
                  </span>
                  <span className={styles.arabicName} dir="rtl" lang="ar">
                    {book.nameArabic}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavoriteHadithBook(book.slug)}
                  aria-label={isFavorite ? t('hadith.removeFromFavorites') : t('hadith.addToFavorites')}
                  leadingIcon={<Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
