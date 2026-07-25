import { Bookmark, Flame, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  calculateReadingStreak,
  favoriteHadithBookSlugs,
  favoriteSurahIds,
  useCollectionsStore,
} from 'stores/collectionsStore';
import { SURAHS } from 'data/quran/surahs';
import { HADITH_BOOKS } from 'data/hadith/books';
import { buildHadithBookPath } from 'constants/routes';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import EmptyState from 'components/feedback/EmptyState';
import useTranslation from 'hooks/useTranslation';
import styles from './BookmarksPage.module.css';

function surahName(surahId: number): string {
  return SURAHS.find((item) => item.id === surahId)?.nameSimple ?? `Surah ${surahId}`;
}

function hadithBookName(slug: string): string {
  return HADITH_BOOKS.find((item) => item.slug === slug)?.nameEnglish ?? slug;
}

export default function BookmarksPage() {
  const bookmarks = useCollectionsStore((state) => state.bookmarks).filter((item) => !item.deleted);
  const favorites = useCollectionsStore((state) => state.favorites);
  const readingHistory = useCollectionsStore((state) => state.readingHistory).filter((item) => !item.deleted);
  const toggleBookmark = useCollectionsStore((state) => state.toggleBookmark);
  const toggleFavoriteSurah = useCollectionsStore((state) => state.toggleFavoriteSurah);
  const toggleFavoriteHadithBook = useCollectionsStore((state) => state.toggleFavoriteHadithBook);

  const streak = calculateReadingStreak(readingHistory);
  const recentHistory = [...readingHistory].sort((a, b) => b.payload.lastReadAt - a.payload.lastReadAt).slice(0, 10);
  const favoriteSurahIdList = favoriteSurahIds(favorites);
  const favoriteBookSlugList = favoriteHadithBookSlugs(favorites);
  const { t, tp } = useTranslation();

  return (
    <div className={styles.page}>
      <Typography variant="h2">{t('bookmarks.title')}</Typography>

      <Card className={styles.streakCard}>
        <Flame size={20} className={styles.streakIcon} />
        <div>
          <Typography variant="h3">{tp('bookmarks.streakDays', streak)}</Typography>
          <Typography variant="caption" muted>
            {t('bookmarks.readingStreak')}
          </Typography>
        </div>
      </Card>

      <section className={styles.section}>
        <Typography variant="h3">{t('bookmarks.bookmarksHeading')}</Typography>
        {bookmarks.length === 0 ? (
          <EmptyState icon={<Bookmark size={20} />} title={t('emptyState.bookmarks.noBookmarks')} />
        ) : (
          <ul className={styles.list}>
            {bookmarks.map((bookmark) => {
              const [surahId, ayahNumber] = bookmark.payload.verseKey.split(':');
              return (
                <li key={bookmark.id} className={styles.row}>
                  <Link to={`/quran/${surahId}?ayah=${ayahNumber}`} className={styles.rowLink}>
                    {surahName(Number(surahId))} · {bookmark.payload.verseKey}
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(bookmark.payload.verseKey)}
                    aria-label={t('bookmarks.removeBookmark')}
                    leadingIcon={<Trash2 size={14} />}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <Typography variant="h3">{t('bookmarks.favoriteSurahs')}</Typography>
        {favoriteSurahIdList.length === 0 ? (
          <EmptyState icon={<Star size={20} />} title={t('emptyState.bookmarks.noFavoriteSurahs')} />
        ) : (
          <ul className={styles.list}>
            {favoriteSurahIdList.map((surahId) => (
              <li key={surahId} className={styles.row}>
                <Link to={`/quran/${surahId}`} className={styles.rowLink}>
                  {surahName(surahId)}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavoriteSurah(surahId)}
                  aria-label={t('bookmarks.removeFavorite')}
                  leadingIcon={<Trash2 size={14} />}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <Typography variant="h3">{t('bookmarks.favoriteHadithBooks')}</Typography>
        {favoriteBookSlugList.length === 0 ? (
          <EmptyState icon={<Star size={20} />} title={t('emptyState.bookmarks.noFavoriteHadithBooks')} />
        ) : (
          <ul className={styles.list}>
            {favoriteBookSlugList.map((slug) => (
              <li key={slug} className={styles.row}>
                <Link to={buildHadithBookPath(slug)} className={styles.rowLink}>
                  {hadithBookName(slug)}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavoriteHadithBook(slug)}
                  aria-label={t('bookmarks.removeFavorite')}
                  leadingIcon={<Trash2 size={14} />}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <Typography variant="h3">{t('bookmarks.recentlyRead')}</Typography>
        {recentHistory.length === 0 ? (
          <EmptyState title={t('emptyState.bookmarks.nothingRead')} />
        ) : (
          <ul className={styles.list}>
            {recentHistory.map((entry) => (
              <li key={entry.id} className={styles.row}>
                <Link to={`/quran/${entry.payload.surahId}?ayah=${entry.payload.verseKey.split(':')[1]}`} className={styles.rowLink}>
                  {surahName(entry.payload.surahId)} · {entry.payload.verseKey}
                </Link>
                <Typography variant="caption" muted>
                  {new Date(entry.payload.lastReadAt).toLocaleDateString()}
                </Typography>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
