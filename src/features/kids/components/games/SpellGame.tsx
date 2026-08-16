import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { sample, shuffle } from 'features/kids/games/engineUtils';
import { KIDS_BUILDABLE_WORDS, KIDS_STUDY_LETTERS } from 'data/kids/gameContent';
import type { StudyItem } from 'data/kids/gameContent';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './SpellGame.module.css';

/** Build the Word: tap the right letters in order to spell an Arabic word. */
export const SPELL_GAME_ID = 'build-word';

const WORD_COUNT = 5;

interface Round {
  word: StudyItem;
  letters: string[];
  target: string[];
}

function makeRound(round: number, distractorCount: number): Round {
  const word = KIDS_BUILDABLE_WORDS[round % KIDS_BUILDABLE_WORDS.length] as StudyItem;
  const target = [...word.face];
  const inWord = new Set(target);
  const distractorFaces = sample(
    KIDS_STUDY_LETTERS.filter((letter) => !inWord.has(letter.face)),
    distractorCount,
  ).map((letter) => letter.face);
  return { word, letters: shuffle([...target, ...distractorFaces]), target };
}

export interface SpellGameProps {
  difficulty?: Tier;
}

export default function SpellGame({ difficulty = 'easy' }: SpellGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('spell', difficulty);
  const distractorCount = config.distractorCount as number;
  const [round, setRound] = useState(0);
  const [state, setState] = useState<Round>(() => makeRound(0, distractorCount));
  const [typed, setTyped] = useState(0);
  const [used, setUsed] = useState<number[]>([]);
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = typed >= state.target.length && round === WORD_COUNT - 1;

  const restart = () => {
    setRound(0);
    setState(makeRound(0, distractorCount));
    setTyped(0);
    setUsed([]);
    setBurst(null);
    setNudge(false);
  };

  const tapLetter = (index: number, x: number, y: number) => {
    if (won || used.includes(index)) return;
    const letter = state.letters[index] as string;
    if (letter !== state.target[typed]) {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
      return;
    }
    playCorrect();
    setUsed((prev) => [...prev, index]);
    setBurst({ key: Date.now(), x, y });
    setNudge(false);
    const nextTyped = typed + 1;
    setTyped(nextTyped);
    if (nextTyped >= state.target.length && round + 1 < WORD_COUNT) {
      setRound(round + 1);
      setState(makeRound(round + 1, distractorCount));
      setTyped(0);
      setUsed([]);
    }
  };

  const promptLabel = t('kids.gameSpellPrompt', { item: state.word.name });
  const progressLabel = t('kids.gameRoundProgress', {
    current: Math.min(round + 1, WORD_COUNT),
    total: WORD_COUNT,
  });

  return (
    <MiniGameShell
      gameId={SPELL_GAME_ID}
      title={t('kids.gameSpell')}
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

        <div className={styles.promptCard} role="status">
          <span className={styles.promptFace} dir="rtl">
            {state.word.face}
          </span>
          <span className={styles.promptName}>{promptLabel}</span>
        </div>

        <div className={styles.slots} aria-label={progressLabel}>
          {state.target.map((_, index) => (
            <span
              key={index}
              className={[styles.slot, index < typed && styles.slotFilled].filter(Boolean).join(' ')}
            >
              {index < typed && (
                <span className={styles.slotText} dir="rtl">
                  {state.target[index]}
                </span>
              )}
            </span>
          ))}
        </div>

        <div className={styles.pool}>
          {state.letters.map((letter, index) => {
            const isUsed = used.includes(index);
            return (
              <button
                key={`${letter}-${index}`}
                type="button"
                className={[styles.tile, isUsed && styles.tileUsed].filter(Boolean).join(' ')}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  tapLetter(index, rect.left + rect.width / 2, rect.top + rect.height / 2);
                }}
                aria-label={isUsed ? t('kids.gamePlaced') : letter}
              >
                <span className={styles.tileText} dir="rtl">
                  {letter}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </MiniGameShell>
  );
}