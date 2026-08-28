import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Bookmark, Check, Copy, MoreVertical, Palette, Share2, StickyNote } from 'lucide-react';
import Button from './Button';
import SwatchGroup from './SwatchGroup';
import NoteDialog from './NoteDialog';
import ShareTextCard from './ShareTextCard';
import useClickOutside from 'hooks/useClickOutside';
import useTranslation from 'hooks/useTranslation';
import {
  getHighlightColorId,
  getNoteText,
  isBookmarked,
  useCollectionsStore,
} from 'stores/collectionsStore';
import { HIGHLIGHT_COLOR_PRESETS } from 'constants/readingPreferences';
import styles from './ContentActionsMenu.module.css';

export interface ContentActionsMenuProps {
  /** Unique, collision-safe id for bookmarks/notes/highlights, e.g. "2:255" or "hadith:bukhari:1". */
  contentId: string;
  arabicText: string;
  secondaryText: string;
  citation: string;
  fileNameBase: string;
  /** Feature-specific extra menu items (e.g. Tafsir link, Print) rendered above copy/share. */
  extraItems?: ReactNode;
}

export default function ContentActionsMenu({
  contentId,
  arabicText,
  secondaryText,
  citation,
  fileNameBase,
  extraItems,
}: ContentActionsMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const bookmarks = useCollectionsStore((state) => state.bookmarks);
  const highlights = useCollectionsStore((state) => state.highlights);
  const notes = useCollectionsStore((state) => state.notes);
  const toggleBookmark = useCollectionsStore((state) => state.toggleBookmark);
  const setHighlight = useCollectionsStore((state) => state.setHighlight);
  const removeHighlight = useCollectionsStore((state) => state.removeHighlight);
  const setNote = useCollectionsStore((state) => state.setNote);
  const removeNote = useCollectionsStore((state) => state.removeNote);

  useClickOutside(wrapperRef, isMenuOpen, () => setIsMenuOpen(false));

  const bookmarked = isBookmarked(bookmarks, contentId);
  const activeHighlight = getHighlightColorId(highlights, contentId);
  const noteText = getNoteText(notes, contentId);

  const handleHighlightChange = (colorId: string): void => {
    if (colorId === activeHighlight) {
      removeHighlight(contentId);
      return;
    }
    setHighlight(contentId, colorId);
  };

  const handleCopy = async (): Promise<void> => {
    const text = [arabicText, secondaryText, `— ${citation}`].filter(Boolean).join('\n\n');
    await navigator.clipboard.writeText(text);
    setJustCopied(true);
    window.setTimeout(() => setJustCopied(false), 1500);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Button
        variant="icon"
        size="sm"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-label={t('common.moreActions')}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        leadingIcon={<MoreVertical size={14} />}
      />

      {isMenuOpen && (
        <div className={styles.menu} role="menu">
          <button type="button" className={styles.item} onClick={() => toggleBookmark(contentId)}>
            <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
            {bookmarked ? t('common.removeBookmark') : t('common.bookmark')}
          </button>

          <button
            type="button"
            className={styles.item}
            onClick={() => {
              setIsMenuOpen(false);
              setIsNoteOpen(true);
            }}
          >
            <StickyNote size={15} />
            {t('common.note')}
          </button>

          <div className={styles.highlightRow}>
            <Palette size={15} className={styles.highlightIcon} />
            <SwatchGroup
              options={HIGHLIGHT_COLOR_PRESETS}
              value={activeHighlight ?? ''}
              onChange={handleHighlightChange}
            />
          </div>

          {extraItems}

          <button type="button" className={styles.item} onClick={() => void handleCopy()}>
            {justCopied ? <Check size={15} /> : <Copy size={15} />}
            {justCopied ? t('common.copied') : t('common.copy')}
          </button>

          <button
            type="button"
            className={styles.item}
            onClick={() => {
              setIsMenuOpen(false);
              setIsShareOpen(true);
            }}
          >
            <Share2 size={15} />
            {t('common.shareAsImage')}
          </button>
        </div>
      )}

      <NoteDialog
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        title={t('common.noteTitle', { citation })}
        value={noteText}
        onSave={(text) => setNote(contentId, text)}
        onDelete={() => removeNote(contentId)}
      />
      <ShareTextCard
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        arabicText={arabicText}
        secondaryText={secondaryText}
        citation={citation}
        fileNameBase={fileNameBase}
      />
    </div>
  );
}
