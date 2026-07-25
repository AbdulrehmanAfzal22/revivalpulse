import { useState } from 'react';
import { LogIn } from 'lucide-react';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import EmptyState from 'components/feedback/EmptyState';
import SignInDialog from 'features/auth/components/SignInDialog';
import BadgeShowcase from 'features/kids/components/BadgeShowcase';
import useAuth from 'hooks/useAuth';
import {
  useKidsProgressStore,
  getCompletedLessonSurahIds,
  getEarnedBadgeIds,
  getLearnedLetterIds,
  getQuizResults,
  getStreak,
} from 'stores/kidsProgressStore';
import { useKidsPreferencesStore } from 'stores/kidsPreferencesStore';
import { BEGINNER_LESSONS } from 'data/kids/beginnerLessons';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsParentDashboardPage.module.css';

const TOTAL_LETTERS = 29;

const QUIZ_LABEL_KEYS: Record<string, 'kids.quizLabel.alphabet'> = {
  alphabet: 'kids.quizLabel.alphabet',
};

export default function KidsParentDashboardPage() {
  const { isAuthenticated } = useAuth();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { t } = useTranslation();

  function quizLabel(quizId: string): string {
    const labelKey = QUIZ_LABEL_KEYS[quizId];
    return labelKey ? t(labelKey) : quizId;
  }

  const records = useKidsProgressStore((state) => state.records);
  const dailyGoalTarget = useKidsPreferencesStore((state) => state.dailyGoalTarget);
  const setDailyGoalTarget = useKidsPreferencesStore((state) => state.setDailyGoalTarget);

  const learnedLetters = getLearnedLetterIds(records);
  const quizResults = getQuizResults(records);
  const badgeIds = getEarnedBadgeIds(records);
  const completedLessons = getCompletedLessonSurahIds(records);
  const streak = getStreak(records);

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <Typography variant="h2">{t('kids.parentDashboard')}</Typography>
        <EmptyState
          title={t('emptyState.kids.signInTitle')}
          description={t('emptyState.kids.signInDescription')}
          action={
            <Button variant="primary" onClick={() => setIsSignInOpen(true)} leadingIcon={<LogIn size={16} />}>
              {t('common.signIn')}
            </Button>
          }
        />
        <SignInDialog isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Typography variant="h2">{t('kids.parentDashboard')}</Typography>

      <div className={styles.statsGrid}>
        <Card elevation="raised" className={styles.statCard}>
          <Typography variant="h3" as="p">
            {learnedLetters.length} / {TOTAL_LETTERS}
          </Typography>
          <Typography variant="caption" muted>
            {t('kids.lettersLearned')}
          </Typography>
        </Card>
        <Card elevation="raised" className={styles.statCard}>
          <Typography variant="h3" as="p">
            {completedLessons.length} / {BEGINNER_LESSONS.length}
          </Typography>
          <Typography variant="caption" muted>
            {t('kids.lessonsCompleted')}
          </Typography>
        </Card>
        <Card elevation="raised" className={styles.statCard}>
          <Typography variant="h3" as="p">
            {streak}
          </Typography>
          <Typography variant="caption" muted>
            {t('kids.dayStreak')}
          </Typography>
        </Card>
        <Card elevation="raised" className={styles.statCard}>
          <Typography variant="h3" as="p">
            {badgeIds.length}
          </Typography>
          <Typography variant="caption" muted>
            {t('kids.badgesEarned')}
          </Typography>
        </Card>
      </div>

      <Card className={styles.goalCard}>
        <Typography variant="body">{t('kids.dailyGoal')}</Typography>
        <div className={styles.goalControls}>
          <Button variant="secondary" size="sm" onClick={() => setDailyGoalTarget(dailyGoalTarget - 1)} disabled={dailyGoalTarget <= 1}>
            −
          </Button>
          <Typography variant="body">{t('kids.activitiesPerDay', { count: dailyGoalTarget })}</Typography>
          <Button variant="secondary" size="sm" onClick={() => setDailyGoalTarget(dailyGoalTarget + 1)}>
            +
          </Button>
        </div>
      </Card>

      <div>
        <Typography variant="h4" as="h3" className={styles.sectionTitle}>
          {t('kids.badges')}
        </Typography>
        <BadgeShowcase earnedBadgeIds={badgeIds} />
      </div>

      <div>
        <Typography variant="h4" as="h3" className={styles.sectionTitle}>
          {t('kids.recentQuizResults')}
        </Typography>
        {quizResults.length === 0 ? (
          <EmptyState title={t('emptyState.kids.noQuizzes')} />
        ) : (
          <ul className={styles.quizList}>
            {[...quizResults]
              .slice(-10)
              .reverse()
              .map((result, index) => (
                <li key={index} className={styles.quizItem}>
                  <Typography variant="body">{quizLabel(result.quizId)}</Typography>
                  <Typography variant="body">
                    {result.score} / {result.total}
                  </Typography>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
