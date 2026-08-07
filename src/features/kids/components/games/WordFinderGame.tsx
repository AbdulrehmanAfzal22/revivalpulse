import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { pickTarget, pickDecoys, shuffle } from 'features/kids/games/engineUtils';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './WordFinderGame.module.css';

/** Word Finder: read the English name, tap the Arabic word it means. */
export const WORD_FINDER_GAME_ID = 'word-finder';

const ROUNDS = 8;
const OPTION_COUNT = 4;
const MEDIUM_OPTION_COUNT = 6;

interface RoundState {
  target: StudyItem;
  options: StudyItem[];
}

function makeRound(
  pack: KidsStudyTopic,
  round: number,
  difficulty: PlayDifficulty,
): RoundState {
  const target = pickTarget(pack, round);
  const optionCount = difficulty === 'medium' ? MEDIUM_OPTION_COUNT : OPTION_COUNT;
  return {
    target,
    options: shuffle([target, ...pickDecoys(pack, target, optionCount - 1)]),
  };
}

export interface WordFinderGameProps {
  difficulty?: PlayDifficulty;
}

export default function WordFinderGame({ difficulty = 'easy' }: WordFinderGameProps) {
  const { t } = useTranslation();
  const [pack, setPack] = useState<KidsStudyTopic>('words');
  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() => makeRound('words', 0, difficulty));
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = round >= ROUNDS;

  const newRound = (nextRound: number, nextPack: KidsStudyTopic) => {
    setRound(nextRound);
    setState(makeRound(nextPack, nextRound, difficulty));
    setBurst(null);
    setNudge(false);
  };

  const restart = () => newRound(0, pack);

  const changePack = (next: KidsStudyTopic) => {
    if (next === pack) return;
    setPack(next);
    newRound(0, next);
  };

  const pick = (item: StudyItem, x: number, y: number) => {
    if (won) return;
    if (item.id === state.target.id) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      newRound(round + 1, pack);
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const promptLabel = t('kids.gameWordFinderPrompt', { item: state.target.name });
  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, ROUNDS), total: ROUNDS });

  return (
    <MiniGameShell
      gameId={WORD_FINDER_GAME_ID}
      title={t('kids.gameWordFinder')}
      won={won}
      onRestart={restart}
      headerExtra={<span className={styles.attempts}>{progressLabel}</span>}
    >
      <StudyTopicChips topic={pack} onChange={changePack} />

      <div className={styles.board}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        <div className={styles.prompt} role="status">
          {promptLabel}
        </div>
        <div className={styles.grid}>
          {state.options.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.option}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                pick(item, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              aria-label={item.name}
            >
              <span className={styles.optionText} dir="rtl">
                {item.face}
              </span>
            </button>
          ))}
        </div>
      </div>
    </MiniGameShell>
  );
}