import { useState } from 'react';
import LetterCard from './LetterCard';
import LetterVerification from './LetterVerification';
import type { AlphabetLetter } from 'types/kids.types';
import styles from './LetterLearnGrid.module.css';

export interface LetterLearnGridProps {
  letters: AlphabetLetter[];
  learnedIds: string[];
  onMarkLearned: (letterId: string) => void;
}

export default function LetterLearnGrid({ letters, learnedIds, onMarkLearned }: LetterLearnGridProps) {
  const [verificationLetter, setVerificationLetter] = useState<AlphabetLetter | null>(null);

  return (
    <>
      <div className={styles.grid}>
        {letters.map((letter, index) => (
          <LetterCard
            key={letter.id}
            letter={letter}
            isLearned={learnedIds.includes(letter.id)}
            animationDelay={`${index * 60}ms`}
            onMarkLearned={() => setVerificationLetter(letter)}
          />
        ))}
      </div>
      {verificationLetter && (
        <LetterVerification
          letter={verificationLetter}
          letters={letters}
          onSuccess={() => {
            onMarkLearned(verificationLetter.id);
            setVerificationLetter(null);
          }}
          onClose={() => setVerificationLetter(null)}
        />
      )}
    </>
  );
}
