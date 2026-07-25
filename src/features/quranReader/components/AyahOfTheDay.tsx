import { Link } from 'react-router-dom';
import { BookMarked } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Skeleton from 'components/ui/Skeleton';
import useAyahOfTheDay from 'features/quranReader/hooks/useAyahOfTheDay';
import useTranslation from 'hooks/useTranslation';
import styles from './AyahOfTheDay.module.css';

export default function AyahOfTheDay() {
  const { data, isPending, isError } = useAyahOfTheDay();
  const { t } = useTranslation();

  if (isError) return null;

  return (
    <Card elevation="raised" className={styles.card}>
      <div className={styles.heading}>
        <BookMarked size={16} />
        <Typography variant="caption" muted>
          {t('quran.ayahOfTheDay')}
        </Typography>
      </div>

      {isPending && <Skeleton variant="text" count={3} />}

      {data && (
        <Link to={`/quran/${data.verseKey.split(':')[0]}?ayah=${data.verseKey.split(':')[1]}`} className={styles.link}>
          <Typography variant="h4" as="p" className={styles.arabic} dir="rtl">
            {data.arabic}
          </Typography>
          <Typography variant="body" className={styles.translation}>
            {data.translation}
          </Typography>
          <Typography variant="caption" muted>
            {data.verseKey}
          </Typography>
        </Link>
      )}
    </Card>
  );
}
