import { useState, useEffect, useRef, useCallback } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { shuffle } from 'features/kids/games/engineUtils';
import { getCauseEffectScenarios } from 'data/kids/causeEffect';
import type { CauseEffectScenario } from 'data/kids/causeEffect';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './CauseEffectGame.module.css';

/** Cause and Effect: Good Deeds — short scenario, pick the outcome that actually follows */
export const CAUSE_EFFECT_GAME_ID = 'cause-effect';

interface RoundState {
  scenario: CauseEffectScenario;
  options: CauseEffectScenario['options'];
}

function makeRound(scenario: CauseEffectScenario, optionCount: number): RoundState {
  const correctOption = scenario.options.find(o => o.isCorrect);
  if (!correctOption) throw new Error('No correct option found in scenario');
  const wrongOptions = scenario.options.filter(o => !o.isCorrect);
  const selectedWrong = shuffle(wrongOptions).slice(0, optionCount - 1);
  const options = shuffle([correctOption, ...selectedWrong]);
  return { scenario, options };
}

export interface CauseEffectGameProps {
  difficulty?: Tier;
  tier?: Tier;
}

export default function CauseEffectGame({ difficulty = 'easy', tier = 'easy' }: CauseEffectGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('causeeffect', tier) as {
    optionCount: number;
    roundsToWin: number;
    timeLimit: number;
    scoreMultiplier: number;
    showLesson: boolean;
  };
  const optionCount = config.optionCount;
  const roundsToWin = config.roundsToWin;
  const isTimed = config.timeLimit > 0;
  const showLesson = config.showLesson;

  // Scenarios are drawn from a shuffled deck without replacement so a session
  // never shows the same scenario twice (reshuffles only when the deck runs out).
  const pool = getCauseEffectScenarios(200, tier as 'easy' | 'medium' | 'hard');
  const deckRef = useRef<CauseEffectScenario[]>([]);

  const drawScenario = useCallback((): CauseEffectScenario => {
    if (deckRef.current.length === 0) {
      if (pool.length === 0) {
        throw new Error('No cause-effect scenarios available for the selected difficulty');
      }
      deckRef.current = shuffle(pool);
    }
    return deckRef.current.pop() as CauseEffectScenario;
  }, [pool]);

  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() =>
    makeRound(drawScenario(), optionCount)
  );
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [answered, setAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const won = round >= roundsToWin;
  const lost = isTimed && timeLeft <= 0 && !won;

  // Timer
  useEffect(() => {
    if (!isTimed || won || lost) return;
    const id = window.setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 100;
        if (next <= 0) {
          return 0;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [isTimed, won, lost]);

  const nextRound = () => {
    setRound(r => r + 1);
    setState(makeRound(drawScenario(), optionCount));
    setBurst(null);
    setNudge(false);
    setAnswered(false);
    setShowExplanation(false);
  };

  const restart = () => {
    setRound(0);
    setState(makeRound(drawScenario(), optionCount));
    setBurst(null);
    setNudge(false);
    setAnswered(false);
    setShowExplanation(false);
    if (isTimed) setTimeLeft(config.timeLimit);
  };

  const pick = (option: CauseEffectScenario['options'][0], x: number, y: number) => {
    if (won || lost || answered) return;
    setAnswered(true);

    if (option.isCorrect) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      if (showLesson) {
        setShowExplanation(true);
        setTimeout(nextRound, 2000);
      } else {
        setTimeout(nextRound, 800);
      }
    } else {
      playWrong();
      setNudge(true);
      setTimeout(() => {
        setNudge(false);
        setAnswered(false);
      }, 1000);
    }
  };

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, roundsToWin), total: roundsToWin });

  return (
    <MiniGameShell
      gameId={CAUSE_EFFECT_GAME_ID}
      title={t('kids.gameCauseEffect')}
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
        <div className={styles.scenarioCard} role="status">
          <div className={styles.situation}>{state.scenario.situation.en}</div>
        </div>
        <div className={styles.optionsGrid}>
          {state.options.map((option, index) => (
            <button
              key={option.id}
              type="button"
              className={styles.option}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                pick(option, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              disabled={won || lost || answered}
            >
              <span className={styles.optionNumber} aria-hidden="true">
                {index + 1}
              </span>
              <span className={styles.optionText}>{option.text.en}</span>
            </button>
          ))}
        </div>
        {showLesson && showExplanation && state.options.find(o => o.isCorrect) && (
          <div className={styles.explanation} role="status">
            <span className={styles.explanationLabel}>{t('kids.causeEffectLesson')}</span>
            <span>{state.options.find(o => o.isCorrect)!.explanation.en}</span>
          </div>
        )}
        {lost && <div className={styles.timeUp}>{t('kids.gameTimeUp')}</div>}
      </div>
    </MiniGameShell>
  );
}