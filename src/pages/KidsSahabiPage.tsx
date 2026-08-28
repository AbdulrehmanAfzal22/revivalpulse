import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
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
  const [query, setQuery] = useState('');
  const { t } = useTranslation();
  const visibleCompanions = KIDS_SAHABI_V2.filter((sahabi) =>
    sahabi.nameEnglish.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className={styles.page}>
      <KidsBackButton to={ROUTES.KIDS} />
      <Typography variant="h2">{t('kids.nav.sahabi')}</Typography>

      <label className={styles.searchField}>
        <Search size={20} aria-hidden="true" />
        <span className="sr-only">Search companions</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search companions"
        />
      </label>

      <div className={styles.grid}>
        {visibleCompanions.map((sahabi) => (
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
              <Typography variant="body" className={styles.storyName}>
                {sahabi.nameEnglish}
              </Typography>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}