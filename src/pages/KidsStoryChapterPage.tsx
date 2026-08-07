import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import EmptyState from 'components/feedback/EmptyState';
import StoryIllustration from 'features/kids/components/StoryIllustration';
import StoryLanguageToggle from 'features/kids/components/StoryLanguageToggle';
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
  const storyMissingUrdu = story ? !story.chapters.some((c) => c.title.ur?.trim()) : false;

  useEffect(() => {
    if (story) markContentViewed('story', story.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id]);

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

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <StoryLanguageToggle language={language} onChange={setLanguage} />
        <Link
          to={isSahabi(story.type) ? buildKidsSahabiChaptersPath(story.id) : buildKidsStoryChaptersPath(story.id)}
          className={styles.backLink}
          aria-label={t('kids.chapterBackToStory')}
        >
          <ArrowLeft size={20} aria-hidden="true" />
          <span>{t('kids.chapters')}</span>
        </Link>
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