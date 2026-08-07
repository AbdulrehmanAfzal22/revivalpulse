import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { shuffle } from 'features/kids/games/engineUtils';
import { KIDS_STUDY_WORDS } from 'data/kids/gameContent';
import type { StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './LetterCountGame.module.css';

/** How Many Letters?: count the Arabic letters in a word, tap the numeral. */
export const LETTER_COUNT_GAME_ID = 'letter-count';

const ROUNDS = 8;

interface RoundState {
  word: StudyItem;
  count: number;
  options: number[];
}

function makeRound(round: number, difficulty: PlayDifficulty): RoundState {
  const pool =
    difficulty === 'medium'
      ? KIDS_STUDY_WORDS.filter((item) => [...item.face].length >= 4)
      : KIDS_STUDY_WORDS;
  const word = (pool[round % pool.length] ?? KIDS_STUDY_WORDS[round % KIDS_STUDY_WORDS.length]) as StudyItem;
  const count = [...word.face].length;
  if (difficulty === 'medium') {
    const raw = [count - 2, count - 1, count, count + 1].map((n) => (n < 2 ? 2 : n));
    return { word, count, options: shuffle([...new Set(raw)]) };
  }
  const raw = [count - 1, count, count + 1].map((n) => (n < 2 ? n + 2 : n));
  return { word, count, options: shuffle([...new Set(raw)]) };
}

export interface LetterCountGameProps {
  difficulty?: PlayDifficulty;
}

function toArabicNumeral(n: number): string {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)] as string);
}

export default function LetterCountGame({ difficulty = 'easy' }: LetterCountGameProps) {
  const { t } = useTranslation();
  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() => makeRound(0, difficulty));
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = round >= ROUNDS;

  const restart = () => {
    setRound(0);
    setState(makeRound(0, difficulty));
    setBurst(null);
    setNudge(false);
  };

  const pick = (value: number, x: number, y: number) => {
    if (won) return;
    if (value === state.count) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      const nextRound = round + 1;
      setRound(nextRound);
      setState(makeRound(nextRound, difficulty));
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, ROUNDS), total: ROUNDS });

  return (
    <MiniGameShell
      gameId={LETTER_COUNT_GAME_ID}
      title={t('kids.gameLetterCount')}
      won={won}
      onRestart={restart}
      headerExtra={<span className={styles.attempts}>{progressLabel}</span>}
    >
      <div className={styles.board}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        <div className={styles.prompt}>{t('kids.gameLetterCountPrompt')}</div>
        <div className={styles.wordCard} dir="rtl">
          {state.word.face}
        </div>
        <div className={styles.grid}>
          {state.options.map((value) => (
            <button
              key={value}
              type="button"
              className={styles.option}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                pick(value, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              aria-label={String(value)}
            >
              <span className={styles.optionText} dir="rtl">
                {toArabicNumeral(value)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </MiniGameShell>
  );
}