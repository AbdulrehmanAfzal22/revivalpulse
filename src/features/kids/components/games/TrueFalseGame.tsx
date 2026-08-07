import { useState } from 'react';
import { Check, X } from 'lucide-react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { pickTarget, pickDecoys } from 'features/kids/games/engineUtils';
import { KIDS_STUDY_SETS } from 'data/kids/gameContent';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './TrueFalseGame.module.css';

/** True or False: read the name, decide whether the Arabic face matches. */
export const TRUE_FALSE_GAME_ID = 'true-false';

const ROUNDS = 8;

interface RoundState {
  statement: string;
  answer: boolean;
}

function sharedLetters(a: string, b: string): number {
  const aChars = new Set([...a]);
  return [...b].filter((char) => aChars.has(char)).length;
}

function pickConfusableDecoy(pack: KidsStudyTopic, item: StudyItem): StudyItem {
  const pool = KIDS_STUDY_SETS[pack];
  const candidates = pool.filter((candidate) => candidate.id !== item.id);
  candidates.sort(
    (a, b) =>
      sharedLetters(item.face, b.face) - sharedLetters(item.face, a.face),
  );
  return (candidates[0] ?? item) as StudyItem;
}

function makeRound(
  pack: KidsStudyTopic,
  round: number,
  difficulty: PlayDifficulty,
): RoundState {
  const item = pickTarget(pack, round);
  if (Math.random() < 0.5) {
    return { statement: `${item.name} is ${item.face}`, answer: true };
  }
  const decoy =
    difficulty === 'medium'
      ? pickConfusableDecoy(pack, item)
      : (pickDecoys(pack, item, 1)[0] as StudyItem);
  return { statement: `${item.name} is ${decoy.face}`, answer: false };
}

export interface TrueFalseGameProps {
  difficulty?: PlayDifficulty;
}

export default function TrueFalseGame({ difficulty = 'easy' }: TrueFalseGameProps) {
  const { t } = useTranslation();
  const [pack, setPack] = useState<KidsStudyTopic>('letters');
  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() => makeRound('letters', 0, difficulty));
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

  const answer = (chosen: boolean, x: number, y: number) => {
    if (won) return;
    if (chosen === state.answer) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      newRound(round + 1, pack);
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, ROUNDS), total: ROUNDS });

  return (
    <MiniGameShell
      gameId={TRUE_FALSE_GAME_ID}
      title={t('kids.gameTrueFalse')}
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
        <div className={styles.statement} role="status" dir="auto">
          {state.statement}
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.trueButton}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              answer(true, rect.left + rect.width / 2, rect.top + rect.height / 2);
            }}
            aria-label={t('kids.true')}
          >
            <Check size={30} strokeWidth={3} aria-hidden="true" />
            <span>{t('kids.true')}</span>
          </button>
          <button
            type="button"
            className={styles.falseButton}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              answer(false, rect.left + rect.width / 2, rect.top + rect.height / 2);
            }}
            aria-label={t('kids.false')}
          >
            <X size={30} strokeWidth={3} aria-hidden="true" />
            <span>{t('kids.false')}</span>
          </button>
        </div>
      </div>
    </MiniGameShell>
  );
}