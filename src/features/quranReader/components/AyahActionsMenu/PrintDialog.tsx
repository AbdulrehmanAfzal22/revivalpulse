import { useState } from 'react';
import { Printer } from 'lucide-react';
import Dialog from 'components/ui/Dialog';
import Button from 'components/ui/Button';
import Skeleton from 'components/ui/Skeleton';
import useChapterVerses from 'features/quranReader/hooks/useChapterVerses';
import useReadingPreferences from 'hooks/useReadingPreferences';
import { SURAHS } from 'data/quran/surahs';
import useTranslation from 'hooks/useTranslation';
import styles from './PrintDialog.module.css';

export interface PrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  surahId: number;
  defaultAyah: number;
}

export default function PrintDialog({ isOpen, onClose, surahId, defaultAyah }: PrintDialogProps) {
  const surah = SURAHS.find((item) => item.id === surahId);
  const { preferences } = useReadingPreferences();
  const { data: verses, isPending } = useChapterVerses(surahId, preferences.activeTranslationIds);
  const { t, tp } = useTranslation();

  const [startAyah, setStartAyah] = useState(defaultAyah);
  const [endAyah, setEndAyah] = useState(defaultAyah);

  const selectedVerses = (verses ?? []).filter(
    (ayah) => ayah.verseNumber >= startAyah && ayah.verseNumber <= endAyah
  );

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t('quran.printVerses')}>
      {isPending ? (
        <Skeleton variant="text" count={3} />
      ) : (
        <>
          <div className={styles.rangeRow}>
            <label className={styles.rangeField}>
              {t('quran.from')}
              <input
                type="number"
                min={1}
                max={surah?.versesCount ?? 1}
                value={startAyah}
                onChange={(event) => setStartAyah(Number(event.target.value))}
              />
            </label>
            <label className={styles.rangeField}>
              {t('quran.to')}
              <input
                type="number"
                min={1}
                max={surah?.versesCount ?? 1}
                value={endAyah}
                onChange={(event) => setEndAyah(Number(event.target.value))}
              />
            </label>
          </div>

          <Button
            variant="primary"
            onClick={() => window.print()}
            leadingIcon={<Printer size={16} />}
            disabled={selectedVerses.length === 0}
          >
            {tp('quran.printVersesCount', selectedVerses.length)}
          </Button>

          <div className={`print-area ${styles.printArea}`}>
            <h1 className={styles.printTitle}>
              {t('quran.printTitle', { name: surah?.nameSimple ?? '', start: startAyah, end: endAyah })}
            </h1>
            {selectedVerses.map((ayah) => (
              <div key={ayah.id} className={styles.printVerse}>
                <p className={styles.printArabic} dir="rtl" lang="ar">
                  {ayah.textUthmani} <span className={styles.printNumber}>({ayah.verseNumber})</span>
                </p>
                {ayah.translations[0] && <p className={styles.printTranslation}>{ayah.translations[0].text}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </Dialog>
  );
}
