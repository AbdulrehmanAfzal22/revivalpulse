import { Link } from 'react-router-dom';
import { ScrollText } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Skeleton from 'components/ui/Skeleton';
import useHadithOfTheDay from 'features/hadith/hooks/useHadithOfTheDay';
import { buildHadithBookPath } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import styles from './HadithOfTheDay.module.css';

export default function HadithOfTheDay() {
  const { data, isPending, isError } = useHadithOfTheDay();
  const { t } = useTranslation();

  if (isError) return null;

  return (
    <Card elevation="raised" className={styles.card}>
      <div className={styles.heading}>
        <ScrollText size={16} />
        <Typography variant="caption" muted>
          {t('hadith.hadithOfTheDay')}
        </Typography>
      </div>

      {isPending && <Skeleton variant="text" count={3} />}

      {data && (
        <Link to={buildHadithBookPath('nawawi40')} className={styles.link}>
          <Typography variant="body">{data.englishText}</Typography>
          <Typography variant="caption" muted>
            {data.narrator ? `${data.narrator} · ` : ''}
            {t('hadith.nawawiCitation', { number: data.idInBook })}
          </Typography>
        </Link>
      )}
    </Card>
  );
}
