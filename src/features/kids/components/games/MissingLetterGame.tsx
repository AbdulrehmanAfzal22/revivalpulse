import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { sample, shuffle } from 'features/kids/games/engineUtils';
import { KIDS_BUILDABLE_WORDS, KIDS_STUDY_LETTERS } from 'data/kids/gameContent';
import type { StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './MissingLetterGame.module.css';

/** Missing Letter: a word loses one letter — find it in the letter bank. */
export const MISSING_LETTER_GAME_ID = 'missing-letter';

const ROUNDS = 8;
const OPTION_COUNT = 4;

interface RoundState {
  word: StudyItem;
  letters: string[];
  hiddenIndex: number;
  hidden: string;
  options: string[];
}

function buildLetterOptions(hidden: string, bank: string[], optionCount: number): string[] {
  const decoys = sample(
    bank.filter((face) => face !== hidden),
    optionCount - 1,
  );
  const options = new Set<string>([hidden, ...decoys]);
  for (const face of bank) {
    if (options.size >= optionCount) break;
    options.add(face);
  }
  return shuffle([...options]);
}

function makeRound(round: number, difficulty: PlayDifficulty): RoundState {
  const word = KIDS_BUILDABLE_WORDS[round % KIDS_BUILDABLE_WORDS.length] as StudyItem;
  const letters = [...word.face];
  const hiddenIndex = Math.floor(Math.random() * letters.length);
  const hidden = letters[hiddenIndex] as string;
  const bank = KIDS_STUDY_LETTERS.map((letter) => letter.face);
  const optionCount = difficulty === 'medium' ? 6 : OPTION_COUNT;
  const options = buildLetterOptions(hidden, bank, optionCount);
  return { word, letters, hiddenIndex, hidden, options };
}

export interface MissingLetterGameProps {
  difficulty?: PlayDifficulty;
}

export default function MissingLetterGame({ difficulty = 'easy' }: MissingLetterGameProps) {
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

  const pick = (face: string, x: number, y: number) => {
    if (won) return;
    if (face === state.hidden) {
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
      gameId={MISSING_LETTER_GAME_ID}
      title={t('kids.gameMissingLetter')}
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
        <div className={styles.prompt}>{t('kids.gameMissingLetterPrompt')}</div>
        <div className={styles.wordRow} dir="rtl">
          {state.letters.map((letter, index) =>
            index === state.hiddenIndex ? (
              <span key={`${letter}-${index}`} className={styles.wordSlot}>
                ?
              </span>
            ) : (
              <span key={`${letter}-${index}`} className={styles.wordLetter} dir="rtl">
                {letter}
              </span>
            ),
          )}
        </div>
        <div className={styles.grid}>
          {state.options.map((face) => (
            <button
              key={face}
              type="button"
              className={styles.option}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                pick(face, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              aria-label={face}
            >
              <span className={styles.optionText} dir="rtl">
                {face}
              </span>
            </button>
          ))}
        </div>
      </div>
    </MiniGameShell>
  );
}