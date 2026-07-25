import ContentActionsMenu from 'components/ui/ContentActionsMenu';
import type { Hadith, HadithBook } from 'types/hadith.types';

export interface HadithActionsMenuProps {
  hadith: Hadith;
  book: HadithBook;
}

export default function HadithActionsMenu({ hadith, book }: HadithActionsMenuProps) {
  const citation = `${book.nameEnglish} ${hadith.idInBook}`;

  return (
    <ContentActionsMenu
      contentId={`hadith:${book.slug}:${hadith.idInBook}`}
      arabicText={hadith.arabic}
      secondaryText={hadith.englishText}
      citation={citation}
      fileNameBase={`hadith-${book.slug}-${hadith.idInBook}`}
    />
  );
}
