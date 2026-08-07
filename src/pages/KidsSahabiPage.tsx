import { Link } from 'react-router-dom';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import StoryIllustration from 'features/kids/components/StoryIllustration';
import KidsBackButton from 'features/kids/components/KidsBackButton';
import { KIDS_SAHABI_V2 } from 'data/kids/sahabiV2';
import { ROUTES, buildKidsSahabiChaptersPath } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsSahabiPage.module.css';

/** Phase 7 — top-level Companions (Sahabah) list, chapter-based biographies. */
export default function KidsSahabiPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <KidsBackButton to={ROUTES.KIDS} />
      <Typography variant="h2">{t('kids.nav.sahabi')}</Typography>

      <div className={styles.grid}>
        {KIDS_SAHABI_V2.map((sahabi) => (
          <Link
            key={sahabi.id}
            to={buildKidsSahabiChaptersPath(sahabi.id)}
            className={styles.cardLink}
          >
            <Card elevation="raised" className={styles.card}>
              <StoryIllustration
                symbol={sahabi.illustrationSymbol}
                color={sahabi.accentColor}
                size={64}
              />
              <Typography variant="body">{sahabi.nameEnglish}</Typography>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}