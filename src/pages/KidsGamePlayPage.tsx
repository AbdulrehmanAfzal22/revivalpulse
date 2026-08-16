import type { ComponentType } from 'react';
import { useParams } from 'react-router-dom';
import EmptyState from 'components/feedback/EmptyState';
import MatchingGame from 'features/kids/components/games/MatchingGame';
import MemoryFlipGame from 'features/kids/components/games/MemoryFlipGame';
import BalloonPopGame from 'features/kids/components/games/BalloonPopGame';
import SpotGame from 'features/kids/components/games/SpotGame';
import HuntGame from 'features/kids/components/games/HuntGame';
import OrderGame from 'features/kids/components/games/OrderGame';
import SpellGame from 'features/kids/components/games/SpellGame';
import CountStarsGame from 'features/kids/components/games/CountStarsGame';
import TrueFalseGame from 'features/kids/components/games/TrueFalseGame';
import LetterCountGame from 'features/kids/components/games/LetterCountGame';
import StoryQuizGame from 'features/kids/components/games/StoryQuizGame';
import WordFinderGame from 'features/kids/components/games/WordFinderGame';

// New replacement games (Phase 7)
import HalalHaramGame from 'features/kids/components/games/HalalHaramGame';
import GoodMannersGame from 'features/kids/components/games/GoodMannersGame';

import NamesMeaningGame from 'features/kids/components/games/NamesMeaningGame';
import ProphetTimelineGame from 'features/kids/components/games/ProphetTimelineGame';
import CauseEffectGame from 'features/kids/components/games/CauseEffectGame';
import DuaMomentGame from 'features/kids/components/games/DuaMomentGame';
import LetterSoundGame from 'features/kids/components/games/LetterSoundGame';
import QuranEchoGame from 'features/kids/components/games/QuranEchoGame';

import { getGame } from 'features/kids/games/gameRegistry';
import type { EngineId } from 'features/kids/games/gameRegistry';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsGamePlayPage.module.css';

interface EngineProps {
  difficulty?: PlayDifficulty;
  tier?: 'easy' | 'medium' | 'hard';
}

const ENGINES: Record<EngineId, ComponentType<EngineProps>> = {
  match: MatchingGame,
  memory: MemoryFlipGame,
  pop: BalloonPopGame,
  spot: SpotGame,
  hunt: HuntGame,
  order: OrderGame,
  spell: SpellGame,
  countstars: CountStarsGame,
  truefalse: TrueFalseGame,
  lettercount: LetterCountGame,
  storyquiz: StoryQuizGame,
  wordfinder: WordFinderGame,
  // New replacement games
  halalharam: HalalHaramGame,
  goodmanners: GoodMannersGame,
  namesmeaning: NamesMeaningGame,
  prophettimeline: ProphetTimelineGame,
  causeeffect: CauseEffectGame,
  duamoment: DuaMomentGame,
  lettersound: LetterSoundGame,
  quranecho: QuranEchoGame,
};

type Tier = 'easy' | 'medium' | 'hard';

/** One generic route hosts every game; the registry picks the engine. */
export default function KidsGamePlayPage() {
  const { gameId, tier } = useParams<{ gameId: string; tier: Tier }>();
  const { t } = useTranslation();

  // Read tier from route params, default to 'easy'
  const validTier: Tier = tier && ['easy', 'medium', 'hard'].includes(tier) ? tier : 'easy';

  const spec = getGame(gameId ?? '');
  if (!spec) {
    return <EmptyState title={t('emptyState.kids.gameNotFound')} />;
  }

  const Engine = ENGINES[spec.engine];
  return (
    <div className={styles.page}>
      <Engine difficulty={validTier} tier={validTier} />
    </div>
  );
}