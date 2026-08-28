import { useMemo, useState } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import AudioPlayButton from 'components/ui/AudioPlayButton';
import Button from 'components/ui/Button';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import type { AlphabetLetter } from 'types/kids.types';
import useTranslation from 'hooks/useTranslation';
import styles from './LetterVerification.module.css';

interface LetterVerificationProps {
  letter: AlphabetLetter;
  letters: AlphabetLetter[];
  onSuccess: () => void;
  onClose: () => void;
}

type QuestionType = 'letter' | 'name' | 'audio';

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function LetterVerification({ letter, letters, onSuccess, onClose }: LetterVerificationProps) {
  const { t } = useTranslation();
  const [questionType] = useState<QuestionType>(() => {
    const types: QuestionType[] = ['letter', 'name', 'audio'];
    return types[Math.floor(Math.random() * types.length)] as QuestionType;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const options = useMemo(() => {
    const targetIndex = letters.findIndex((item) => item.id === letter.id);
    const nearby = letters.filter((item, index) => item.id !== letter.id && Math.abs(index - targetIndex) <= 3);
    const rest = letters.filter((item) => item.id !== letter.id && !nearby.includes(item));
    return shuffle([letter, ...shuffle([...nearby, ...rest]).slice(0, 3)]);
  }, [letter, letters]);

  const isAnswered = selectedId !== null;
  const isCorrect = selectedId === letter.id;

  function selectOption(option: AlphabetLetter): void {
    if (isAnswered) return;
    setSelectedId(option.id);
    if (option.id === letter.id) window.setTimeout(onSuccess, 900);
  }

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="letter-check-title">
      <Card elevation="raised" className={[styles.card, isAnswered && !isCorrect ? styles.wrong : ''].filter(Boolean).join(' ')}>
        <button type="button" className={styles.close} onClick={onClose} aria-label={t('common.close')}>
          <X size={22} />
        </button>
        <Sparkles className={styles.sparkle} aria-hidden="true" />
        <Typography variant="h3" as="h2" id="letter-check-title">{t('kids.letterSoundPrompt')}</Typography>
        {questionType === 'audio' ? (
          <AudioPlayButton src={letter.audioUrl} size="lg" label={t('kids.playLetter', { letter: letter.transliteration })} />
        ) : (
          <Typography variant="h1" as="p" className={styles.prompt} dir="rtl">
            {questionType === 'name' ? letter.transliteration : letter.arabic}
          </Typography>
        )}
        <div className={styles.options}>
          {options.map((option) => {
            const isSelected = selectedId === option.id;
            const showCorrect = isAnswered && option.id === letter.id;
            return (
              <button
                key={option.id}
                type="button"
                className={[styles.option, showCorrect && styles.correct, isSelected && !showCorrect && styles.incorrect].filter(Boolean).join(' ')}
                onClick={() => selectOption(option)}
                disabled={isAnswered}
              >
                <span className={styles.optionLetter}>{questionType === 'name' ? option.arabic : option.transliteration}</span>
                {questionType !== 'name' && <span className={styles.optionName}>{option.transliteration}</span>}
                {showCorrect && <Check size={20} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
        {isAnswered && (
          <div className={styles.feedback}>
            <Typography variant="body" className={isCorrect ? styles.success : styles.encouragement} role="status" aria-live="polite">
              {isCorrect ? t('kids.correct') : t('kids.incorrectAnswer', { answer: letter.transliteration })}
            </Typography>
            {!isCorrect && <Button variant="secondary" size="sm" onClick={() => setSelectedId(null)}>{t('common.retry')}</Button>}
          </div>
        )}
      </Card>
    </div>
  );
}
