import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Skeleton from 'components/ui/Skeleton';
import useDivineNames from 'features/namesOfAllah/hooks/useDivineNames';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import styles from './NameReflection.module.css';

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Fills the "Islamic Quote" home-widget slot from the Phase 13 brief. A
 * dedicated, clearly-sourced "Islamic quotes" dataset (short inspirational
 * lines attributed to scholars/companions) wasn't found — misattributed
 * quotes are a real, common problem in this genre of app, and this project
 * doesn't ship unverified attributions elsewhere, so it doesn't start here.
 * Rotating through the 99 Names (already fully sourced this same phase)
 * serves the same "something to reflect on today" purpose honestly.
 */
export default function NameReflection() {
  const { data, isPending, isError } = useDivineNames();
  const { t } = useTranslation();

  if (isError) return null;

  const name = data && data.length > 0 ? data[dayOfYear(new Date()) % data.length] : undefined;

  return (
    <Card elevation="raised" className={styles.card}>
      <div className={styles.heading}>
        <Sparkles size={16} />
        <Typography variant="caption" muted>
          {t('namesOfAllah.reflectOn')}
        </Typography>
      </div>

      {isPending && <Skeleton variant="text" count={3} />}

      {name && (
        <Link to={ROUTES.NAMES_OF_ALLAH} className={styles.link}>
          <Typography variant="h3" as="p" className={styles.arabic} dir="rtl">
            {name.arabic}
          </Typography>
          <Typography variant="body">
            {t('namesOfAllah.transliterationMeaning', { transliteration: name.transliteration, meaning: name.meaning })}
          </Typography>
        </Link>
      )}
    </Card>
  );
}
