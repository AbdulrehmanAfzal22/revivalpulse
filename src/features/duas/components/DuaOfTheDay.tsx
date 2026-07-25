import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Skeleton from 'components/ui/Skeleton';
import useDuas from 'features/duas/hooks/useDuas';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import styles from './DuaOfTheDay.module.css';

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DuaOfTheDay() {
  const { data, isPending, isError } = useDuas();
  const { t } = useTranslation();

  if (isError) return null;

  const dua = data && data.length > 0 ? data[dayOfYear(new Date()) % data.length] : undefined;

  return (
    <Card elevation="raised" className={styles.card}>
      <div className={styles.heading}>
        <Heart size={16} />
        <Typography variant="caption" muted>
          {t('duas.duaOfTheDay')}
        </Typography>
      </div>

      {isPending && <Skeleton variant="text" count={3} />}

      {dua && (
        <Link to={ROUTES.DUAS} className={styles.link}>
          <Typography variant="body" className={styles.arabic} dir="rtl">
            {dua.arabic}
          </Typography>
          <Typography variant="body">{dua.translation}</Typography>
          <Typography variant="caption" muted>
            {dua.title}
          </Typography>
        </Link>
      )}
    </Card>
  );
}
