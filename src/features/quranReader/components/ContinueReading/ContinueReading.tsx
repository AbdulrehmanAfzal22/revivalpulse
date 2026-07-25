import { ArrowRight, BookOpen, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateReadingStreak, useCollectionsStore } from 'stores/collectionsStore';
import { SURAHS } from 'data/quran/surahs';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Button from 'components/ui/Button';
import useTranslation from 'hooks/useTranslation';
import styles from './ContinueReading.module.css';

export default function ContinueReading() {
  const lastRead = useCollectionsStore((state) => state.lastRead).filter((item) => !item.deleted);
  const readingHistory = useCollectionsStore((state) => state.readingHistory);
  const { t } = useTranslation();

  const latest = [...lastRead].sort((a, b) => b.payload.readAt - a.payload.readAt)[0];
  const streak = calculateReadingStreak(readingHistory);

  if (!latest) {
    return (
      <Card elevation="raised" className={styles.card}>
        <BookOpen size={20} className={styles.icon} />
        <div className={styles.text}>
          <Typography variant="h4">{t('quran.startReadingQuran')}</Typography>
          <Typography variant="caption" muted>
            {t('quran.startReadingDescription')}
          </Typography>
        </div>
        <Link to="/quran">
          <Button variant="primary" size="sm" trailingIcon={<ArrowRight size={14} />}>
            {t('quran.browseQuran')}
          </Button>
        </Link>
      </Card>
    );
  }

  const surah = SURAHS.find((item) => item.id === latest.payload.surahId);
  const ayahNumber = latest.payload.verseKey.split(':')[1];

  return (
    <Card elevation="raised" className={styles.card}>
      <BookOpen size={20} className={styles.icon} />
      <div className={styles.text}>
        <Typography variant="h4">{t('quran.continueReading')}</Typography>
        <Typography variant="caption" muted>
          {t('quran.continueReadingCaption', {
            name: surah?.nameSimple ?? `Surah ${latest.payload.surahId}`,
            number: ayahNumber ?? '',
          })}
        </Typography>
      </div>
      {streak > 0 && (
        <span className={styles.streak}>
          <Flame size={14} />
          {streak}
        </span>
      )}
      <Link to={`/quran/${latest.payload.surahId}?ayah=${ayahNumber}`}>
        <Button variant="primary" size="sm" trailingIcon={<ArrowRight size={14} />}>
          {t('quran.continue')}
        </Button>
      </Link>
    </Card>
  );
}
