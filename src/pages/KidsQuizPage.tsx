import { useEffect, useState } from 'react';
import { BookHeart, HandHeart, MoonStar, UserRound } from 'lucide-react';
import QuizEngine from 'components/quiz/QuizEngine';
import Typography from 'components/ui/Typography';
import BadgeUnlockModal from 'features/kids/components/rewards/BadgeUnlockModal';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import PlaySetup from 'features/kids/components/setup/PlaySetup';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import useReadAloud from 'features/kids/hooks/useReadAloud';
import useAnswerFeedback from 'features/kids/hooks/useAnswerFeedback';
import { QUIZ_CONTENT_REVIEWED, quizQuestionsByCategory } from 'data/kids/quizBank';
import { useKidsRewardsStore } from 'stores/useKidsRewardsStore';
import { useKidsProgressStore } from 'stores/kidsProgressStore';
import useTranslation from 'hooks/useTranslation';
import type { QuizResult } from 'types/quiz.types';
import type { BadgeId } from 'types/kids.types';
import styles from './KidsQuizPage.module.css';

const TOPICS = [
  { id: 'prophets', icon: UserRound, color: '#5c6bc0' },
  { id: 'salah-basics', icon: MoonStar, color: '#3e9e83' },
  { id: 'duas', icon: BookHeart, color: '#d1637a' },
  { id: 'adab', icon: HandHeart, color: '#8d6e63' },
] as const;

type TopicId = (typeof TOPICS)[number]['id'];

interface QuizConfig {
  topicId: TopicId;
  difficulty: PlayDifficulty;
}

/**
 * Kids Quiz — Phase 11 setup hub (illustrated topic tiles + Easy/Medium)
 * feeding the Phase 4 generic engine, with Phase 9 feedback moments
 * (chimes, sparkles, badge unlocks) and Phase 12 read-aloud.
 */
export default function KidsQuizPage() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const [newBadges, setNewBadges] = useState<BadgeId[]>([]);

  const recordQuizResult = useKidsProgressStore((state) => state.recordQuizResult);
  const recordQuizAnswer = useKidsRewardsStore((state) => state.recordQuizAnswer);

  const feedback = useAnswerFeedback();
  const readAloud = useReadAloud();

  // The "almost!" nudge is a beat of encouragement, not a sticker — auto-hide.
  useEffect(() => {
    if (!feedback.gentleNudge) return;
    const timeout = window.setTimeout(feedback.clearNudge, 2200);
    return () => window.clearTimeout(timeout);
  }, [feedback.gentleNudge, feedback.clearNudge]);

  const topicLabels: Record<TopicId, { title: string; description: string }> = {
    prophets: { title: t('kids.quizTopic.prophets'), description: t('kids.quizTopic.prophetsDesc') },
    'salah-basics': { title: t('kids.quizTopic.salah'), description: t('kids.quizTopic.salahDesc') },
    duas: { title: t('kids.quizTopic.duas'), description: t('kids.quizTopic.duasDesc') },
    adab: { title: t('kids.quizTopic.adab'), description: t('kids.quizTopic.adabDesc') },
  };

  if (!config) {
    return (
      <div className={styles.page}>
        <Typography variant="h1" as="h1">
          {t('kids.quizHubTitle')}
        </Typography>
        <PlaySetup
          kind="quiz"
          difficultyLabels={{ easy: t('kids.difficultyEasy'), medium: t('kids.difficultyMedium') }}
          labels={{ start: t('kids.startPlay'), difficulty: t('kids.difficulty') }}
          onStart={(topicId, difficulty) => {
            setConfig({ topicId: topicId as TopicId, difficulty });
            setSessionKey((key) => key + 1);
          }}
          topics={TOPICS.map((topic) => ({
            id: topic.id,
            title: topicLabels[topic.id].title,
            description: topicLabels[topic.id].description,
            icon: topic.icon,
            color: topic.color,
          }))}
        />
        {!QUIZ_CONTENT_REVIEWED && (
          <Typography variant="caption" muted className={styles.reviewNote} role="note">
            {t('kids.quizReviewNote')}
          </Typography>
        )}
      </div>
    );
  }

  const questions = quizQuestionsByCategory(config.topicId).filter(
    (question) => config.difficulty === 'medium' || question.difficulty === 'easy',
  );

  const handleFinish = (result: QuizResult) => {
    const before = useKidsRewardsStore.getState().unlockedBadges;
    recordQuizResult(`quiz-${config.topicId}`, result.score, result.total);
    // KidsProgressStore awardBadgeIfNew + rewards-store reconcile run on
    // recordQuizResult; diff the badge snapshot to surface brand-new ones.
    const after = useKidsRewardsStore.getState().unlockedBadges;
    const fresh = after.filter((id) => !before.includes(id));
    if (fresh.length > 0) setNewBadges(fresh);
  };

  return (
    <div className={styles.page}>
      <QuizEngine
        key={sessionKey}
        questions={questions}
        labels={{
          questionCounter: (current, total) => t('kids.questionProgress', { current, total }),
          next: t('kids.nextQuestion'),
          finish: t('kids.finish'),
          scoreLabel: (score, total) =>
            score === total ? t('kids.perfectScore') : t('kids.scoreLabel', { score, total }),
          playAgain: t('kids.playAgain'),
          readAloud: (text) => t('kids.readAloud', { text }),
        }}
        onAnswer={(answer, correct) => {
          recordQuizAnswer(correct);
          feedback.handleAnswer(correct, { x: 0, y: 0 });
          if (correct) setBurstKey((key) => key + 1);
        }}
        onReadAloud={readAloud.supported ? (text) => readAloud.speak(text) : undefined}
        onFinish={handleFinish}
      />

      {burstKey > 0 && <SparkleBurst burstKey={burstKey} x="50%" y="18%" />}
      {feedback.gentleNudge && (
        <div className={styles.nudge} role="status">
          {t('kids.gentleNudge')}
        </div>
      )}

      <BadgeUnlockModal
        badgeIds={newBadges}
        onClose={() => setNewBadges([])}
      />
    </div>
  );
}