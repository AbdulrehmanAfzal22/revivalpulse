import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { pickDecoys, shuffle } from 'features/kids/games/engineUtils';
import { KIDS_STUDY_SETS } from 'data/kids/gameContent';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './NextInLineGame.module.css';

/** What Comes Next?: see the start of the sequence, tap the item that follows. */
export const NEXT_IN_LINE_GAME_ID = 'next-in-line';

const ROUNDS = 8;
const WINDOW = 3;
const OPTION_COUNT = 3;

interface RoundState {
  prefix: StudyItem[];
  answer: StudyItem;
  options: StudyItem[];
}

function makeRound(
  pack: KidsStudyTopic,
  round: number,
  difficulty: PlayDifficulty,
): RoundState {
  const pool = KIDS_STUDY_SETS[pack];
  const start = round % pool.length;
  const windowSize = difficulty === 'medium' ? 2 : WINDOW;
  const prefix = Array.from({ length: windowSize }, (_, i) => pool[(start + i) % pool.length] as StudyItem);
  const answerIndex = (start + windowSize) % pool.length;
  const answer = pool[answerIndex] as StudyItem;

  let decoys = pickDecoys(pack, answer, OPTION_COUNT - 1);
  if (difficulty === 'medium') {
    // Prefer items right next to the answer in the sequence — plausible
    // but wrong choices force the child to track the order, not match a look.
    const deck = KIDS_STUDY_SETS[pack];
    const near = [...new Set([1, 2, -1, -2, 3, -3])].map(
      (delta) => deck[(answerIndex + delta + deck.length) % deck.length] as StudyItem,
    );
    const nearDecoys = [...near].filter((item) => item.id !== answer.id);
    decoys = [...nearDecoys, ...decoys].slice(0, OPTION_COUNT - 1);
  }

  return { prefix, answer, options: shuffle([answer, ...decoys]) };
}

export interface NextInLineGameProps {
  difficulty?: PlayDifficulty;
}

export default function NextInLineGame({ difficulty = 'easy' }: NextInLineGameProps) {
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

  const pick = (item: StudyItem, x: number, y: number) => {
    if (won) return;
    if (item.id === state.answer.id) {
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
      gameId={NEXT_IN_LINE_GAME_ID}
      title={t('kids.gameNextInLine')}
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
        <div className={styles.prompt}>{t('kids.gameNextPrompt')}</div>
        <div className={styles.sequence}>
          {state.prefix.map((item) => (
            <span key={item.id} className={styles.sequenceTile} dir="rtl">
              {item.face}
            </span>
          ))}
          <span className={styles.sequenceSlot}>?</span>
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