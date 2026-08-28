import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import EmptyState from 'components/feedback/EmptyState';
import StoryIllustration from 'features/kids/components/StoryIllustration';
import StoryLanguageToggle from 'features/kids/components/StoryLanguageToggle';
import KidsBackButton from 'features/kids/components/KidsBackButton';
import { useKidsProgressStore } from 'stores/kidsProgressStore';
import { getKidsStoryV2 } from 'data/kids/storiesV2';
import { getSahabiV2 } from 'data/kids/sahabiV2';
import {
  buildKidsStoryChapterPath,
  buildKidsStoryChaptersPath,
  buildKidsSahabiChapterPath,
  buildKidsSahabiChaptersPath,
} from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import { localText, useStoryLanguage } from 'features/kids/hooks/useStoryLanguage';
import styles from './KidsStoryChapterPage.module.css';

function resolveStory(storyId: string) {
  return getKidsStoryV2(storyId) ?? getSahabiV2(storyId);
}

function isSahabi(storyType: string): boolean {
  return storyType === 'sahabi';
}

function StoryCheck({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const options = useMemo(() => ['Patience and trust in Allah', 'Giving up when life is hard', 'Being proud of ourselves'].sort(() => Math.random() - 0.5), []);
  const correct = selected === 'Patience and trust in Allah';

  return (
    <Card elevation="raised" className={styles.storyCheck}>
      <Typography variant="h3" as="h2">What did we learn?</Typography>
      <Typography variant="body">Choose the best lesson from this story.</Typography>
      <div className={styles.checkOptions}>
        {options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === 'Patience and trust in Allah';
          return (
            <button
              key={option}
              type="button"
              className={[styles.checkOption, selected && isCorrect && styles.checkCorrect, isSelected && !isCorrect && styles.checkWrong].filter(Boolean).join(' ')}
              onClick={() => {
                setSelected(option);
                if (isCorrect) window.setTimeout(onSuccess, 700);
              }}
              disabled={selected !== null}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected && !correct && (
        <button type="button" className={styles.tryAgain} onClick={() => setSelected(null)}>Try again</button>
      )}
      {selected && <span className={styles.checkFeedback} role="status">{correct ? t('kids.correct') : 'Almost! The best lesson is "Patience and trust in Allah."'}</span>}
    </Card>
  );
}

/** Visible fallback notice shown when Urdu isn't ready for a story yet. */
function UrduFallbackNotice() {
  const { t } = useTranslation();
  return (
    <div className={styles.urduNotice} role="status">
      {t('kids.urduComingSoon')}
    </div>
  );
}

/** Phase 3 — a single chapter detail page (Prophets and Sahabah share this). */
export default function KidsStoryChapterPage() {
  const { storyId, chapterId } = useParams<{ storyId: string; chapterId: string }>();
  const story = resolveStory(storyId ?? '');
  const { t } = useTranslation();
  const { language, setLanguage } = useStoryLanguage();
  const markContentViewed = useKidsProgressStore((state) => state.markContentViewed);
  const [completed, setCompleted] = useState(false);
  const storyMissingUrdu = story ? !story.chapters.some((c) => c.title.ur?.trim()) : false;

  if (!story) {
    return <EmptyState title={t('emptyState.kids.storyNotFound')} />;
  }

  const index = story.chapters.findIndex((chapter) => chapter.id === chapterId);
  const chapter = index >= 0 ? story.chapters[index] : undefined;
  const showUrduFallback = language === 'ur' && storyMissingUrdu;

  if (!chapter) {
    return <EmptyState title={t('emptyState.kids.storyNotFound')} />;
  }

  const previous = index > 0 ? story.chapters[index - 1] : undefined;
  const next = index < story.chapters.length - 1 ? story.chapters[index + 1] : undefined;
  const isFinalChapter = !next;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <StoryLanguageToggle language={language} onChange={setLanguage} />
        <KidsBackButton to={isSahabi(story.type) ? buildKidsSahabiChaptersPath(story.id) : buildKidsStoryChaptersPath(story.id)} />
      </div>

      <div className={styles.chapterRail} aria-label={t('kids.chapters')}>
        {story.chapters.map((item, chapterIndex) => (
          <Link key={item.id} to={isSahabi(story.type) ? buildKidsSahabiChapterPath(story.id, item.id) : buildKidsStoryChapterPath(story.id, item.id)} className={chapterIndex === index ? styles.chapterDotActive : styles.chapterDot} aria-label={`${t('kids.chapters')} ${chapterIndex + 1}`} />
        ))}
      </div>

      <div className={styles.header}>
        <StoryIllustration symbol={story.illustrationSymbol} color={story.accentColor} size={64} />
        <Typography variant="caption" muted>
          {t('kids.chapterDetail', { current: index + 1, total: story.chapters.length })}
        </Typography>
        <Typography variant="h3" as="h1" dir={language === 'ur' ? 'rtl' : undefined}>
          {localText(chapter.title, language)}
        </Typography>
      </div>

      {showUrduFallback && <UrduFallbackNotice />}

      {chapter.paragraphs.map((paragraph, paragraphIndex) => (
        <Card
          key={`${chapter.id}-${paragraphIndex}`}
          elevation="raised"
          className={styles.paragraphCard}
        >
          <Typography variant="body" as="p" dir={language === 'ur' ? 'rtl' : undefined}>
            {localText(paragraph, language)}
          </Typography>
        </Card>
      ))}

      {chapter.ayahNote && (
        <Card elevation="raised" className={styles.ayahNoteCard}>
          <div className={styles.ayahNoteTitle} dir={language === 'ur' ? 'rtl' : undefined}>
            {t('kids.ayahExplained')}
          </div>
          <Typography variant="body" as="p" dir={language === 'ur' ? 'rtl' : undefined}>
            {localText(chapter.ayahNote, language)}
          </Typography>
        </Card>
      )}

      {chapter.lesson && (
        <Card elevation="raised" className={styles.lessonCard}>
          <div className={styles.lessonTitle}>Lesson</div>
          <Typography variant="body" as="p" dir={language === 'ur' ? 'rtl' : undefined}>
            {localText(chapter.lesson, language)}
          </Typography>
        </Card>
      )}

      <div className={styles.sourcesSection}>
        <Typography variant="h4" as="h2">
          {t('kids.storySources')}
        </Typography>
        {chapter.sources.map((source) => (
          <Card key={`${source.type}-${source.reference}`} elevation="raised" className={styles.sourceCard}>
            <div className={styles.sourceLabel} dir={language === 'ur' ? 'rtl' : undefined}>
              {localText(source.label, language)}
            </div>
            <div className={styles.sourceMeta}>
              <span className={styles.sourceType}>
                {source.type === 'quran' ? t('kids.sourceQuran') : t('kids.sourceHadith')}
              </span>
              <span className={styles.sourceReference} dir="ltr">
                {source.reference}
              </span>
              {source.needsVerification && (
                <span className={styles.sourceWarning}>{t('kids.sourceNeedVerification')}</span>
              )}
              {source.reviewed && (
                <span className={styles.sourceReviewed}>
                  {t('kids.sourceReviewed', { by: source.reviewedBy ?? '', date: source.reviewedDate ?? '' })}
                </span>
              )}
            </div>
            {source.explanation && (
              <div className={styles.sourceExplanation} dir={language === 'ur' ? 'rtl' : undefined}>
                {localText(source.explanation, language)}
              </div>
            )}
          </Card>
        ))}
      </div>

      {isFinalChapter && !completed && <StoryCheck onSuccess={() => { markContentViewed('story', story.id); setCompleted(true); }} />}
      {completed && <Typography variant="body" className={styles.completedNote} role="status">Story complete! You earned a star.</Typography>}

      <div className={styles.pager}>
        {previous && (
          <Link
            to={
              isSahabi(story.type)
                ? buildKidsSahabiChapterPath(story.id, previous.id)
                : buildKidsStoryChapterPath(story.id, previous.id)
            }
            className={styles.pagerLink}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>{t('kids.readPreviousChapter')}</span>
          </Link>
        )}
        {next && (
          <Link
            to={
              isSahabi(story.type)
                ? buildKidsSahabiChapterPath(story.id, next.id)
                : buildKidsStoryChapterPath(story.id, next.id)
            }
            className={[styles.pagerLink, styles.pagerNext].filter(Boolean).join(' ')}
          >
            <span>{t('kids.readNextChapter')}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}