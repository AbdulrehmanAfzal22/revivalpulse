import { Check } from 'lucide-react';
import Button from 'components/ui/Button';
import useTranslation from 'hooks/useTranslation';
import type { WordTrackerState } from '../../services/wordTracker';
import styles from './CompletionScreen.module.css';

export interface CompletionScreenProps {
  surahNameArabic: string;
  surahNameLatin: string;
  ayahCount: number;
  tracker: WordTrackerState;
  onReciteAgain: () => void;
  onNextSurah: () => void;
}

/**
 * A quiet finish — no confetti or celebratory animation, just a calm
 * confirmation plus the two ways to keep going. Accuracy is an
 * approximation (correct words vs. correction events), not a scientific
 * measure, so it's labeled loosely rather than presented as a precise score.
 */
export default function CompletionScreen({
  surahNameArabic,
  surahNameLatin,
  ayahCount,
  tracker,
  onReciteAgain,
  onNextSurah,
}: CompletionScreenProps) {
  const { t } = useTranslation();
  const totalWords = tracker.correctWords.size;
  const accuracy = Math.round((totalWords / Math.max(totalWords + tracker.mistakeCount, 1)) * 100);

  return (
    <div className={styles.wrapper}>
      <span className={styles.badge}>
        <Check size={28} />
      </span>
      <p className={styles.surahArabic} dir="rtl" lang="ar">
        {surahNameArabic}
      </p>
      <p className={styles.surahLatin}>{surahNameLatin}</p>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{ayahCount}</span>
          <span className={styles.statLabel}>{t('recitationCoach.completion.ayahs')}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{accuracy}%</span>
          <span className={styles.statLabel}>{t('recitationCoach.completion.accuracy')}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onReciteAgain}>
          {t('recitationCoach.completion.reciteAgain')}
        </Button>
        <Button variant="primary" onClick={onNextSurah}>
          {t('recitationCoach.completion.nextSurah')}
        </Button>
      </div>
    </div>
  );
}
