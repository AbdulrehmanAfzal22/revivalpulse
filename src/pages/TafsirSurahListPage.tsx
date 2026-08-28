import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SURAHS } from 'data/quran/surahs';
import { buildTafsirSurahPath } from 'constants/routes';
import Typography from 'components/ui/Typography';
import EmptyState from 'components/feedback/EmptyState';
import useTranslation from 'hooks/useTranslation';
import styles from './TafsirSurahListPage.module.css';
import ContinueReadingCard from 'components/ui/ContinueReadingCard';
import { useReadingPositionStore } from 'stores/readingPositionStore';

export default function TafsirSurahListPage() {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();
  const tafsirPosition = useReadingPositionStore((state) => state.positions.tafsir);

  const filteredSurahs = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return SURAHS;
    return SURAHS.filter(
      (surah) =>
        surah.nameSimple.toLowerCase().includes(term) ||
        surah.translatedName.toLowerCase().includes(term) ||
        String(surah.id) === term
    );
  }, [query]);

  return (
    <div className={styles.shell}>
      <div className={styles.page}>
        <Typography variant="h2">{t('tafsir.selectSurahTitle')}</Typography>
        {tafsirPosition?.module === 'tafsir' && (
          <ContinueReadingCard
            title="Continue Reading"
            description={`${SURAHS.find((surah) => surah.id === tafsirPosition.surahId)?.nameSimple ?? `Surah ${tafsirPosition.surahId}`} · Verse ${tafsirPosition.ayahNumber}`}
            preview={tafsirPosition.preview}
            to={`/tafsir/${tafsirPosition.surahId}/${tafsirPosition.ayahNumber}`}
          />
        )}
        <Typography variant="body" muted>
          {t('tafsir.selectSurahDescription')}
        </Typography>

        <label className={styles.searchField}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            placeholder={t('quran.searchSurahsPlaceholder')}
            className={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        {filteredSurahs.length === 0 ? (
          <EmptyState title={t('emptyState.quran.noSurahsMatch')} />
        ) : (
          <ul className={styles.surahGrid} role="list">
            {filteredSurahs.map((surah) => (
              <li key={surah.id} className={styles.card}>
                <Link to={buildTafsirSurahPath(surah.id)} className={styles.cardLink}>
                  <span className={styles.number}>{surah.id}</span>
                  <span className={styles.cardText}>
                    <span className={styles.cardTitle}>{surah.nameSimple}</span>
                    <span className={styles.cardSubtitle}>
                      {t('quran.nameVersesPlace', {
                        name: surah.translatedName,
                        count: surah.versesCount,
                        place: surah.revelationPlace === 'makkah' ? t('quran.meccan') : t('quran.medinan'),
                      })}
                    </span>
                  </span>
                  <span className={styles.arabicName} dir="rtl" lang="ar">
                    {surah.nameArabic}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
