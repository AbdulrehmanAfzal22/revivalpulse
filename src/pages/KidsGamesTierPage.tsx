import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Typography from 'components/ui/Typography';
import { GAMES } from 'features/kids/games/gameRegistry';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import type { TranslationKey } from 'i18n';
import styles from './KidsGamesTierPage.module.css';

type Tier = 'easy' | 'medium' | 'hard';

const TIERS: Tier[] = ['easy', 'medium', 'hard'];

const TIER_LABELS: Record<Tier, TranslationKey> = {
  easy: 'kids.difficultyEasy',
  medium: 'kids.difficultyMedium',
  hard: 'kids.difficultyHard',
};

const TIER_DESCRIPTIONS: Record<Tier, TranslationKey> = {
  easy: 'kids.tierEasyDesc',
  medium: 'kids.tierMediumDesc',
  hard: 'kids.tierHardDesc',
};

const TIER_PATHS: Record<Tier, string> = {
  easy: ROUTES.KIDS_GAMES_TIER.replace(':tier', 'easy'),
  medium: ROUTES.KIDS_GAMES_TIER.replace(':tier', 'medium'),
  hard: ROUTES.KIDS_GAMES_TIER.replace(':tier', 'hard'),
};

export default function KidsGamesTierPage() {
  const { tier } = useParams<{ tier: Tier }>();
  const { t } = useTranslation();

  const validTier: Tier = tier && TIERS.includes(tier) ? tier : 'easy';

  const tierPath = (t: Tier) => TIER_PATHS[t];

  const gamePlayPath = (gameId: string) =>
    ROUTES.KIDS_GAME_PLAY.replace(':tier', validTier).replace(':gameId', gameId);

  return (
    <div className={styles.page}>
      <nav className={styles.tierTabs} aria-label={t('kids.difficulty')}>
        {TIERS.map((tierKey) => (
          <NavLink
            key={tierKey}
            to={tierPath(tierKey)}
            end
            className={({ isActive }) =>
              [styles.tierTab, isActive && styles.tierTabActive].filter(Boolean).join(' ')
            }
          >
            {t(TIER_LABELS[tierKey])}
          </NavLink>
        ))}
      </nav>

      <header className={styles.header}>
        <Typography variant="h1" as="h1" className={styles.title}>
          {t('kids.gamesHubTitle')}
        </Typography>
        <Typography variant="body" className={styles.subtitle}>
          {t(TIER_LABELS[validTier])}
        </Typography>
        <Typography variant="caption" className={styles.description}>
          {t(TIER_DESCRIPTIONS[validTier])}
        </Typography>
      </header>

      <div className={styles.grid} role="list" aria-label={t('kids.gamesListLabel')}>
        {GAMES.map((game) => (
          <a
            key={game.id}
            href={gamePlayPath(game.id)}
            className={styles.tile}
            style={{
              borderColor: game.color,
              background: game.gradient,
            }}
            role="listitem"
          >
            <span className={styles.tileIconWrap}>
              <game.icon size={30} color={game.color} aria-hidden="true" />
            </span>
            <span className={styles.tileText}>
              <span className={styles.tileTitle}>{t(game.titleKey)}</span>
              <span className={styles.tileDescription}>{t(game.descKey)}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}