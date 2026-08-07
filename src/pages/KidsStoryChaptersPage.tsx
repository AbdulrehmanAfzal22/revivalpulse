import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
  buildKidsSahabiChapterPath,
} from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import { localText, useStoryLanguage } from 'features/kids/hooks/useStoryLanguage';
import styles from './KidsStoryChaptersPage.module.css';

function resolveStory(storyId: string) {
  return getKidsStoryV2(storyId) ?? getSahabiV2(storyId);
}

function buildChapterPath(storyType: string, storyId: string, chapterId: string): string {
  return storyType === 'sahabi'
    ? buildKidsSahabiChapterPath(storyId, chapterId)
    : buildKidsStoryChapterPath(storyId, chapterId);
}

/** Phase 3 — chapter list for a chapter-based story (Prophets and Sahabah share this page). */
export default function KidsStoryChaptersPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const story = resolveStory(storyId ?? '');
  const markContentViewed = useKidsProgressStore((state) => state.markContentViewed);
  const { t } = useTranslation();
  const { language, setLanguage } = useStoryLanguage();

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
          {localText({ en: story.nameEnglish }, language)}
        </Typography>
        <StoryLanguageToggle language={language} onChange={setLanguage} />
      </div>

      <Card elevation="raised" className={styles.summaryCard}>
        <Typography variant="body">{localText(story.summary, language)}</Typography>
      </Card>

      <Typography variant="h4" as="h2" className={styles.chaptersHeading}>
        {t('kids.chapters')}
      </Typography>

      <div className={styles.chapters}>
        {story.chapters.map((chapter) => (
          <Link
            key={chapter.id}
            to={buildChapterPath(story.type, story.id, chapter.id)}
            className={styles.chapterLink}
          >
            <Card elevation="raised" className={styles.chapterCard}>
              <Typography variant="body">{localText(chapter.title, language)}</Typography>
              <ChevronRight size={20} className={styles.chevron} aria-hidden="true" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}