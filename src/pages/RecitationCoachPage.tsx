import { useState } from 'react';
import { RotateCcw, Settings, X } from 'lucide-react';
import Button from 'components/ui/Button';
import Drawer from 'components/ui/Drawer';
import RecitationTracker from 'features/recitationCoach/components/RecitationTracker';
import MicButton from 'features/recitationCoach/components/MicButton';
import CompletionScreen from 'features/recitationCoach/components/CompletionScreen';
import { useRecitationSession } from 'features/recitationCoach/hooks/useRecitationSession';
import { useCoachingEngine } from 'features/recitationCoach/hooks/useCoachingEngine';
import type { CoachingLevel } from 'features/recitationCoach/services/coachingEngine';
import { useTajweedAnalysis } from 'features/recitationCoach/hooks/useTajweedAnalysis';
import { TAJWEED_RULE_COLORS, TAJWEED_RULE_LABELS } from 'features/recitationCoach/services/tajweedParser';
import { useScoringEngine } from 'features/recitationCoach/hooks/useScoringEngine';
import { DEFAULT_SCORING_WEIGHTS, SCORE_DIMENSIONS } from 'features/recitationCoach/services/scoringEngine';
import type { DimensionScore, ReportDimension, ScoreDimension } from 'features/recitationCoach/services/scoringEngine';
import { useLearningProfile } from 'features/recitationCoach/hooks/useLearningProfile';
import { deriveLearningProfile, detectWeaknesses } from 'features/recitationCoach/services/learningProfileEngine';
import type { StrengthCategory, TrendDimension, WeaknessCategory } from 'features/recitationCoach/services/learningProfileEngine';
import { loadLearningStore } from 'features/recitationCoach/services/learningProfileStorage';
import { decideAdaptiveCoaching } from 'features/recitationCoach/services/adaptiveCoachingEngine';
import { useMemorization } from 'features/recitationCoach/hooks/useMemorization';
import { effectiveStatus } from 'features/recitationCoach/services/memorizationEngine';
import type { MemorizationStatus } from 'features/recitationCoach/services/memorizationEngine';
import { computeCurrentPracticeStreak } from 'features/recitationCoach/services/achievementEngine';
import type { AchievementId } from 'features/recitationCoach/services/achievementEngine';
import type { PracticeMode } from 'features/recitationCoach/services/practiceModes';
import type { TranslationKey } from 'i18n/types';
import { SURAHS } from 'data/quran/surahs';
import useInterfaceLanguage from 'hooks/useInterfaceLanguage';
import useTranslation from 'hooks/useTranslation';
import styles from './RecitationCoachPage.module.css';

const COACHING_LEVELS: CoachingLevel[] = ['beginner', 'intermediate', 'advanced'];

const TAJWEED_RULE_NAME_KEYS: Record<string, TranslationKey> = {
  madd: 'recitationCoach.tajweed.ruleName.madd',
  ghunnah: 'recitationCoach.tajweed.ruleName.ghunnah',
  qalqalah: 'recitationCoach.tajweed.ruleName.qalqalah',
  ikhfa: 'recitationCoach.tajweed.ruleName.ikhfa',
  idgham: 'recitationCoach.tajweed.ruleName.idgham',
  iqlab: 'recitationCoach.tajweed.ruleName.iqlab',
  izhar: 'recitationCoach.tajweed.ruleName.izhar',
  'lam-shamsiyyah': 'recitationCoach.tajweed.ruleName.lamShamsiyyah',
  'lam-qamariyyah': 'recitationCoach.tajweed.ruleName.lamQamariyyah',
};

const SCORE_DIMENSION_NAME_KEYS: Record<ReportDimension, TranslationKey> = {
  wordAccuracy: 'recitationCoach.scoring.dimension.wordAccuracy',
  pronunciation: 'recitationCoach.scoring.dimension.pronunciation',
  tajweed: 'recitationCoach.scoring.dimension.tajweed',
  fluency: 'recitationCoach.scoring.dimension.fluency',
  recovery: 'recitationCoach.scoring.dimension.recovery',
  consistency: 'recitationCoach.scoring.dimension.consistency',
  confidence: 'recitationCoach.scoring.dimension.confidence',
  overall: 'recitationCoach.scoring.dimension.overall',
};

/** Presentation-only grouping of already-computed dimension scores into "strengths"/"weaknesses" for the completion screen — no new scoring logic, just a display split. 'confidence' (meta-confidence about the system's own certainty) is excluded since it doesn't describe reciter performance. Dimensions the engine has too little evidence for yet are left out of both lists entirely, rather than presented as a false strength or weakness. */
function rankDimensionsForDisplay(dimensions: Record<ScoreDimension, DimensionScore>): {
  strengths: ScoreDimension[];
  weaknesses: ScoreDimension[];
} {
  const STRENGTH_THRESHOLD = 75;
  const WEAKNESS_THRESHOLD = 55;
  const MIN_CONFIDENCE = 20;

  const evaluable = SCORE_DIMENSIONS.filter((dimension) => dimension !== 'confidence' && dimensions[dimension].confidence >= MIN_CONFIDENCE);
  const strengths = evaluable
    .filter((dimension) => dimensions[dimension].score >= STRENGTH_THRESHOLD)
    .sort((a, b) => dimensions[b].score - dimensions[a].score)
    .slice(0, 3);
  const weaknesses = evaluable
    .filter((dimension) => dimensions[dimension].score < WEAKNESS_THRESHOLD)
    .sort((a, b) => dimensions[a].score - dimensions[b].score)
    .slice(0, 3);

  return { strengths, weaknesses };
}

const WEAKNESS_LABEL_KEYS: Record<WeaknessCategory, TranslationKey> = {
  'skips-words': 'recitationCoach.learning.weaknessLabel.skipsWords',
  'shortens-madd': 'recitationCoach.learning.weaknessLabel.shortensMadd',
  'ghunnah-mistakes': 'recitationCoach.learning.weaknessLabel.ghunnahMistakes',
  'similar-word-confusion': 'recitationCoach.learning.weaknessLabel.similarWordConfusion',
  'fluency-drop-long-ayahs': 'recitationCoach.learning.weaknessLabel.fluencyDropLongAyahs',
  'hesitation-after-mistakes': 'recitationCoach.learning.weaknessLabel.hesitationAfterMistakes',
};

const STRENGTH_LABEL_KEYS: Record<StrengthCategory, TranslationKey> = {
  'excellent-pronunciation': 'recitationCoach.learning.strengthLabel.excellentPronunciation',
  'strong-tajweed': 'recitationCoach.learning.strengthLabel.strongTajweed',
  'consistent-fluency': 'recitationCoach.learning.strengthLabel.consistentFluency',
  'fast-recovery': 'recitationCoach.learning.strengthLabel.fastRecovery',
  'high-confidence': 'recitationCoach.learning.strengthLabel.highConfidence',
};

const TREND_DIMENSION_NAME_KEYS: Record<TrendDimension, TranslationKey> = {
  wordAccuracy: 'recitationCoach.scoring.dimension.wordAccuracy',
  tajweed: 'recitationCoach.scoring.dimension.tajweed',
  fluency: 'recitationCoach.scoring.dimension.fluency',
  confidence: 'recitationCoach.scoring.dimension.confidence',
};

const TREND_DIRECTION_KEYS: Record<'improving' | 'declining' | 'stable', TranslationKey> = {
  improving: 'recitationCoach.learning.trendDirection.improving',
  declining: 'recitationCoach.learning.trendDirection.declining',
  stable: 'recitationCoach.learning.trendDirection.stable',
};

const MEMORIZATION_STATUS_LABEL_KEYS: Record<MemorizationStatus, TranslationKey> = {
  new: 'recitationCoach.memorization.status.new',
  learning: 'recitationCoach.memorization.status.learning',
  practicing: 'recitationCoach.memorization.status.practicing',
  memorized: 'recitationCoach.memorization.status.memorized',
  'needs-review': 'recitationCoach.memorization.status.needsReview',
  forgotten: 'recitationCoach.memorization.status.forgotten',
};

const PRACTICE_MODE_LABEL_KEYS: Record<PracticeMode, TranslationKey> = {
  'full-surah': 'recitationCoach.memorization.mode.fullSurah',
  'selected-ayah': 'recitationCoach.memorization.mode.selectedAyah',
  'weak-words': 'recitationCoach.memorization.mode.weakWords',
  'tajweed-practice': 'recitationCoach.memorization.mode.tajweedPractice',
  'mistake-review': 'recitationCoach.memorization.mode.mistakeReview',
  'revision-mode': 'recitationCoach.memorization.mode.revisionMode',
  'random-ayah-challenge': 'recitationCoach.memorization.mode.randomAyahChallenge',
  'timed-challenge': 'recitationCoach.memorization.mode.timedChallenge',
  'continuous-recitation': 'recitationCoach.memorization.mode.continuousRecitation',
};

const ACHIEVEMENT_LABEL_KEYS: Record<AchievementId, { name: TranslationKey; description: TranslationKey }> = {
  'first-perfect-ayah': {
    name: 'recitationCoach.memorization.achievement.firstPerfectAyah.name',
    description: 'recitationCoach.memorization.achievement.firstPerfectAyah.description',
  },
  'first-perfect-surah': {
    name: 'recitationCoach.memorization.achievement.firstPerfectSurah.name',
    description: 'recitationCoach.memorization.achievement.firstPerfectSurah.description',
  },
  'seven-day-streak': {
    name: 'recitationCoach.memorization.achievement.sevenDayStreak.name',
    description: 'recitationCoach.memorization.achievement.sevenDayStreak.description',
  },
  'hundred-ayahs-practiced': {
    name: 'recitationCoach.memorization.achievement.hundredAyahsPracticed.name',
    description: 'recitationCoach.memorization.achievement.hundredAyahsPracticed.description',
  },
  'zero-mistakes-session': {
    name: 'recitationCoach.memorization.achievement.zeroMistakesSession.name',
    description: 'recitationCoach.memorization.achievement.zeroMistakesSession.description',
  },
  'tajweed-master': {
    name: 'recitationCoach.memorization.achievement.tajweedMaster.name',
    description: 'recitationCoach.memorization.achievement.tajweedMaster.description',
  },
  'consistency-champion': {
    name: 'recitationCoach.memorization.achievement.consistencyChampion.name',
    description: 'recitationCoach.memorization.achievement.consistencyChampion.description',
  },
};

/** Reads whatever learning profile is already on-device (if any) once, at mount, purely to pick this session's *initial* coaching level — see Requirement 7's "modify coaching behavior based on history". The live useLearningProfile hook below recomputes the same decision on an ongoing basis for display; this lazy initializer just breaks what would otherwise be a circular dependency (useCoachingEngine needs a level before useLearningProfile can be wired up). The user's own level-switcher selection still fully overrides this for the rest of the session. */
function initialCoachingLevelFromHistory(): CoachingLevel {
  const store = loadLearningStore();
  const profile = deriveLearningProfile(store.totals);
  const weaknesses = detectWeaknesses(store.history);
  return decideAdaptiveCoaching(profile, weaknesses).recommendedLevel;
}

/** Fields carrying a raw identifier (a TajweedRuleId or a ScoreDimension) rather than display text — engine output deliberately never embeds a pre-resolved TranslationKey into params (see scoringEngine.ts's note), so every renderer of an engine-generated insight/recommendation/message resolves these through this one helper before interpolating. */
const TRANSLATABLE_PARAM_FIELDS = ['rule', 'skill', 'strongest', 'weakest'] as const;

export default function RecitationCoachPage() {
  const session = useRecitationSession();
  const { t } = useTranslation();
  const { interfaceLanguage } = useInterfaceLanguage();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [coachingLevel, setCoachingLevel] = useState<CoachingLevel>(initialCoachingLevelFromHistory);

  const resolveParams = (params?: Record<string, string>): Record<string, string> | undefined => {
    if (!params) return params;
    const resolved = { ...params };
    for (const field of TRANSLATABLE_PARAM_FIELDS) {
      const value = resolved[field];
      if (value === undefined) continue;
      const ruleKey = TAJWEED_RULE_NAME_KEYS[value];
      const dimensionKey = SCORE_DIMENSION_NAME_KEYS[value as ReportDimension];
      if (ruleKey) resolved[field] = t(ruleKey);
      else if (dimensionKey) resolved[field] = t(dimensionKey);
    }
    return resolved;
  };
  const coaching = useCoachingEngine(session, { level: coachingLevel });
  const tajweed = useTajweedAnalysis(session);
  const scoring = useScoringEngine(session, tajweed.ayahSummaries, tajweed.surahReport);
  const learning = useLearningProfile(scoring, coaching.debugInfo.recentEvents);
  const memorization = useMemorization(scoring, learning);

  const nowIso = new Date().toISOString();
  const ayahStatuses = memorization.ayahRecords.map((record) => effectiveStatus(record, nowIso));
  const ayahsNeedingReviewCount = ayahStatuses.filter((status) => status === 'needs-review' || status === 'forgotten').length;
  const distinctPracticedSurahIds = Array.from(new Set(learning.history.map((entry) => entry.surahId)));
  const surahMasteries = distinctPracticedSurahIds.map((surahId) => memorization.surahMasteryFor(surahId));
  const surahsMasteredCount = surahMasteries.filter((mastery) => mastery.status === 'memorized').length;
  const surahsLearningCount = surahMasteries.length - surahsMasteredCount;
  const currentPracticeStreak = computeCurrentPracticeStreak(learning.history);

  const isActive = session.phase !== 'idle' && session.phase !== 'model-error';
  const isCompleted = session.phase === 'locked' && session.tracker?.completed === true;
  const surah = session.detectedSurahId !== null ? SURAHS.find((item) => item.id === session.detectedSurahId) : undefined;

  const micStatus = session.phase === 'loading-model' ? 'loading' : isActive ? 'listening' : 'idle';
  const micLabel = isActive ? t('recitationCoach.stop') : t('recitationCoach.start');

  const handleMicClick = () => (isActive ? session.stop() : session.start());

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        {isActive ? (
          <>
            <span className={styles.iconButtonSpacer} />
            <div className={styles.topBarInfo}>
              <span className={styles.topBarSurah}>{surah ? surah.nameSimple : t('recitationCoach.title')}</span>
              {surah && session.tracker && !isCompleted && (
                <span className={styles.topBarProgress}>
                  {t('recitationCoach.progress', {
                    current: String(session.tracker.cursor.ayahNumber),
                    total: String(surah.versesCount),
                  })}
                </span>
              )}
            </div>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => setIsPanelOpen(true)}
              aria-label={t('recitationCoach.openSettings')}
            >
              <Settings size={18} />
            </button>
          </>
        ) : (
          <div className={styles.topBarInfo}>
            <span className={styles.topBarSurah}>{t('recitationCoach.title')}</span>
          </div>
        )}
      </div>

      <div className={styles.stage}>
        {session.phase === 'idle' && (
          <>
            <h1 className={styles.introTitle}>{t('recitationCoach.title')}</h1>
            <p className={styles.introDescription}>{t('recitationCoach.description')}</p>
          </>
        )}

        {session.phase === 'loading-model' && (
          <>
            <p className={styles.hint}>{t('recitationCoach.loadingModel')}</p>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${session.modelLoadProgress}%` }} />
            </div>
          </>
        )}

        {session.phase === 'model-error' && (
          <p className={styles.errorMessage}>{t('recitationCoach.error', { message: session.error ?? '' })}</p>
        )}

        {(session.phase === 'listening' || session.phase === 'detection-timeout') && (
          <p className={styles.hint} aria-live="polite">
            {session.awaitingDistinguishingWords
              ? t('recitationCoach.awaitingDistinguishingWords')
              : session.phase === 'detection-timeout'
                ? t('recitationCoach.detectionTimeout')
                : t('recitationCoach.listening')}
          </p>
        )}

        {session.phase === 'locked' &&
          session.displayAyahs &&
          session.tracker &&
          (isCompleted ? (
            <>
              <CompletionScreen
                surahNameArabic={surah?.nameArabic ?? ''}
                surahNameLatin={surah?.nameSimple ?? ''}
                ayahCount={surah?.versesCount ?? session.displayAyahs.length}
                tracker={session.tracker}
                onReciteAgain={() => session.start()}
                onNextSurah={() => session.start()}
              />
              {tajweed.surahReport && (
                <div className={styles.tajweedReport}>
                  <span className={styles.panelSectionTitle}>{t('recitationCoach.tajweedReportTitle')}</span>
                  <p className={styles.debugMatchLine}>
                    {t('recitationCoach.tajweedReportScore', { score: String(tajweed.surahReport.overallScore) })}
                  </p>
                  {tajweed.surahReport.strongestRules.length > 0 && (
                    <p className={styles.debugMatchLine}>
                      {t('recitationCoach.tajweedReportStrongest', {
                        rules: tajweed.surahReport.strongestRules.map((ruleId) => t(TAJWEED_RULE_NAME_KEYS[ruleId]!)).join(', '),
                      })}
                    </p>
                  )}
                  {tajweed.surahReport.weakestRules.length > 0 && (
                    <p className={styles.debugMatchLine}>
                      {t('recitationCoach.tajweedReportWeakest', {
                        rules: tajweed.surahReport.weakestRules.map((ruleId) => t(TAJWEED_RULE_NAME_KEYS[ruleId]!)).join(', '),
                      })}
                    </p>
                  )}
                  {tajweed.surahReport.mostFrequentIssue && (
                    <p className={styles.debugMatchLine}>
                      {t('recitationCoach.tajweedReportFrequentIssue', {
                        rule: t(TAJWEED_RULE_NAME_KEYS[tajweed.surahReport.mostFrequentIssue]!),
                      })}
                    </p>
                  )}
                </div>
              )}
              {scoring.report && (
                <div className={styles.scoreReport}>
                  <span className={styles.panelSectionTitle}>{t('recitationCoach.scoring.reportTitle')}</span>
                  <div className={styles.scoreOverall}>
                    <span className={styles.scoreOverallValue}>{scoring.report.overall.score}%</span>
                    <span className={styles.scoreOverallLabel}>{t(SCORE_DIMENSION_NAME_KEYS.overall)}</span>
                  </div>

                  <div className={styles.scoreCards}>
                    {SCORE_DIMENSIONS.map((dimension) => {
                      const dimensionScore = scoring.report!.dimensions[dimension];
                      return (
                        <div className={styles.scoreCard} key={dimension}>
                          <div className={styles.scoreCardHeader}>
                            <span className={styles.scoreCardLabel}>{t(SCORE_DIMENSION_NAME_KEYS[dimension])}</span>
                            <span className={styles.scoreCardValue}>{dimensionScore.score}%</span>
                          </div>
                          <div
                            className={styles.scoreBarTrack}
                            role="progressbar"
                            aria-label={t(SCORE_DIMENSION_NAME_KEYS[dimension])}
                            aria-valuenow={dimensionScore.score}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div className={styles.scoreBarFill} style={{ width: `${dimensionScore.score}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {(() => {
                    const { strengths, weaknesses } = rankDimensionsForDisplay(scoring.report.dimensions);
                    return (
                      <>
                        {strengths.length > 0 && (
                          <div className={styles.panelSection}>
                            <span className={styles.scoreListTitle}>{t('recitationCoach.scoring.strengthsTitle')}</span>
                            <ul className={styles.legendList}>
                              {strengths.map((dimension) => (
                                <li key={dimension} className={styles.debugMatchLine}>
                                  {t('recitationCoach.scoring.scoreCardLine', {
                                    dimension: t(SCORE_DIMENSION_NAME_KEYS[dimension]),
                                    score: String(scoring.report!.dimensions[dimension].score),
                                  })}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {weaknesses.length > 0 && (
                          <div className={styles.panelSection}>
                            <span className={styles.scoreListTitle}>{t('recitationCoach.scoring.weaknessesTitle')}</span>
                            <ul className={styles.legendList}>
                              {weaknesses.map((dimension) => (
                                <li key={dimension} className={styles.debugMatchLine}>
                                  {t('recitationCoach.scoring.scoreCardLine', {
                                    dimension: t(SCORE_DIMENSION_NAME_KEYS[dimension]),
                                    score: String(scoring.report!.dimensions[dimension].score),
                                  })}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    );
                  })()}

                  {scoring.report.insights.length > 0 && (
                    <div className={styles.panelSection}>
                      <span className={styles.scoreListTitle}>{t('recitationCoach.scoring.insightsTitle')}</span>
                      <ul className={styles.legendList}>
                        {scoring.report.insights.map((insight, i) => (
                          <li key={i} className={styles.debugMatchLine}>
                            {t(insight.textKey, resolveParams(insight.params))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={styles.panelSection}>
                    <span className={styles.scoreListTitle}>{t('recitationCoach.scoring.recommendationsTitle')}</span>
                    <ul className={styles.legendList}>
                      {scoring.report.recommendations.map((recommendation, i) => (
                        <li key={i} className={styles.debugMatchLine}>
                          {t(recommendation.textKey, resolveParams(recommendation.params))}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {learning.profile.totalSessions > 0 && (
                <div className={styles.scoreReport}>
                  <span className={styles.panelSectionTitle}>{t('recitationCoach.learning.profileTitle')}</span>
                  <p className={styles.debugMatchLine}>{t('recitationCoach.learning.profileSessions', { count: String(learning.profile.totalSessions) })}</p>
                  <p className={styles.debugMatchLine}>
                    {t('recitationCoach.learning.profilePracticeTime', { minutes: String(Math.round(learning.profile.totalPracticeTimeMs / 60000)) })}
                  </p>
                  <p className={styles.debugMatchLine}>{t('recitationCoach.learning.profileAyahs', { count: String(learning.profile.totalAyahsCompleted) })}</p>
                  <p className={styles.debugMatchLine}>{t('recitationCoach.learning.profileSurahs', { count: String(learning.profile.totalSurahsCompleted) })}</p>

                  {learning.motivationMessages.length > 0 && (
                    <div className={styles.panelSection}>
                      <span className={styles.scoreListTitle}>{t('recitationCoach.learning.motivationTitle')}</span>
                      <ul className={styles.legendList}>
                        {learning.motivationMessages.map((message, i) => (
                          <li key={i} className={styles.debugMatchLine}>
                            {t(message.textKey, resolveParams(message.params))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={styles.panelSection}>
                    <span className={styles.scoreListTitle}>{t('recitationCoach.learning.dailyPracticeTitle')}</span>
                    <ul className={styles.legendList}>
                      {learning.dailyPracticePlan.items.map((item, i) => (
                        <li key={i} className={styles.debugMatchLine}>
                          {t(item.textKey, resolveParams(item.params))}
                        </li>
                      ))}
                    </ul>
                    <p className={styles.debugMatchLine}>
                      {t('recitationCoach.learning.dailyPracticeTotalTime', { minutes: String(learning.dailyPracticePlan.totalPracticeTimeMinutes) })}
                    </p>
                  </div>

                  {learning.smartRecommendations.length > 0 && (
                    <div className={styles.panelSection}>
                      <span className={styles.scoreListTitle}>{t('recitationCoach.learning.smartRecommendationsTitle')}</span>
                      <ul className={styles.legendList}>
                        {learning.smartRecommendations.map((recommendation, i) => (
                          <li key={i} className={styles.debugMatchLine}>
                            {t(recommendation.textKey, resolveParams(recommendation.params))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {learning.learningInsights.length > 0 && (
                    <div className={styles.panelSection}>
                      <span className={styles.scoreListTitle}>{t('recitationCoach.learning.insightsTitle')}</span>
                      <ul className={styles.legendList}>
                        {learning.learningInsights.map((insight, i) => (
                          <li key={i} className={styles.debugMatchLine}>
                            {t(insight.textKey, resolveParams(insight.params))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {(memorization.ayahRecords.length > 0 || memorization.smartPracticeQueue.length > 0) && (
                <div className={styles.scoreReport}>
                  <span className={styles.panelSectionTitle}>{t('recitationCoach.memorization.dashboardTitle')}</span>
                  <p className={styles.debugMatchLine}>{t('recitationCoach.memorization.surahsMastered', { count: String(surahsMasteredCount) })}</p>
                  <p className={styles.debugMatchLine}>{t('recitationCoach.memorization.surahsLearning', { count: String(surahsLearningCount) })}</p>
                  <p className={styles.debugMatchLine}>
                    {t('recitationCoach.memorization.ayahsNeedingReview', { count: String(ayahsNeedingReviewCount) })}
                  </p>
                  <p className={styles.debugMatchLine}>
                    {t('recitationCoach.memorization.upcomingReviews', { count: String(memorization.dueReviews.length) })}
                  </p>
                  <p className={styles.debugMatchLine}>
                    {t('recitationCoach.memorization.learningStreak', { days: String(currentPracticeStreak) })}
                  </p>

                  <div className={styles.panelSection}>
                    <span className={styles.scoreListTitle}>{t('recitationCoach.memorization.dailyProgressTitle')}</span>
                    <p className={styles.debugMatchLine}>
                      {t('recitationCoach.memorization.dailyGoalLine', {
                        ayahs: String(memorization.dailyGoal.targetAyahs),
                        minutes: String(memorization.dailyGoal.targetMinutes),
                        reviews: String(memorization.dailyGoal.targetReviewCount),
                      })}
                    </p>
                    <p className={styles.debugMatchLine}>
                      {t('recitationCoach.memorization.dailyProgressLine', {
                        ayahs: String(memorization.dailyProgress.ayahsCompleted),
                        minutes: String(memorization.dailyProgress.minutesCompleted),
                        reviews: String(memorization.dailyProgress.reviewsCompleted),
                      })}
                    </p>
                  </div>

                  <div className={styles.panelSection}>
                    <span className={styles.scoreListTitle}>{t('recitationCoach.memorization.weeklyProgressTitle')}</span>
                    <p className={styles.debugMatchLine}>
                      {t('recitationCoach.memorization.weeklyGoalLine', {
                        fluency: String(memorization.weeklyGoal.targetFluencyScore),
                        mistakeReduction: String(memorization.weeklyGoal.targetMistakeReductionPercent),
                      })}
                    </p>
                    <p className={styles.debugMatchLine}>
                      {t('recitationCoach.memorization.weeklyProgressLine', {
                        fluency: String(memorization.weeklyProgress.currentFluencyScore),
                        mistakeChange: String(memorization.weeklyProgress.mistakeReductionAchievedPercent),
                      })}
                    </p>
                  </div>

                  {memorization.smartPracticeQueue.length > 0 && (
                    <div className={styles.panelSection}>
                      <span className={styles.scoreListTitle}>{t('recitationCoach.memorization.practiceQueueTitle')}</span>
                      <ul className={styles.legendList}>
                        {memorization.smartPracticeQueue.slice(0, 5).map((item, i) => (
                          <li key={i} className={styles.debugMatchLine}>
                            {t(item.textKey, resolveParams(item.params))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={styles.panelSection}>
                    <span className={styles.scoreListTitle}>{t('recitationCoach.memorization.recommendedSessionTitle')}</span>
                    <p className={styles.debugMatchLine}>
                      {t('recitationCoach.memorization.recommendedSessionMode', {
                        mode: t(PRACTICE_MODE_LABEL_KEYS[memorization.builtSession.modeConfig.mode]),
                        minutes: String(memorization.builtSession.estimatedMinutes),
                      })}
                    </p>
                    <p className={styles.debugMatchLine}>
                      {t(memorization.builtSession.rationaleKey, resolveParams(memorization.builtSession.rationaleParams))}
                    </p>
                  </div>

                  {memorization.unlockedAchievements.length > 0 && (
                    <div className={styles.panelSection}>
                      <span className={styles.scoreListTitle}>{t('recitationCoach.memorization.achievementsTitle')}</span>
                      <ul className={styles.legendList}>
                        {memorization.unlockedAchievements.map((id) => (
                          <li key={id} className={styles.debugMatchLine}>
                            {t(ACHIEVEMENT_LABEL_KEYS[id].name)} — {t(ACHIEVEMENT_LABEL_KEYS[id].description)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <RecitationTracker
                displayAyahs={session.displayAyahs}
                tajweedWordsByAyah={session.tajweedWordsByAyah}
                tracker={session.tracker}
              />
              {coaching.message && (
                <p
                  className={[styles.coachingMessage, styles[`coachingMessage_${coaching.message.tone}`]].join(' ')}
                  aria-live="polite"
                  key={coaching.message.textKey}
                >
                  {t(coaching.message.textKey)}
                </p>
              )}
            </>
          ))}
      </div>

      {!isCompleted && (
        <div className={styles.bottomBar}>
          <MicButton status={micStatus} onClick={handleMicClick} label={micLabel} />
          <span className={styles.bottomBarCaption}>
            {session.phase === 'idle' ? t('recitationCoach.start') : micLabel}
          </span>
        </div>
      )}

      <Drawer
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        side={interfaceLanguage.dir === 'rtl' ? 'left' : 'right'}
        titleId="recitation-coach-panel-title"
      >
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 id="recitation-coach-panel-title" className={styles.panelSectionTitleText}>
              {t('recitationCoach.sessionInfo')}
            </h2>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => setIsPanelOpen(false)}
              aria-label={t('common.close')}
            >
              <X size={18} />
            </button>
          </div>

          {session.device && (
            <span className={styles.deviceBadge}>
              {t('recitationCoach.runningOn', { device: session.device === 'webgpu' ? 'WebGPU' : 'WASM' })}
            </span>
          )}

          <Button variant="secondary" size="sm" onClick={() => session.start()} leadingIcon={<RotateCcw size={14} />}>
            {t('recitationCoach.restart')}
          </Button>

          <div className={styles.panelSection}>
            <span className={styles.panelSectionTitle} id="recitation-coach-level-label">
              {t('recitationCoach.coachingLevelTitle')}
            </span>
            <div className={styles.levelSwitcher} role="group" aria-labelledby="recitation-coach-level-label">
              {COACHING_LEVELS.map((levelOption) => (
                <Button
                  key={levelOption}
                  variant={coachingLevel === levelOption ? 'primary' : 'secondary'}
                  size="sm"
                  aria-pressed={coachingLevel === levelOption}
                  onClick={() => setCoachingLevel(levelOption)}
                >
                  {t(`recitationCoach.coachingLevel.${levelOption}`)}
                </Button>
              ))}
            </div>
          </div>

          {session.detectionDebug && (
            <div className={styles.panelSection}>
              <span className={styles.panelSectionTitle}>{t('recitationCoach.detectionDebugTitle')}</span>
              <p className={styles.debugMatchLine}>
                {t('recitationCoach.detectionDebugLine', {
                  best: String(session.detectionDebug.bestMatchLength),
                  required: String(session.detectionDebug.requiredLengthAtBest || 0),
                  surah:
                    session.detectionDebug.bestMatchSurahId !== null
                      ? (SURAHS.find((item) => item.id === session.detectionDebug?.bestMatchSurahId)?.nameSimple ?? '—')
                      : '—',
                })}
              </p>
            </div>
          )}

          {session.correctionDebug && session.correctionDebug.length > 0 && (
            <details className={styles.debugPanel}>
              <summary>{t('recitationCoach.correctionDebugTitle')}</summary>
              <ul className={styles.legendList}>
                {session.correctionDebug.map((correction, i) => (
                  <li key={i} className={styles.debugMatchLine}>
                    {t('recitationCoach.correctionDebugLine', {
                      original: correction.originalWord,
                      corrected: correction.correctedWord,
                      reason: correction.correctionReason,
                      confidence: String(correction.confidence),
                    })}
                  </li>
                ))}
              </ul>
            </details>
          )}

          <details className={styles.debugPanel}>
            <summary>{t('recitationCoach.coachingDebugTitle')}</summary>
            <p className={styles.debugMatchLine}>{t('recitationCoach.coachingDebugState', { state: coaching.coachingState })}</p>
            <p className={styles.debugMatchLine}>
              {t('recitationCoach.coachingDebugMistakeType', { type: coaching.lastMistakeType ?? '—' })}
            </p>
            <p className={styles.debugMatchLine}>
              {t('recitationCoach.coachingDebugMessage', { message: coaching.debugInfo.messageKey ? t(coaching.debugInfo.messageKey) : '—' })}
            </p>
            <p className={styles.debugMatchLine}>
              {t('recitationCoach.coachingDebugPause', { ms: String(Math.round(coaching.debugInfo.currentSilenceMs)) })}
            </p>
            <p className={styles.debugMatchLine}>
              {t('recitationCoach.coachingDebugConfidence', {
                confidence: session.lastWordEvent ? String(session.lastWordEvent.confidence) : '—',
              })}
            </p>
          </details>

          <details className={styles.debugPanel}>
            <summary>{t('recitationCoach.tajweedDebugTitle')}</summary>
            {tajweed.mostRecentAnalysis && tajweed.mostRecentAnalysis.evaluations.length > 0 ? (
              <ul className={styles.legendList}>
                {tajweed.mostRecentAnalysis.evaluations.map((ruleEvaluation) => (
                  <li key={ruleEvaluation.ruleId} className={styles.debugMatchLine}>
                    {t('recitationCoach.tajweedDebugRule', {
                      rule: t(TAJWEED_RULE_NAME_KEYS[ruleEvaluation.ruleId]!),
                      status: ruleEvaluation.status,
                      confidence: String(ruleEvaluation.confidence),
                      feedback: t(ruleEvaluation.feedbackKey),
                    })}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.debugMatchLine}>{t('recitationCoach.tajweedDebugNoAnalysis')}</p>
            )}
            <p className={styles.debugMatchLine}>
              {t('recitationCoach.tajweedDebugThresholds', {
                maddShort: String(tajweed.thresholds.madd.tooShortRatio),
                maddLong: String(tajweed.thresholds.madd.slightlyLongRatio),
                maddExcessive: String(tajweed.thresholds.madd.excessivelyLongRatio),
                ghunnahShort: String(tajweed.thresholds.ghunnah.tooShortRatio),
                ghunnahLong: String(tajweed.thresholds.ghunnah.tooLongRatio),
              })}
            </p>
          </details>

          <details className={styles.debugPanel}>
            <summary>{t('recitationCoach.scoring.debugTitle')}</summary>
            {scoring.report ? (
              <>
                <p className={styles.debugMatchLine}>{t('recitationCoach.scoring.debugFormula')}</p>
                <ul className={styles.legendList}>
                  {SCORE_DIMENSIONS.map((dimension) => (
                    <li key={dimension} className={styles.debugMatchLine}>
                      {t('recitationCoach.scoring.debugDimensionLine', {
                        dimension: t(SCORE_DIMENSION_NAME_KEYS[dimension]),
                        score: String(scoring.report!.dimensions[dimension].score),
                        confidence: String(scoring.report!.dimensions[dimension].confidence),
                        weight:
                          dimension === 'consistency'
                            ? '—'
                            : String(DEFAULT_SCORING_WEIGHTS[dimension as Exclude<ScoreDimension, 'consistency'>]),
                      })}
                    </li>
                  ))}
                </ul>
                <ul className={styles.legendList}>
                  {scoring.report.ayahAnalyses.map((ayah) => (
                    <li key={ayah.ayahNumber} className={styles.debugMatchLine}>
                      {t('recitationCoach.scoring.debugAyahLine', {
                        ayah: String(ayah.ayahNumber),
                        accuracy: String(ayah.accuracy),
                        tajweed: String(ayah.tajweedScore),
                        fluency: String(ayah.fluency),
                        mistakes: String(ayah.mistakes),
                      })}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className={styles.debugMatchLine}>{t('recitationCoach.scoring.debugNoReport')}</p>
            )}
          </details>

          <details className={styles.debugPanel}>
            <summary>{t('recitationCoach.learning.debugTitle')}</summary>
            {learning.profile.totalSessions > 0 ? (
              <>
                <p className={styles.debugMatchLine}>
                  {t('recitationCoach.learning.debugProfileLine', {
                    sessions: String(learning.profile.totalSessions),
                    accuracy: String(learning.profile.averageAccuracy),
                    tajweed: String(learning.profile.averageTajweedScore),
                    fluency: String(learning.profile.averageFluency),
                    confidence: String(learning.profile.averageConfidence),
                  })}
                </p>

                <ul className={styles.legendList}>
                  {(Object.entries(learning.trends) as Array<[TrendDimension, (typeof learning.trends)[TrendDimension]]>).map(
                    ([dimension, series]) => (
                      <li key={dimension} className={styles.debugMatchLine}>
                        {t('recitationCoach.learning.debugTrendLine', {
                          dimension: t(TREND_DIMENSION_NAME_KEYS[dimension]),
                          direction: t(TREND_DIRECTION_KEYS[series.direction]),
                          change: String(series.changeSinceFirst),
                        })}
                      </li>
                    )
                  )}
                </ul>

                {learning.weaknesses.length > 0 && (
                  <ul className={styles.legendList}>
                    {learning.weaknesses.map((weakness) => (
                      <li key={weakness.category} className={styles.debugMatchLine}>
                        {t('recitationCoach.learning.debugWeaknessLine', {
                          category: t(WEAKNESS_LABEL_KEYS[weakness.category]),
                          frequency: String(weakness.frequency),
                          severity: String(weakness.severity),
                          score: String(weakness.score),
                        })}
                      </li>
                    ))}
                  </ul>
                )}

                {learning.strengths.length > 0 && (
                  <ul className={styles.legendList}>
                    {learning.strengths.map((strength) => (
                      <li key={strength.category} className={styles.debugMatchLine}>
                        {t('recitationCoach.learning.debugStrengthLine', {
                          category: t(STRENGTH_LABEL_KEYS[strength.category]),
                          score: String(strength.averageScore),
                        })}
                      </li>
                    ))}
                  </ul>
                )}

                <p className={styles.debugMatchLine}>
                  {t('recitationCoach.learning.debugAdaptiveLine', {
                    level: t(`recitationCoach.coachingLevel.${learning.adaptiveDecision.recommendedLevel}`),
                    reason: t(learning.adaptiveDecision.reasonKey),
                  })}
                </p>
                {learning.adaptiveDecision.attentionTopics.length > 0 && (
                  <p className={styles.debugMatchLine}>
                    {t('recitationCoach.learning.debugAttentionTopics', {
                      topics: learning.adaptiveDecision.attentionTopics.map((topic) => t(WEAKNESS_LABEL_KEYS[topic])).join(', '),
                    })}
                  </p>
                )}

                {learning.smartRecommendations.length > 0 && (
                  <ul className={styles.legendList}>
                    {learning.smartRecommendations.map((recommendation, i) => (
                      <li key={i} className={styles.debugMatchLine}>
                        {t('recitationCoach.learning.debugPriorityLine', {
                          text: t(recommendation.textKey, resolveParams(recommendation.params)),
                          priority: String(recommendation.priority),
                        })}
                      </li>
                    ))}
                  </ul>
                )}

                {learning.practiceQueue.length > 0 && (
                  <ul className={styles.legendList}>
                    {learning.practiceQueue.map((item, i) => (
                      <li key={i} className={styles.debugMatchLine}>
                        {t('recitationCoach.learning.debugPriorityLine', {
                          text: t(item.textKey, resolveParams(item.params)),
                          priority: String(item.priority),
                        })}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className={styles.debugMatchLine}>{t('recitationCoach.learning.debugNoProfile')}</p>
            )}
          </details>

          <details className={styles.debugPanel}>
            <summary>{t('recitationCoach.memorization.debugTitle')}</summary>
            {memorization.ayahRecords.length > 0 || memorization.reviewSchedule.length > 0 ? (
              <>
                <ul className={styles.legendList}>
                  {memorization.ayahRecords.map((record) => (
                    <li key={`${record.surahId}:${record.ayahNumber}`} className={styles.debugMatchLine}>
                      {t('recitationCoach.memorization.debugMasteryLine', {
                        ayah: String(record.ayahNumber),
                        surahId: String(record.surahId),
                        status: t(MEMORIZATION_STATUS_LABEL_KEYS[effectiveStatus(record, nowIso)]),
                        mastery: String(record.masteryScore),
                        count: String(record.practiceCount),
                      })}
                    </li>
                  ))}
                </ul>
                <ul className={styles.legendList}>
                  {memorization.reviewSchedule.map((entry) => (
                    <li key={`${entry.surahId}:${entry.ayahNumber}`} className={styles.debugMatchLine}>
                      {t('recitationCoach.memorization.debugReviewLine', {
                        ayah: String(entry.ayahNumber),
                        surahId: String(entry.surahId),
                        dueDate: entry.dueDateIso.slice(0, 10),
                        interval: String(entry.intervalDays),
                        ease: entry.easeFactor.toFixed(2),
                      })}
                    </li>
                  ))}
                </ul>
                <p className={styles.debugMatchLine}>
                  {t('recitationCoach.memorization.debugGoalLine', {
                    ayahs: String(memorization.dailyGoal.targetAyahs),
                    minutes: String(memorization.dailyGoal.targetMinutes),
                    reviews: String(memorization.dailyGoal.targetReviewCount),
                  })}
                </p>
                <p className={styles.debugMatchLine}>
                  {t('recitationCoach.memorization.debugSessionBuilderLine', {
                    mode: t(PRACTICE_MODE_LABEL_KEYS[memorization.builtSession.modeConfig.mode]),
                    reason: t(memorization.builtSession.rationaleKey, resolveParams(memorization.builtSession.rationaleParams)),
                  })}
                </p>
                <ul className={styles.legendList}>
                  {memorization.smartPracticeQueue.map((item, i) => (
                    <li key={i} className={styles.debugMatchLine}>
                      {t('recitationCoach.learning.debugPriorityLine', {
                        text: t(item.textKey, resolveParams(item.params)),
                        priority: String(item.priority),
                      })}
                    </li>
                  ))}
                </ul>
                {memorization.unlockedAchievements.map((id) => (
                  <p key={id} className={styles.debugMatchLine}>
                    {t('recitationCoach.memorization.debugAchievementLine', { name: t(ACHIEVEMENT_LABEL_KEYS[id].name) })}
                  </p>
                ))}
              </>
            ) : (
              <p className={styles.debugMatchLine}>{t('recitationCoach.memorization.debugNoData')}</p>
            )}
          </details>

          <div className={styles.panelSection}>
            <span className={styles.panelSectionTitle}>{t('recitationCoach.tajweedLegendTitle')}</span>
            <ul className={styles.legendList}>
              {Object.entries(TAJWEED_RULE_LABELS).map(([ruleClass, label]) => (
                <li key={ruleClass} className={styles.legendItem}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: TAJWEED_RULE_COLORS[ruleClass] }} />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {session.recognizedWords.length > 0 && (
            <details className={styles.debugPanel}>
              <summary>{t('recitationCoach.debugTranscript')}</summary>
              <p dir="rtl" lang="ar">
                {session.recognizedWords.join(' ')}
              </p>
            </details>
          )}
        </div>
      </Drawer>
    </div>
  );
}
