import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SURAHS } from 'data/quran/surahs';
import { JUZ_BOUNDARIES } from 'data/quran/juz';
import Typography from 'components/ui/Typography';
import EmptyState from 'components/feedback/EmptyState';
import useTranslation from 'hooks/useTranslation';
import styles from './QuranPage.module.css';

type Tab = 'surahs' | 'juz';

function surahNameById(id: number): string {
  return SURAHS.find((surah) => surah.id === id)?.nameSimple ?? `Surah ${id}`;
}

function surahLinkFromVerseKey(verseKey: string): { surahId: number; ayah: number } {
  const [surahId, ayah] = verseKey.split(':').map(Number);
  return { surahId: surahId as number, ayah: ayah as number };
}

export default function QuranPage() {
  const [tab, setTab] = useState<Tab>('surahs');
  const [query, setQuery] = useState('');
  const { t } = useTranslation();

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
    <div className={styles.page}>
      <Typography variant="h2">{t('quran.title')}</Typography>

      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'surahs'}
          className={[styles.tab, tab === 'surahs' && styles.tabActive].filter(Boolean).join(' ')}
          onClick={() => setTab('surahs')}
        >
          {t('quran.tabSurahs')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'juz'}
          className={[styles.tab, tab === 'juz' && styles.tabActive].filter(Boolean).join(' ')}
          onClick={() => setTab('juz')}
        >
          {t('quran.tabJuz')}
        </button>
      </div>

      {tab === 'surahs' && (
        <>
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
            <ul className={styles.list}>
              {filteredSurahs.map((surah) => (
                <li key={surah.id}>
                  <Link to={`/quran/${surah.id}`} className={styles.row}>
                    <span className={styles.number}>{surah.id}</span>
                    <span className={styles.rowText}>
                      <span className={styles.rowTitle}>{surah.nameSimple}</span>
                      <span className={styles.rowSubtitle}>
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
        </>
      )}

      {tab === 'juz' && (
        <ul className={styles.list}>
          {JUZ_BOUNDARIES.map((juz) => {
            const start = surahLinkFromVerseKey(juz.firstVerseKey);
            const end = surahLinkFromVerseKey(juz.lastVerseKey);
            return (
              <li key={juz.juzNumber}>
                <Link
                  to={`/quran/${start.surahId}?ayah=${start.ayah}`}
                  className={styles.row}
                >
                  <span className={styles.number}>{juz.juzNumber}</span>
                  <span className={styles.rowText}>
                    <span className={styles.rowTitle}>{t('quran.juzLabel', { number: juz.juzNumber })}</span>
                    <span className={styles.rowSubtitle}>
                      {surahNameById(start.surahId)} {juz.firstVerseKey} – {surahNameById(end.surahId)}{' '}
                      {juz.lastVerseKey}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
