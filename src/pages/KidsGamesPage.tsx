import { useNavigate } from 'react-router-dom';
import Typography from 'components/ui/Typography';
import PlaySetup from 'features/kids/components/setup/PlaySetup';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { GAMES } from 'features/kids/games/gameRegistry';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsGamesPage.module.css';

/**
 * Kids Games hub — every game in the registry gets a colorful gradient tile;
 * difficulty travels in route state to the generic play route
 * (/kids/games/:gameId) where the registry picks the engine.
 */
export default function KidsGamesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const startGame = (gameId: string, difficulty: PlayDifficulty) => {
    navigate(`${ROUTES.KIDS_GAMES}/${gameId}`, { state: { difficulty } });
  };

  return (
    <div className={styles.page}>
      <Typography variant="h1" as="h1">
        {t('kids.gamesHubTitle')}
      </Typography>
      <PlaySetup
        kind="game"
        difficultyLabels={{ easy: t('kids.difficultyEasy'), medium: t('kids.difficultyMedium') }}
        labels={{ start: t('kids.startPlay'), difficulty: t('kids.difficulty') }}
        onStart={startGame}
        topics={GAMES.map((game) => ({
          id: game.id,
          title: t(game.titleKey),
          description: t(game.descKey),
          background: game.gradient,
          icon: game.icon,
          color: game.color,
        }))}
      />
    </div>
  );
}
