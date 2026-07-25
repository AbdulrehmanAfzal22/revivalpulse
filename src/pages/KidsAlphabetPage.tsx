import { useMemo, useState } from 'react';
import { RotateCw } from 'lucide-react';
import Typography from 'components/ui/Typography';
import PillGroup from 'components/ui/PillGroup';
import Skeleton from 'components/ui/Skeleton';
import Button from 'components/ui/Button';
import EmptyState from 'components/feedback/EmptyState';
import useAlphabetLetters from 'features/kids/hooks/useAlphabetLetters';
import { useKidsProgressStore, getLearnedLetterIds } from 'stores/kidsProgressStore';
import LetterLearnGrid from 'features/kids/components/LetterLearnGrid';
import LetterFlashcards from 'features/kids/components/LetterFlashcards';
import QuizRunner from 'features/kids/components/QuizRunner';
import { generateAlphabetQuiz } from 'features/kids/services/kidsQuiz';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsAlphabetPage.module.css';

type Mode = 'learn' | 'flashcards' | 'quiz';

const QUIZ_LENGTH = 10;

export default function KidsAlphabetPage() {
  const [mode, setMode] = useState<Mode>('learn');
  const [quizKey, setQuizKey] = useState(0);
  const { t } = useTranslation();

  const MODES: { id: Mode; label: string }[] = [
    { id: 'learn', label: t('kids.modeLearn') },
    { id: 'flashcards', label: t('kids.modeFlashcards') },
    { id: 'quiz', label: t('kids.modeQuiz') },
  ];

  const { data: letters, isPending, isError, error, refetch, isFetching } = useAlphabetLetters();
  const records = useKidsProgressStore((state) => state.records);
  const markLetterLearned = useKidsProgressStore((state) => state.markLetterLearned);
  const recordQuizResult = useKidsProgressStore((state) => state.recordQuizResult);
  const learnedIds = getLearnedLetterIds(records);

  // quizKey is intentionally unused inside — bumping it (onRestart) is what forces a fresh shuffle.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const quizQuestions = useMemo(() => (letters ? generateAlphabetQuiz(letters, QUIZ_LENGTH) : []), [letters, quizKey]);

  return (
    <div className={styles.page}>
      <Typography variant="h2">{t('kids.arabicLetters')}</Typography>
      <PillGroup options={MODES} value={mode} onChange={(id) => setMode(id as Mode)} />

      {isPending && <Skeleton variant="rect" height="6rem" count={8} />}

      {isError && (
        <EmptyState
          title={t('emptyState.kids.lettersLoadFailed')}
          description={error.message}
          action={
            <Button variant="secondary" onClick={() => refetch()} disabled={isFetching} leadingIcon={<RotateCw size={16} />}>
              {t('common.retry')}
            </Button>
          }
        />
      )}

      {letters && mode === 'learn' && (
        <LetterLearnGrid letters={letters} learnedIds={learnedIds} onMarkLearned={markLetterLearned} />
      )}

      {letters && mode === 'flashcards' && <LetterFlashcards letters={letters} />}

      {letters && mode === 'quiz' && (
        <QuizRunner
          key={quizKey}
          questions={quizQuestions}
          onComplete={(score, total) => recordQuizResult('alphabet', score, total)}
          onRestart={() => setQuizKey((prev) => prev + 1)}
        />
      )}
    </div>
  );
}
