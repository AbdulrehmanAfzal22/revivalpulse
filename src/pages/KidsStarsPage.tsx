import Typography from 'components/ui/Typography';
import MyStarsDashboard from 'features/kids/components/dashboard/MyStarsDashboard';
import KidsBackButton from 'features/kids/components/KidsBackButton';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsStarsPage.module.css';

export default function KidsStarsPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <KidsBackButton to={ROUTES.KIDS} />
      <Typography variant="h1" as="h1">
        {t('kids.myStars')}
      </Typography>
      <MyStarsDashboard />
    </div>
  );
}