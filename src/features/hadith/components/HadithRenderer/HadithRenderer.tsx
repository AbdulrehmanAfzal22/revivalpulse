import { useEffect, useRef, useState } from 'react';
import { getHighlightColorId, useCollectionsStore } from 'stores/collectionsStore';
import { HIGHLIGHT_COLOR_PRESETS } from 'constants/readingPreferences';
import HadithActionsMenu from 'features/hadith/components/HadithActionsMenu';
import type { Hadith, HadithBook } from 'types/hadith.types';
import type { HadithTranslation } from 'features/hadith/services/hadithTranslationClient';
import styles from './HadithRenderer.module.css';
import useReadingPreferences from 'hooks/useReadingPreferences';
import HadithGradeBadge from 'features/hadith/components/HadithGradeBadge/HadithGradeBadge';

export interface HadithRendererProps {
  hadith: Hadith;
  book: HadithBook;
  /**
   * Position to display next to the hadith — defaults to the book's global
   * idInBook numbering. Pass the hadith's 1-based position within its
   * chapter when rendering a chapter-scoped list, so numbering restarts at
   * 1 per topic rather than continuing the book's running count.
   */
  displayNumber?: number;
  translation?: HadithTranslation;
  isLastRead?: boolean;
}

export default function HadithRenderer({ hadith, book, displayNumber, translation, isLastRead = false }: HadithRendererProps) {
  const articleRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const highlights = useCollectionsStore((state) => state.highlights);
  const bookmarks = useCollectionsStore((state) => state.bookmarks);
  const { preferences } = useReadingPreferences();
  // Bookmark/highlight identity always uses the book-global idInBook — stable
  // regardless of which numbering is currently displayed.
  const contentId = `hadith:${book.slug}:${hadith.idInBook}`;
  const highlightColorId = getHighlightColorId(highlights, contentId);
  const highlightColor = HIGHLIGHT_COLOR_PRESETS.find((preset) => preset.id === highlightColorId)?.value;
  const isBookmarked = bookmarks.some((bookmark) => !bookmark.deleted && bookmark.payload.verseKey === contentId);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    if (articleRef.current) observer.observe(articleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={articleRef}
      className={[styles.hadith, isVisible && styles.hadithVisible, isBookmarked && styles.bookmarked].filter(Boolean).join(' ')}
      id={`hadith-${hadith.idInBook}`}
      style={highlightColor ? {
        '--hadith-highlight': highlightColor,
        backgroundColor: `color-mix(in srgb, ${highlightColor} 35%, transparent)`,
      } as React.CSSProperties : undefined}
    >
      {isLastRead && <div className={styles.lastReadMarker}>You left off here</div>}
      <div className={styles.meta}>
        <div className={styles.reference}>
          <span className={styles.number} aria-hidden="true">{displayNumber ?? hadith.idInBook}</span>
          <HadithGradeBadge bookSlug={book.slug} idInBook={hadith.idInBook} />
        </div>
          <HadithActionsMenu hadith={hadith} book={book} translation={translation} />
      </div>

      {hadith.narrator && <p className={styles.narrator}>{hadith.narrator}</p>}

      {preferences.showArabic && <p className={styles.arabic} dir="rtl" lang="ar">{hadith.arabic}</p>}

      {preferences.showTranslation && <p className={styles.english} dir={translation?.direction ?? 'ltr'}>{translation?.text ?? hadith.englishText}</p>}
    </article>
  );
}
