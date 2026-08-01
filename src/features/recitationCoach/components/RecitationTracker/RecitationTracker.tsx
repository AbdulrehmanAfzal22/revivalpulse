import { wordKey } from '../../services/wordTracker';
import type { WordTrackerState } from '../../services/wordTracker';
import { TAJWEED_RULE_COLORS } from '../../services/tajweedParser';
import type { TajweedWord } from '../../services/tajweedParser';
import useTranslation from 'hooks/useTranslation';
import styles from './RecitationTracker.module.css';

export interface RecitationTrackerProps {
  displayAyahs: string[][];
  /** Parsed tajweed segments per ayah, when loaded — ayahs missing here (still loading, failed to fetch, or word-count mismatch) fall back to plain uncolored text. */
  tajweedWordsByAyah: Map<number, TajweedWord[]> | null;
  tracker: WordTrackerState;
}

type WordState = 'pending' | 'current' | 'correct' | 'incorrect';

function wordState(tracker: WordTrackerState, ayahNumber: number, wordIndex: number): WordState {
  if (tracker.correctWords.has(wordKey(ayahNumber, wordIndex))) return 'correct';
  const isCursor = tracker.cursor.ayahNumber === ayahNumber && tracker.cursor.wordIndex === wordIndex;
  if (!isCursor) return 'pending';
  return tracker.hasMistakeAtCursor ? 'incorrect' : 'current';
}

/** Renders one word's text, colored by tajweed rule when available, plain otherwise. */
function WordText({ plainWord, tajweedWord }: { plainWord: string; tajweedWord: TajweedWord | undefined }) {
  if (!tajweedWord) return <>{plainWord}</>;
  return (
    <>
      {tajweedWord.segments.map((segment, i) =>
        segment.ruleClass ? (
          <span key={i} style={{ color: TAJWEED_RULE_COLORS[segment.ruleClass] }}>
            {segment.text}
          </span>
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </>
  );
}

/**
 * Shows only the ayah currently being recited — large, centered, one focus
 * at a time — rather than the whole surah at once. Completed ayahs simply
 * fall away as the cursor advances; there's no need to keep them on screen.
 */
export default function RecitationTracker({ displayAyahs, tajweedWordsByAyah, tracker }: RecitationTrackerProps) {
  const { t } = useTranslation();
  const ayahNumber = tracker.cursor.ayahNumber;
  const ayahWords = displayAyahs[ayahNumber - 1] ?? [];
  const tajweedAyahWords = tajweedWordsByAyah?.get(ayahNumber);

  return (
    <div className={styles.text} dir="rtl" lang="ar" key={ayahNumber}>
      {ayahWords.map((word, wordIndex) => {
        const key = wordKey(ayahNumber, wordIndex);
        const flaggedMadd = tracker.possiblyShortMadd.has(key);
        const state = wordState(tracker, ayahNumber, wordIndex);
        return (
          <span
            key={wordIndex}
            className={[styles.word, styles[state], flaggedMadd && styles.shortMadd].filter(Boolean).join(' ')}
            title={flaggedMadd ? t('recitationCoach.shortMaddHint') : undefined}
          >
            <WordText plainWord={word} tajweedWord={tajweedAyahWords?.[wordIndex]} />
          </span>
        );
      })}
    </div>
  );
}
