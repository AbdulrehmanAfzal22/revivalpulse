import { getHighlightColorId, useCollectionsStore } from 'stores/collectionsStore';
import { HIGHLIGHT_COLOR_PRESETS } from 'constants/readingPreferences';
import HadithActionsMenu from 'features/hadith/components/HadithActionsMenu';
import type { Hadith, HadithBook } from 'types/hadith.types';
import styles from './HadithRenderer.module.css';

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
}

export default function HadithRenderer({ hadith, book, displayNumber }: HadithRendererProps) {
  const highlights = useCollectionsStore((state) => state.highlights);
  // Bookmark/highlight identity always uses the book-global idInBook — stable
  // regardless of which numbering is currently displayed.
  const contentId = `hadith:${book.slug}:${hadith.idInBook}`;
  const highlightColorId = getHighlightColorId(highlights, contentId);
  const highlightColor = HIGHLIGHT_COLOR_PRESETS.find((preset) => preset.id === highlightColorId)?.value;

  return (
    <article
      className={styles.hadith}
      id={`hadith-${hadith.idInBook}`}
      style={highlightColor ? { backgroundColor: `color-mix(in srgb, ${highlightColor} 35%, transparent)` } : undefined}
    >
      <div className={styles.meta}>
        <span className={styles.number} aria-hidden="true">
          {displayNumber ?? hadith.idInBook}
        </span>
        <HadithActionsMenu hadith={hadith} book={book} />
      </div>

      {hadith.narrator && <p className={styles.narrator}>{hadith.narrator}</p>}

      <p className={styles.arabic} dir="rtl" lang="ar">
        {hadith.arabic}
      </p>

      <p className={styles.english}>{hadith.englishText}</p>
    </article>
  );
}
