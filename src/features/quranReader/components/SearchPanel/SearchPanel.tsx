import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import DOMPurify from 'dompurify';
import { SURAHS } from 'data/quran/surahs';
import PillGroup from 'components/ui/PillGroup';
import Skeleton from 'components/ui/Skeleton';
import EmptyState from 'components/feedback/EmptyState';
import Typography from 'components/ui/Typography';
import useDebouncedValue from 'hooks/useDebouncedValue';
import useVerseSearch from 'features/quranReader/hooks/useVerseSearch';
import { SEARCH_DEBOUNCE_MS, SEARCH_MODES } from 'constants/search';
import useTranslation from 'hooks/useTranslation';
import type { SearchMode, TranslationSearchLanguage } from 'types/search.types';
import styles from './SearchPanel.module.css';

export interface SearchPanelProps {
  onNavigate?: () => void;
}

export default function SearchPanel({ onNavigate }: SearchPanelProps) {
  const [mode, setMode] = useState<SearchMode>('surah');
  const [query, setQuery] = useState('');
  const [translationLanguage, setTranslationLanguage] = useState<TranslationSearchLanguage>('en');
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const { t, tp } = useTranslation();

  const TRANSLATION_LANGUAGES: { id: TranslationSearchLanguage; label: string }[] = [
    { id: 'en', label: t('quran.search.translationLangEnglish') },
    { id: 'ur', label: t('quran.search.translationLangUrdu') },
  ];

  const surahResults = useMemo(() => {
    if (mode !== 'surah') return [];
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) return [];
    return SURAHS.filter(
      (surah) =>
        surah.nameSimple.toLowerCase().includes(term) ||
        surah.translatedName.toLowerCase().includes(term) ||
        String(surah.id) === term
    ).slice(0, 20);
  }, [mode, debouncedQuery]);

  const verseSearch = useVerseSearch(
    mode === 'surah' ? 'ayah' : mode,
    mode === 'surah' ? '' : debouncedQuery,
    translationLanguage
  );

  const activeMode = SEARCH_MODES.find((item) => item.id === mode);

  return (
    <div className={styles.panel}>
      <PillGroup
        options={SEARCH_MODES.map((item) => ({ id: item.id, label: t(item.labelKey) }))}
        value={mode}
        onChange={(id) => setMode(id as SearchMode)}
      />

      <label className={styles.field}>
        <Search size={16} className={styles.fieldIcon} />
        <input
          type="search"
          className={styles.input}
          placeholder={activeMode ? t(activeMode.placeholderKey) : undefined}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
        />
      </label>

      {mode === 'translation' && (
        <PillGroup
          options={TRANSLATION_LANGUAGES}
          value={translationLanguage}
          onChange={(id) => setTranslationLanguage(id as TranslationSearchLanguage)}
        />
      )}

      <div className={styles.results}>
        {mode === 'surah' &&
          (surahResults.length === 0 ? (
            debouncedQuery.trim() && <EmptyState title={t('emptyState.quran.noSurahsMatch')} />
          ) : (
            <ul className={styles.list}>
              {surahResults.map((surah) => (
                <li key={surah.id}>
                  <Link to={`/quran/${surah.id}`} className={styles.resultRow} onClick={onNavigate}>
                    <span className={styles.resultNumber}>{surah.id}</span>
                    <span className={styles.resultText}>
                      <span className={styles.resultTitle}>{surah.nameSimple}</span>
                      <span className={styles.resultSubtitle}>{surah.translatedName}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}

        {mode !== 'surah' && (
          <>
            {verseSearch.isPending && debouncedQuery.trim().length >= 2 && (
              <div className={styles.skeletonList}>
                <Skeleton variant="text" count={4} />
              </div>
            )}

            {verseSearch.isError && (
              <EmptyState title={t('emptyState.quran.searchFailed')} description={verseSearch.error.message} />
            )}

            {verseSearch.data && verseSearch.data.results.length === 0 && debouncedQuery.trim().length >= 2 && (
              <EmptyState title={t('emptyState.quran.noVerses')} />
            )}

            {verseSearch.data && verseSearch.data.results.length > 0 && (
              <>
                <Typography variant="caption" muted className={styles.count}>
                  {tp('quran.search.resultsCount', verseSearch.data.totalResults)}
                </Typography>
                <ul className={styles.list}>
                  {verseSearch.data.results.map((result) => {
                    const [surahId, ayahNumber] = result.verseKey.split(':');
                    const surah = SURAHS.find((item) => item.id === Number(surahId));
                    return (
                      <li key={result.verseKey}>
                        <Link
                          to={`/quran/${surahId}?ayah=${ayahNumber}`}
                          className={styles.resultRow}
                          onClick={onNavigate}
                        >
                          <span className={styles.resultText}>
                            <span className={styles.resultSubtitle}>
                              {surah?.nameSimple ?? `Surah ${surahId}`} · {result.verseKey}
                            </span>
                            <span className={styles.resultArabic} dir="rtl" lang="ar">
                              {result.textUthmani}
                            </span>
                            {result.matchedTranslationText && (
                              <span
                                className={styles.resultTranslation}
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(result.matchedTranslationText, {
                                    ALLOWED_TAGS: ['em'],
                                  }),
                                }}
                              />
                            )}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
