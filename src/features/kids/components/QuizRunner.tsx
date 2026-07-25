import { useState } from 'react';
import { Check, PartyPopper, X } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Button from 'components/ui/Button';
import type { QuizQuestion } from 'types/kids.types';
import useTranslation from 'hooks/useTranslation';
import styles from './QuizRunner.module.css';

export interface QuizRunnerProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
  onRestart: () => void;
}

export default function QuizRunner({ questions, onComplete, onRestart }: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const { t } = useTranslation();

  const question = questions[index];

  function handleSelect(optionIndex: number) {
    if (selected !== null || !question) return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === question.correctIndex;
    const nextScore = isCorrect ? score + 1 : score;
    setScore(nextScore);

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex((prev) => prev + 1);
        setSelected(null);
      } else {
        setFinished(true);
        onComplete(nextScore, questions.length);
      }
    }, 700);
  }

  if (finished) {
    return (
      <Card elevation="raised" className={styles.result} role="status" aria-live="polite">
        <PartyPopper size={32} className={styles.resultIcon} />
        <Typography variant="h3" as="p">
          {score} / {questions.length}
        </Typography>
        <Typography variant="body" muted>
          {score === questions.length ? t('kids.perfectScore') : t('kids.greatTry')}
        </Typography>
        <Button variant="primary" onClick={onRestart}>
          {t('kids.playAgain')}
        </Button>
      </Card>
    );
  }

  if (!question) return null;

  return (
    <Card elevation="raised" className={styles.quizCard}>
      <Typography variant="caption" muted>
        {t('kids.questionProgress', { current: index + 1, total: questions.length })}
      </Typography>
      <Typography variant="h1" as="p" className={styles.prompt} dir="rtl">
        {question.prompt}
      </Typography>

      <div className={styles.options}>
        {question.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          const isCorrectOption = optionIndex === question.correctIndex;
          const showFeedback = selected !== null;

          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(optionIndex)}
              disabled={selected !== null}
              className={[
                styles.option,
                showFeedback && isCorrectOption && styles.optionCorrect,
                showFeedback && isSelected && !isCorrectOption && styles.optionWrong,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {option}
              {showFeedback && isCorrectOption && <Check size={16} />}
              {showFeedback && isSelected && !isCorrectOption && <X size={16} />}
            </button>
          );
        })}
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {selected !== null &&
          (selected === question.correctIndex
            ? t('kids.correct')
            : t('kids.incorrectAnswer', { answer: question.options[question.correctIndex] ?? '' }))}
      </span>
    </Card>
  );
}
