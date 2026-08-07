import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Play } from 'lucide-react';
import Button from 'components/ui/Button';
import KidsBackButton from 'features/kids/components/KidsBackButton';
import { ROUTES } from 'constants/routes';
import styles from './PlaySetup.module.css';

export type PlayDifficulty = 'easy' | 'medium';

export interface PlaySetupTopic {
  id: string;
  title: string;
  description: string;
  /** Illustration shown in the tile — KIDS_ASSETS background photo, or an icon. */
  image?: string;
  /** CSS gradient used as the tile background (fun color wash when no photo). */
  background?: string;
  icon?: LucideIcon;
  color?: string;
}

export interface PlaySetupProps {
  kind: 'quiz' | 'game';
  /** Illustrated, selectable activity cards. */
  topics: PlaySetupTopic[];
  /** Translated difficulty labels. */
  difficultyLabels: { easy: string; medium: string };
  /** Translated start button + heading. */
  labels: { start: string; difficulty: string };
  defaultDifficulty?: PlayDifficulty;
  onStart: (topicId: string, difficulty: PlayDifficulty) => void;
}

/**
 * Phase 11 — "what do you want to play?" selection hub.
 *
 * A single component serves BOTH the quiz setup (topics = categories, e.g.
 * Prophets / Salah / Duas / Adab) and the games hub (topics = Matching /
 * Memory). Illustrated tiles use the bundled photo assets; the difficulty
 * toggle is the gentle Easy / Medium choice. Selection is purely visual until
 * the big Start button is tapped.
 */
export default function PlaySetup({
  kind,
  topics,
  difficultyLabels,
  labels,
  defaultDifficulty = 'easy',
  onStart,
}: PlaySetupProps) {
  const [topicId, setTopicId] = useState<string | null>(topics[0]?.id ?? null);
  const [difficulty, setDifficulty] = useState<PlayDifficulty>(defaultDifficulty);

  const start = () => {
    if (topicId) onStart(topicId, difficulty);
  };

  return (
    <section className={styles.setup} aria-label={labels.difficulty}>
      <div className={styles.backRow}>
        <KidsBackButton to={ROUTES.KIDS} />
      </div>
      <div className={styles.tiles}>
        {topics.map((topic) => {
          const selected = topic.id === topicId;
          const Icon = topic.icon;
          return (
            <button
              key={topic.id}
              type="button"
              className={[styles.tile, selected && styles.tileSelected].filter(Boolean).join(' ')}
              onClick={() => setTopicId(topic.id)}
              aria-pressed={selected}
              style={{
                borderColor: selected ? topic.color ?? undefined : undefined,
                background: topic.background && !topic.image ? topic.background : undefined,
              }}
            >
              {topic.image ? (
                <img src={topic.image} alt="" className={styles.tileImage} />
              ) : (
                Icon && (
                  <span
                    className={[
                      styles.tileIconWrap,
                      topic.background && styles.tileIconSoft,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <Icon size={30} color={topic.color ?? 'currentColor'} aria-hidden="true" />
                  </span>
                )
              )}
              <span className={styles.tileText}>
                <span className={styles.tileTitle}>{topic.title}</span>
                <span className={styles.tileDescription}>{topic.description}</span>
              </span>
              <span className={styles.tileCheck} aria-hidden="true">
                ✓
              </span>
            </button>
          );
        })}
      </div>

      <fieldset className={styles.difficulty}>
        <legend className={styles.difficultyLabel}>{labels.difficulty}</legend>
        <div className={styles.difficultyOptions}>
          {(['easy', 'medium'] as const).map((level) => (
            <button
              key={level}
              type="button"
              className={[styles.difficultyButton, difficulty === level && styles.difficultyActive]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setDifficulty(level)}
              aria-pressed={difficulty === level}
            >
              {difficultyLabels[level]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.startRow}>
        <Button
          variant="primary"
          onClick={start}
          disabled={!topicId}
          leadingIcon={<Play size={20} />}
          className={styles.startButton}
        >
          {labels.start}
        </Button>
      </div>
    </section>
  );
}
