import { useState } from 'react';
import { Check, PartyPopper, X } from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Typography from 'components/ui/Typography';
import type { Surah } from 'types/quran.types';
import type { Ayah } from 'types/quran.types';
import { selectSurahQuizQuestions, type SurahQuizQuestion } from 'data/kids/surahQuiz';
import useTranslation from 'hooks/useTranslation';
import styles from './SurahQuiz.module.css';

interface SurahQuizProps {
  surah: Surah;
  verses: Ayah[];
  onComplete: (score: number, total: number) => void;
}

export default function SurahQuiz({ surah, verses, onComplete }: SurahQuizProps) {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<SurahQuizQuestion[]>(() => selectSurahQuizQuestions(surah, verses));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const question = questions[index];
  const finished = index >= questions.length;

  function choose(option: string): void {
    if (selected || !question) return;
    setSelected(option);
    if (option === question.correct) setCorrectAnswers((score) => score + 1);
    window.setTimeout(() => {
      setSelected(null);
      setIndex((current) => current + 1);
    }, 850);
  }

  function restart(): void {
    setQuestions(selectSurahQuizQuestions(surah, verses));
    setIndex(0);
    setSelected(null);
    setCorrectAnswers(0);
  }

  if (finished) {
    return (
      <Card elevation="raised" className={styles.result} role="status" aria-live="polite">
        <PartyPopper size={32} className={styles.resultIcon} />
        <Typography variant="h3" as="h2">{correctAnswers} / {questions.length}</Typography>
        <Typography variant="body">{t('kids.greatTry')}</Typography>
        <div className={styles.resultActions}>
          <Button variant="secondary" onClick={restart}>{t('kids.playAgain')}</Button>
          <Button variant="primary" onClick={() => onComplete(correctAnswers, questions.length)}>{t('kids.lessonComplete')}</Button>
        </div>
      </Card>
    );
  }

  if (!question) return null;

  return (
    <Card elevation="raised" className={styles.quiz}>
      <Typography variant="caption" muted>Quiz {index + 1} of {questions.length}</Typography>
      <Typography variant="h3" as="h2" className={styles.question}>{question.prompt}</Typography>
      <div className={styles.options}>
        {question.options.map((option) => {
          const isCorrect = option === question.correct;
          const isSelected = option === selected;
          return (
            <button key={option} type="button" className={[styles.option, selected && isCorrect && styles.correct, isSelected && !isCorrect && styles.incorrect].filter(Boolean).join(' ')} onClick={() => choose(option)} disabled={selected !== null}>
              <span>{option}</span>
              {selected && isCorrect && <Check size={20} aria-hidden="true" />}
              {isSelected && !isCorrect && <X size={20} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      {selected && <Typography variant="body" className={selected === question.correct ? styles.success : styles.encouragement} role="status">{selected === question.correct ? t('kids.correct') : `Almost! The answer is ${question.correct}.`}</Typography>}
    </Card>
  );
}
