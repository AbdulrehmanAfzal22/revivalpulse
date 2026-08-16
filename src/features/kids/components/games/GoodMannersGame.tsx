import { useState, useEffect } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { shuffle } from 'features/kids/games/engineUtils';
import { MANNERS_SCENARIOS, getMannersScenarios } from 'data/kids/mannersScenarios';
import type { MannersScenario } from 'data/kids/mannersScenarios';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './GoodMannersGame.module.css';

/** Good Manners Scenario: short relatable situation, pick the Islamically good response */
export const GOOD_MANNERS_GAME_ID = 'good-manners';

interface RoundState {
  scenario: MannersScenario;
  options: MannersScenario['options'];
}

function makeRound(scenarios: MannersScenario[], optionCount: number): RoundState {
  if (scenarios.length === 0) {
    throw new Error('No manners scenarios available for the selected difficulty');
  }
  // TypeScript doesn't narrow after throw, so we assert non-empty
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)] as MannersScenario;
  const correctOption = scenario.options.find(o => o.isCorrect);
  if (!correctOption) throw new Error('No correct option found in scenario');
  const wrongOptions = scenario.options.filter(o => !o.isCorrect);
  const selectedWrong = shuffle(wrongOptions).slice(0, optionCount - 1);
  const options = shuffle([correctOption, ...selectedWrong]);
  return { scenario, options };
}

export interface GoodMannersGameProps {
  difficulty?: Tier;
  tier?: Tier;
}

export default function GoodMannersGame({ difficulty = 'easy', tier = 'easy' }: GoodMannersGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('goodmanners', tier) as {
    optionCount: number;
    roundsToWin: number;
    timeLimit: number;
    scoreMultiplier: number;
    showHadithRef: boolean;
  };
  const optionCount = config.optionCount;
  const roundsToWin = config.roundsToWin;
  const isTimed = config.timeLimit > 0;
  const showHadithRef = config.showHadithRef;

  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() =>
    makeRound(getMannersScenarios(50, tier as 'easy' | 'medium' | 'hard'), optionCount)
  );
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [timerActive, setTimerActive] = useState(false);
  const [answered, setAnswered] = useState(false);

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

  const restart = () => {
    setRound(0);
    setState(makeRound(getMannersScenarios(50, tier as 'easy' | 'medium' | 'hard'), optionCount));
    setBurst(null);
    setNudge(false);
    setAnswered(false);
    if (isTimed) setTimeLeft(config.timeLimit);
  };

  const pick = (option: MannersScenario['options'][0], x: number, y: number) => {
    if (won || lost || answered) return;
    setAnswered(true);

    if (option.isCorrect) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      setTimeout(() => {
        setRound(r => r + 1);
        setState(makeRound(getMannersScenarios(50, tier as 'easy' | 'medium' | 'hard'), optionCount));
        setBurst(null);
        setNudge(false);
        setAnswered(false);
      }, 800);
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
      gameId={GOOD_MANNERS_GAME_ID}
      title={t('kids.gameGoodManners')}
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
          {showHadithRef && (
            <div className={styles.hadithRef}>
              {t('kids.mannersHadithRef')}
            </div>
          )}
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
        {lost && <div className={styles.timeUp}>{t('kids.gameTimeUp')}</div>}
      </div>
    </MiniGameShell>
  );
}