import { useState } from 'react';
import { Printer } from 'lucide-react';
import ContentActionsMenu from 'components/ui/ContentActionsMenu';
import useTranslation from 'hooks/useTranslation';
import { SURAHS } from 'data/quran/surahs';
import type { Ayah } from 'types/quran.types';
import PrintDialog from './PrintDialog';
import styles from './AyahActionsMenu.module.css';

export interface AyahActionsMenuProps {
  ayah: Ayah;
}

export default function AyahActionsMenu({ ayah }: AyahActionsMenuProps) {
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const { t } = useTranslation();
  const surah = SURAHS.find((item) => item.id === ayah.chapterId);
  const citation = `${surah?.nameSimple ?? ''} ${ayah.verseKey}`.trim();

  return (
    <>
      <ContentActionsMenu
        contentId={ayah.verseKey}
        arabicText={ayah.textUthmani}
        secondaryText={ayah.translations[0]?.text ?? ''}
        citation={citation}
        fileNameBase={`ayah-${ayah.verseKey.replace(':', '-')}`}
        extraItems={
          <button type="button" className={styles.item} onClick={() => setIsPrintOpen(true)}>
            <Printer size={15} />
            {t('common.print')}
          </button>
        }
      />
      <PrintDialog isOpen={isPrintOpen} onClose={() => setIsPrintOpen(false)} surahId={ayah.chapterId} defaultAyah={ayah.verseNumber} />
    </>
  );
}
