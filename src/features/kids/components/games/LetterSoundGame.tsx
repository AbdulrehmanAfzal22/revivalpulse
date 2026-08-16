import { useState, useEffect, useCallback } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { shuffle } from 'features/kids/games/engineUtils';
import { LETTER_SOUND_ITEMS, getLetterSoundItems, getSimilarSoundDecoys, playLetterSound } from 'data/kids/letterSound';
import type { LetterSoundItem } from 'data/kids/letterSound';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong, playTap } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './LetterSoundGame.module.css';

/** Letter Sound Match: hear Arabic letter sound, tap matching letter */
export const LETTER_SOUND_GAME_ID = 'letter-sound';

interface RoundState {
  targetLetter: LetterSoundItem;
  options: LetterSoundItem[];
  soundPlayed: boolean;
}

function makeRound(
  pool: LetterSoundItem[],
  optionCount: number,
  includeSimilar: boolean,
  similarCount?: number
): RoundState {
  if (pool.length === 0) {
    throw new Error('No letter sound items available for the selected difficulty');
  }
  const targetLetter = pool[Math.floor(Math.random() * pool.length)] as LetterSoundItem;
  
  let decoys: LetterSoundItem[];
  if (includeSimilar) {
    decoys = getSimilarSoundDecoys(targetLetter, pool, optionCount - 1);
  } else {
    const otherLetters = pool.filter(l => l.id !== targetLetter.id);
    const shuffled = shuffle(otherLetters);
    decoys = shuffled.slice(0, optionCount - 1);
  }
  
  const options = shuffle([targetLetter, ...decoys]);
  
  return {
    targetLetter,
    options,
    soundPlayed: false,
  };
}

export interface LetterSoundGameProps {
  difficulty?: Tier;
  tier?: Tier;
}

export default function LetterSoundGame({ difficulty = 'easy', tier = 'easy' }: LetterSoundGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('lettersound', tier) as {
    optionCount: number;
    roundsToWin: number;
    timeLimit: number;
    scoreMultiplier: number;
    allowReplay: boolean;
    similarSounds: boolean;
  };
  const optionCount = config.optionCount;
  const roundsToWin = config.roundsToWin;
  const isTimed = config.timeLimit > 0;
  const allowReplay = config.allowReplay;
  const similarSounds = config.similarSounds;
  const similarCount = similarSounds
    ? optionCount === 5
      ? 3
      : optionCount === 6
        ? 4
        : 0 : 0

  const pool = getLetterSoundItems(50, similarSounds);

  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() => makeRound(pool, optionCount, similarSounds, similarCount));
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [timerActive, setTimerActive] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);

  const won = round >= roundsToWin;
  const lost = isTimed && timeLeft <= 0 && !won;

  // Timer
  useEffect(() => {
    if (!isTimed || won || lost) return;
    setTimerActive(true);
    const id = window.setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 100;
        if (next <= 0) {
          setTimerActive(false);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [isTimed, won, lost]);

  // Play sound when round starts
  useEffect(() => {
    if (won || lost) return;
    playLetterSound(state.targetLetter.soundKey);
    setSoundPlaying(true);
    setTimeout(() => setSoundPlaying(false), 1000);
    setState(prev => ({ ...prev, soundPlayed: true }));
  }, [round, state.targetLetter, won, lost]);

  const restart = () => {
    setRound(0);
    setState(makeRound(pool, optionCount, similarSounds, similarCount));
    setBurst(null);
    setNudge(false);
    if (isTimed) setTimeLeft(config.timeLimit);
  };

  const replaySound = useCallback(() => {
    if (won || lost) return;
    playTap();
    playLetterSound(state.targetLetter.soundKey);
    setSoundPlaying(true);
    setTimeout(() => setSoundPlaying(false), 1000);
  }, [state.targetLetter, won, lost]);

  const pick = (letter: LetterSoundItem, x: number, y: number) => {
    if (won || lost) return;
    if (letter.id === state.targetLetter.id) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      setTimeout(() => {
        setRound(r => r + 1);
        setState(makeRound(pool, optionCount, similarSounds, similarCount));
        setBurst(null);
        setNudge(false);
      }, 800);
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, roundsToWin), total: roundsToWin });

  return (
    <MiniGameShell
      gameId={LETTER_SOUND_GAME_ID}
      title={t('kids.gameLetterSound')}
      won={won}
      onRestart={restart}
      headerExtra={
        <>
          <span className={styles.attempts}>{progressLabel}</span>
          {isTimed && <span className={styles.timer} role="timer">{Math.ceil(timeLeft / 1000)}s</span>}
        </>
      }
    >
      <div className={styles.board}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        <div className={styles.soundCard} role="status">
          <button
            type="button"
            className={[
              styles.soundButton,
              soundPlaying && styles.soundPlaying
            ].filter(Boolean).join(' ')}
            onClick={replaySound}
            disabled={won || lost || soundPlaying}
            aria-label={t('kids.letterSoundReplay')}
          >
            <span className={styles.soundIcon} aria-hidden="true">
              {soundPlaying ? '🔊' : '🔈'}
            </span>
            <span className={styles.soundLabel}>
              {soundPlaying ? t('kids.letterSoundPlaying') : t('kids.letterSoundListen')}
            </span>
            {allowReplay && state.soundPlayed && (
              <span className={styles.replayHint}>{t('kids.letterSoundReplayHint')}</span>
            )}
          </button>
        </div>
        <div className={styles.prompt}>
          {t('kids.letterSoundPrompt')}
        </div>
        <div className={styles.optionsGrid}>
          {state.options.map((letter, index) => (
            <button
              key={letter.id}
              type="button"
              className={styles.option}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                pick(letter, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              disabled={won || lost}
            >
              <span className={styles.optionNumber} aria-hidden="true">
                {index + 1}
              </span>
              <span className={styles.optionLetter} dir="rtl" lang="ar">
                {letter.letter}
              </span>
              <span className={styles.optionName}>{letter.name}</span>
            </button>
          ))}
        </div>
        {lost && <div className={styles.timeUp}>{t('kids.gameTimeUp')}</div>}
      </div>
    </MiniGameShell>
  );
}