import ContentActionsMenu from 'components/ui/ContentActionsMenu';
import type { Hadith, HadithBook } from 'types/hadith.types';
import type { HadithTranslation } from 'features/hadith/services/hadithTranslationClient';

export interface HadithActionsMenuProps {
  hadith: Hadith;
  book: HadithBook;
  translation?: HadithTranslation;
}

export default function HadithActionsMenu({ hadith, book, translation }: HadithActionsMenuProps) {
  const citation = `${book.nameEnglish} ${hadith.idInBook}`;

  return (
    <ContentActionsMenu
      contentId={`hadith:${book.slug}:${hadith.idInBook}`}
      arabicText={hadith.arabic}
      secondaryText={translation?.text ?? hadith.englishText}
      citation={citation}
      fileNameBase={`hadith-${book.slug}-${hadith.idInBook}`}
    />
  );
}
