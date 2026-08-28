import { Check } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Button from 'components/ui/Button';
import AudioPlayButton from 'components/ui/AudioPlayButton';
import type { AlphabetLetter } from 'types/kids.types';
import useTranslation from 'hooks/useTranslation';
import styles from './LetterCard.module.css';

export interface LetterCardProps {
  letter: AlphabetLetter;
  isLearned: boolean;
  animationDelay?: string;
  onMarkLearned: () => void;
}

export default function LetterCard({ letter, isLearned, animationDelay, onMarkLearned }: LetterCardProps) {
  const { t } = useTranslation();

  return (
    <Card elevation="raised" className={[styles.card, isLearned && styles.learned].filter(Boolean).join(' ')} style={{ animationDelay }}>
      <Typography variant="h1" as="p" className={styles.arabic} dir="rtl">
        {letter.arabic}
      </Typography>
      <Typography variant="body">{letter.transliteration}</Typography>
      <div className={styles.actions}>
        <AudioPlayButton src={letter.audioUrl} size="md" label={t('kids.playLetter', { letter: letter.transliteration })} />
        <Button
          variant={isLearned ? 'secondary' : 'primary'}
          size="sm"
          onClick={onMarkLearned}
          leadingIcon={isLearned ? <Check size={14} /> : undefined}
        >
          {isLearned ? t('kids.learned') : t('kids.markLearned')}
        </Button>
      </div>
    </Card>
  );
}
