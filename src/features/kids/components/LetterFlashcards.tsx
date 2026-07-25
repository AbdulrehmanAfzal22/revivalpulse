import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Button from 'components/ui/Button';
import AudioPlayButton from 'components/ui/AudioPlayButton';
import type { AlphabetLetter } from 'types/kids.types';
import useTranslation from 'hooks/useTranslation';
import styles from './LetterFlashcards.module.css';

export interface LetterFlashcardsProps {
  letters: AlphabetLetter[];
}

export default function LetterFlashcards({ letters }: LetterFlashcardsProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { t } = useTranslation();
  const letter = letters[index];

  function go(delta: number) {
    setFlipped(false);
    setIndex((prev) => (prev + delta + letters.length) % letters.length);
  }

  if (!letter) return null;

  return (
    <div className={styles.wrapper}>
      <Card
        elevation="raised"
        className={styles.card}
        role="button"
        tabIndex={0}
        onClick={() => setFlipped((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') setFlipped((prev) => !prev);
        }}
      >
        {flipped ? (
          <>
            <Typography variant="h2" as="p">
              {letter.transliteration}
            </Typography>
            <div onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
              <AudioPlayButton src={letter.audioUrl} size="lg" label={t('kids.playLetter', { letter: letter.transliteration })} />
            </div>
          </>
        ) : (
          <Typography variant="h1" as="p" className={styles.arabic} dir="rtl">
            {letter.arabic}
          </Typography>
        )}
        <Typography variant="caption" muted className={styles.hint}>
          {t('kids.tapToFlip')}
        </Typography>
      </Card>

      <div className={styles.controls}>
        <Button variant="icon" aria-label={t('kids.previousLetter')} onClick={() => go(-1)} leadingIcon={<ChevronLeft size={20} />} />
        <Typography variant="caption" muted>
          {index + 1} / {letters.length}
        </Typography>
        <Button variant="icon" aria-label={t('kids.nextLetter')} onClick={() => go(1)} leadingIcon={<ChevronRight size={20} />} />
      </div>
    </div>
  );
}
