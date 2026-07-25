import LetterCard from './LetterCard';
import type { AlphabetLetter } from 'types/kids.types';
import styles from './LetterLearnGrid.module.css';

export interface LetterLearnGridProps {
  letters: AlphabetLetter[];
  learnedIds: string[];
  onMarkLearned: (letterId: string) => void;
}

export default function LetterLearnGrid({ letters, learnedIds, onMarkLearned }: LetterLearnGridProps) {
  return (
    <div className={styles.grid}>
      {letters.map((letter) => (
        <LetterCard
          key={letter.id}
          letter={letter}
          isLearned={learnedIds.includes(letter.id)}
          onMarkLearned={() => onMarkLearned(letter.id)}
        />
      ))}
    </div>
  );
}
