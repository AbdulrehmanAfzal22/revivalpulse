import { BookOpen, ChevronLeft, ChevronRight, RotateCw, ArrowLeft, Settings } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SURAHS } from 'data/quran/surahs';
import { TAFSIRS, DEFAULT_TAFSIR_ID } from 'constants/tafsirs';
import { ROUTES, buildTafsirPath } from 'constants/routes';
import useVerseArabicText from 'features/quranReader/hooks/useVerseArabicText';
import useAyahTafsir from 'features/quranReader/hooks/useAyahTafsir';
import TafsirSwitcher from 'features/quranReader/components/TafsirSwitcher';
import YouTubeSearchLink from 'components/media/YouTubeSearchLink';
import Typography from 'components/ui/Typography';
import Skeleton from 'components/ui/Skeleton';
import Button from 'components/ui/Button';
import EmptyState from 'components/feedback/EmptyState';
import useTranslation from 'hooks/useTranslation';
import useReadingPreferences from 'hooks/useReadingPreferences';
import { getReaderCssVars } from 'features/quranReader/services/readerStyles';
import ReadingSettingsPanel from 'features/quranReader/components/ReadingSettingsPanel';
import styles from './TafsirPage.module.css';
import { useReadingPositionStore } from 'stores/readingPositionStore';

function formatNumberedTafsirPoints(html: string): string {
  if (typeof DOMParser === 'undefined') return html;

  const document = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = document.body.firstElementChild;
  if (!root) return html;
  const pointNumber = (text: string): number | null => {
    const marker = text.match(/^\s*([0-9٠-٩]+)[.)]\s+/)?.[1];
    if (!marker) return null;
    const normalized = marker.replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
    return Number(normalized);
  };

  const processContainer = (container: Element): void => {
    Array.from(container.children).forEach((child) => processContainer(child));
    const paragraphs = Array.from(container.children).filter((element) => element.tagName === 'P');

    for (let index = 0; index < paragraphs.length; index += 1) {
      const firstParagraph = paragraphs[index];
      if (!firstParagraph || pointNumber(firstParagraph.textContent ?? '') !== 1) continue;

      const points = [firstParagraph];
      let expectedNumber = 2;
      while (index + points.length < paragraphs.length) {
        const paragraph = paragraphs[index + points.length];
        if (!paragraph) break;
        const number = pointNumber(paragraph.textContent ?? '');
        if (number !== expectedNumber) break;
        points.push(paragraph);
        expectedNumber += 1;
      }
      if (points.length < 2) continue;

      const list = document.createElement('ol');
      points.forEach((paragraph) => {
        const item = document.createElement('li');
        while (paragraph.firstChild) item.appendChild(paragraph.firstChild);
        const firstText = item.firstChild?.textContent;
        if (firstText && item.firstChild) {
          item.firstChild.textContent = firstText.replace(/^\s*\d+[.)]\s+/, '');
        }
        list.appendChild(item);
        paragraph.remove();
      });
      container.insertBefore(list, paragraphs[index + points.length] ?? null);
    }
  };

  processContainer(root);

  return root.innerHTML;
}

export default function TafsirPage() {
  const { surahId, ayahNumber } = useParams<{ surahId: string; ayahNumber: string }>();
  const [tafsirId, setTafsirId] = useState(DEFAULT_TAFSIR_ID);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { t } = useTranslation();
  const { preferences } = useReadingPreferences();
  const savePosition = useReadingPositionStore((state) => state.savePosition);
  const savedPosition = useReadingPositionStore((state) => state.positions.tafsir);

  const activeTafsir = TAFSIRS.find((item) => item.id === tafsirId) ?? TAFSIRS[0];
  const isRtlTafsir = activeTafsir?.languageCode === 'ar' || activeTafsir?.languageCode === 'ur';
  const isVideoTafsir = activeTafsir?.source === 'youtube';

  const surahNumber = Number(surahId);
  const verseNumber = Number(ayahNumber);
  const surah = SURAHS.find((item) => item.id === surahNumber);
  const verseKey = `${surahNumber}:${verseNumber}`;

  const arabicText = useVerseArabicText(verseKey);
  const tafsir = useAyahTafsir(isVideoTafsir ? '' : tafsirId, verseKey);

  useEffect(() => {
    if (!surah || !Number.isInteger(verseNumber) || verseNumber < 1 || verseNumber > surah.versesCount) return;
    const preview = tafsir.data?.replace(/<[^>]+>/g, '').trim() ?? '';
    savePosition({
      module: 'tafsir',
      surahId: surah.id,
      ayahNumber: verseNumber,
      verseKey,
      scrollTop: window.scrollY,
      preview,
      updatedAt: Date.now(),
    });

    let timeout: number | null = null;
    const handleScroll = (): void => {
      if (timeout) window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        savePosition({
          module: 'tafsir',
          surahId: surah.id,
          ayahNumber: verseNumber,
          verseKey,
          scrollTop: window.scrollY,
          preview,
          updatedAt: Date.now(),
        });
      }, 800);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [surah, tafsir.data, verseKey, verseNumber, savePosition]);

  if (!surah || !Number.isInteger(verseNumber) || verseNumber < 1 || verseNumber > surah.versesCount) {
    return (
      <div className="container" style={getReaderCssVars(preferences)}>
        <div className={styles.page}>
          <Link to={ROUTES.TAFSIR_SURAHS} className={styles.backLink}>
            <ArrowLeft size={14} />
            {t('tafsir.backToSurahs')}
          </Link>
          <EmptyState
            title={t('emptyState.tafsir.verseNotFoundTitle')}
            description={t('emptyState.tafsir.verseNotFoundDescription')}
          />
        </div>
      </div>
    );
  }

  const previousAyah = verseNumber > 1 ? verseNumber - 1 : null;
  const nextAyah = verseNumber < surah.versesCount ? verseNumber + 1 : null;
  return (
    <div className="container" style={getReaderCssVars(preferences)}>
      <div className={styles.page}>
        <div key={verseKey} className={styles.verseContent}>
          <div className={styles.readerHeader}>
            <div className={styles.topBar}>
              <Link to={ROUTES.TAFSIR_SURAHS} className={styles.backLink}>
                <ArrowLeft size={14} />
                {t('tafsir.backToSurahs')}
              </Link>
              <Button
                variant="icon"
                onClick={() => setIsSettingsOpen(true)}
                aria-label={t('quran.readingSettings')}
                leadingIcon={<Settings size={17} />}
              />
            </div>
            <Typography variant="caption" muted className={styles.verseCaption}>
              {t('tafsir.verseCaption', { surah: surah.nameSimple, verse: verseNumber })}
            </Typography>
          </div>
          {savedPosition?.module === 'tafsir' && savedPosition.verseKey === verseKey && (
            <div className={styles.lastReadMarker}>You left off here</div>
          )}

          <div className={styles.verseCard}>
        {arabicText.isPending && <Skeleton variant="text" height="2rem" />}
        {arabicText.isError && (
          <Typography variant="body" muted>
            {arabicText.error.message}
          </Typography>
        )}
        {arabicText.data && (
          <p className={styles.arabic} dir="rtl" lang="ar">
            {arabicText.data}
          </p>
        )}
          </div>

          <div className={styles.sourceRow}>
            <Button
              className={styles.tafsirSelector}
              variant="secondary"
              onClick={() => setIsSwitcherOpen(true)}
              leadingIcon={<BookOpen size={16} />}
              aria-label={t('tafsir.chooseTafsir')}
            >
              {activeTafsir?.label}
            </Button>
            <TafsirSwitcher
              isOpen={isSwitcherOpen}
              onClose={() => setIsSwitcherOpen(false)}
              tafsirId={tafsirId}
              onSelect={setTafsirId}
            />
          </div>

          <div key={`${tafsirId}-${verseKey}`} className={styles.content}>
        {isVideoTafsir ? (
          <>
            <Typography variant="caption" muted className={styles.videoNote}>
              {t('tafsir.videoTafsirNote')}
            </Typography>
            <YouTubeSearchLink
              query={`${activeTafsir.sourceId} ${surah.nameSimple}`}
              label={t('tafsir.watchOnYouTube', { name: activeTafsir.label })}
            />
          </>
        ) : (
          <>
            {tafsir.isPending && (
              <div aria-busy="true" aria-label={t('tafsir.loadingTafsir')}>
                <Skeleton variant="text" count={5} />
              </div>
            )}

            {tafsir.isError && (
              <EmptyState
                title={t('emptyState.tafsir.loadFailed')}
                description={tafsir.error.message}
                action={
                  <Button
                    variant="secondary"
                    onClick={() => tafsir.refetch()}
                    leadingIcon={<RotateCw size={16} />}
                  >
                    {t('common.retry')}
                  </Button>
                }
              />
            )}

            {tafsir.data && (
              <>
                {tafsir.data.trim().length === 0 ? (
                  <EmptyState title={t('tafsir.noText')} />
                ) : (
                  // Sanitized with DOMPurify in useAyahTafsir before it reaches here.
                  <div
                    className={isRtlTafsir ? `${styles.tafsirText} ${styles.tafsirTextArabic}` : styles.tafsirText}
                    dir={isRtlTafsir ? 'rtl' : 'auto'}
                    lang={activeTafsir?.languageCode}
                    dangerouslySetInnerHTML={{ __html: formatNumberedTafsirPoints(tafsir.data) }}
                  />
                )}
              </>
            )}
          </>
        )}
          </div>
        </div>

        <nav className={styles.pager} aria-label={t('tafsir.verseNavigation')}>
        {previousAyah ? (
          <Link to={buildTafsirPath(surah.id, previousAyah)} className={styles.pagerLink}>
            <Button variant="secondary" leadingIcon={<ChevronLeft size={16} />}>
              {t('tafsir.verseLabel', { number: previousAyah })}
            </Button>
          </Link>
        ) : (
          <span />
        )}

        {nextAyah && (
          <Link to={buildTafsirPath(surah.id, nextAyah)} className={styles.pagerLink}>
            <Button variant="secondary" trailingIcon={<ChevronRight size={16} />}>
              {t('tafsir.verseLabel', { number: nextAyah })}
            </Button>
          </Link>
        )}
        </nav>
        <ReadingSettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </div>
  );
}
