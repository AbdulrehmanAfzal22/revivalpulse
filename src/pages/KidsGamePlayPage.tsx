import type { ComponentType } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import EmptyState from 'components/feedback/EmptyState';
import MatchingGame from 'features/kids/components/games/MatchingGame';
import MemoryFlipGame from 'features/kids/components/games/MemoryFlipGame';
import BalloonPopGame from 'features/kids/components/games/BalloonPopGame';
import FallingCatchGame from 'features/kids/components/games/FallingCatchGame';
import WhackGame from 'features/kids/components/games/WhackGame';
import SpotGame from 'features/kids/components/games/SpotGame';
import HuntGame from 'features/kids/components/games/HuntGame';
import OrderGame from 'features/kids/components/games/OrderGame';
import BigSmallGame from 'features/kids/components/games/BigSmallGame';
import SpellGame from 'features/kids/components/games/SpellGame';
import WhatMissingGame from 'features/kids/components/games/WhatMissingGame';
import CountStarsGame from 'features/kids/components/games/CountStarsGame';
import TrueFalseGame from 'features/kids/components/games/TrueFalseGame';
import PatternRepeatGame from 'features/kids/components/games/PatternRepeatGame';
import NextInLineGame from 'features/kids/components/games/NextInLineGame';
import LetterCountGame from 'features/kids/components/games/LetterCountGame';
import MissingLetterGame from 'features/kids/components/games/MissingLetterGame';
import StoryQuizGame from 'features/kids/components/games/StoryQuizGame';
import MoreOrLessGame from 'features/kids/components/games/MoreOrLessGame';
import WordFinderGame from 'features/kids/components/games/WordFinderGame';
import { getGame } from 'features/kids/games/gameRegistry';
import type { EngineId } from 'features/kids/games/gameRegistry';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsGamePlayPage.module.css';

interface EngineProps {
  difficulty?: PlayDifficulty;
}

const ENGINES: Record<EngineId, ComponentType<EngineProps>> = {
  match: MatchingGame,
  memory: MemoryFlipGame,
  pop: BalloonPopGame,
  catch: FallingCatchGame,
  whack: WhackGame,
  spot: SpotGame,
  hunt: HuntGame,
  order: OrderGame,
  bigsmall: BigSmallGame,
  spell: SpellGame,
  whatsmissing: WhatMissingGame,
  countstars: CountStarsGame,
  truefalse: TrueFalseGame,
  pattern: PatternRepeatGame,
  nextinline: NextInLineGame,
  lettercount: LetterCountGame,
  missingletter: MissingLetterGame,
  storyquiz: StoryQuizGame,
  moreorless: MoreOrLessGame,
  wordfinder: WordFinderGame,
};

/** One generic route hosts every game; the registry picks the engine. */
export default function KidsGamePlayPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const location = useLocation();
  const { t } = useTranslation();
  const difficulty = ((location.state as { difficulty?: PlayDifficulty } | null)?.difficulty ?? 'easy') as PlayDifficulty;

  const spec = getGame(gameId ?? '');
  if (!spec) {
    return <EmptyState title={t('emptyState.kids.gameNotFound')} />;
  }

  const Engine = ENGINES[spec.engine];
  return (
    <div className={styles.page}>
      <Engine difficulty={difficulty} />
    </div>
  );
}