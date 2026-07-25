import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import Skeleton from 'components/ui/Skeleton';
import EmptyState from 'components/feedback/EmptyState';
import StoryIllustration from 'features/kids/components/StoryIllustration';
import useStoryVerses from 'features/kids/hooks/useStoryVerses';
import { useKidsProgressStore } from 'stores/kidsProgressStore';
import { ALL_KIDS_STORIES } from 'data/kids/stories';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsStoryPage.module.css';

export default function KidsStoryPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const story = ALL_KIDS_STORIES.find((item) => item.id === storyId);
  const markContentViewed = useKidsProgressStore((state) => state.markContentViewed);
  const { t } = useTranslation();

  const { verses, isPending, isError } = useStoryVerses(story?.verseRefs ?? []);

  useEffect(() => {
    if (story) markContentViewed('story', story.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id]);

  if (!story) {
    return <EmptyState title={t('emptyState.kids.storyNotFound')} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <StoryIllustration symbol={story.illustrationSymbol} color={story.accentColor} size={96} />
        <Typography variant="h2" as="h1" className={styles.arabicName} dir="rtl">
          {story.nameArabic}
        </Typography>
        <Typography variant="h3" as="p">
          {story.nameEnglish}
        </Typography>
      </div>

      <Card className={styles.summaryCard}>
        <Typography variant="body">{story.summary}</Typography>
      </Card>

      {story.verseRefs.length > 0 && (
        <div className={styles.versesSection}>
          <Typography variant="h4" as="h2">
            {t('kids.fromTheQuran')}
          </Typography>

          {isPending && <Skeleton variant="rect" height="6rem" count={story.verseRefs.length} />}
          {isError && <EmptyState title={t('emptyState.kids.storyVersesLoadFailed')} />}

          {verses.map((verse) => (
            <Card key={verse.verseKey} elevation="raised" className={styles.verseCard}>
              <Typography variant="h4" as="p" className={styles.verseArabic} dir="rtl">
                {verse.arabic}
              </Typography>
              <Typography variant="body">{verse.translation}</Typography>
              <Typography variant="caption" muted>
                {t('kids.quranVerseLabel', { verseKey: verse.verseKey })}
              </Typography>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
