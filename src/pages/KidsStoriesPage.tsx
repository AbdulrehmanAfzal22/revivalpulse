import { Link } from 'react-router-dom';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import StoryIllustration from 'features/kids/components/StoryIllustration';
import KidsBackButton from 'features/kids/components/KidsBackButton';
import { PROPHET_STORIES } from 'data/kids/stories';
import { getKidsStoryV2 } from 'data/kids/storiesV2';
import { ROUTES, buildKidsStoryChaptersPath, buildKidsStoryPath } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import { ProphetName } from 'features/kids/components/ProphetName';
import styles from './KidsStoriesPage.module.css';

function storyLink(storyId: string): string {
  // Phase 3+ — chapter-based stories link to their chapter list; everything
  // else keeps the legacy flat story page until it is migrated.
  return getKidsStoryV2(storyId)
    ? buildKidsStoryChaptersPath(storyId)
    : buildKidsStoryPath(storyId);
}

export default function KidsStoriesPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <KidsBackButton to={ROUTES.KIDS} />
      <Typography variant="h2">{t('kids.stories')}</Typography>

      <div className={styles.grid}>
        {PROPHET_STORIES.map((story) => (
          <Link key={story.id} to={storyLink(story.id)} className={styles.cardLink}>
            <Card elevation="raised" className={styles.card}>
              <StoryIllustration symbol={story.illustrationSymbol} color={story.accentColor} size={64} />
              <Typography variant="body" className={styles.storyName}>
                <span>{ProphetName({ nameEnglish: story.nameEnglish, propType: story.type }).replace(/\s+(عليه السلام|ﷺ)$/, '')}</span>
                {story.type === 'prophet' && (
                  <span className={styles.honorific} dir="rtl" lang="ar">
                    {story.nameEnglish.toLowerCase() === 'muhammad' ? 'ﷺ' : 'عليه السلام'}
                  </span>
                )}
              </Typography>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
