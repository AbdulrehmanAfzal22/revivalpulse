import { Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { HADITH_BOOKS } from 'data/hadith/books';
import HadithBookView from 'features/hadith/components/HadithBookView';
import Typography from 'components/ui/Typography';
import EmptyState from 'components/feedback/EmptyState';
import Button from 'components/ui/Button';
import { isFavoriteHadithBook, useCollectionsStore } from 'stores/collectionsStore';
import useTranslation from 'hooks/useTranslation';
import styles from './HadithBookPage.module.css';

export default function HadithBookPage() {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  const favorites = useCollectionsStore((state) => state.favorites);
  const toggleFavoriteHadithBook = useCollectionsStore((state) => state.toggleFavoriteHadithBook);
  const { t, tp } = useTranslation();

  const book = HADITH_BOOKS.find((item) => item.slug === bookSlug);

  if (!book) {
    return (
      <div className={styles.page}>
        <EmptyState title={t('hadith.bookNotFoundTitle')} description={t('hadith.bookNotFoundDescription')} />
      </div>
    );
  }

  const isFavorite = isFavoriteHadithBook(favorites, book.slug);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Typography variant="caption" muted>
            {tp('hadith.hadithsCount', book.totalHadiths)}
          </Typography>
          <Button
            variant="icon"
            onClick={() => toggleFavoriteHadithBook(book.slug)}
            aria-label={isFavorite ? t('hadith.removeFromFavorites') : t('hadith.addToFavorites')}
            leadingIcon={<Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />}
          />
        </div>
        <Typography variant="h1" className={styles.arabicTitle} dir="rtl" lang="ar">
          {book.nameArabic}
        </Typography>
        <Typography variant="h3">{book.nameEnglish}</Typography>
        <Typography variant="body" muted>
          {book.authorEnglish}
        </Typography>
      </header>

      <HadithBookView book={book} />
    </div>
  );
}
