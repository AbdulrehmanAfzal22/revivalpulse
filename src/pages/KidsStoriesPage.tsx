import { useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import PillGroup from 'components/ui/PillGroup';
import StoryIllustration from 'features/kids/components/StoryIllustration';
import KidsBackButton from 'features/kids/components/KidsBackButton';
import { PROPHET_STORIES, SAHABAH_STORIES } from 'data/kids/stories';
import { getKidsStoryV2 } from 'data/kids/storiesV2';
import { ROUTES, buildKidsStoryChaptersPath, buildKidsStoryPath } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsStoriesPage.module.css';

type Tab = 'prophets' | 'sahabah';

function storyLink(storyId: string): string {
  // Phase 3+ — chapter-based stories link to their chapter list; everything
  // else keeps the legacy flat story page until it is migrated.
  return getKidsStoryV2(storyId)
    ? buildKidsStoryChaptersPath(storyId)
    : buildKidsStoryPath(storyId);
}

export default function KidsStoriesPage() {
  const [tab, setTab] = useState<Tab>('prophets');
  const { t } = useTranslation();
  const stories = tab === 'prophets' ? PROPHET_STORIES : SAHABAH_STORIES;

  const TABS: { id: Tab; label: string }[] = [
    { id: 'prophets', label: t('kids.storiesTab.prophets') },
    { id: 'sahabah', label: t('kids.storiesTab.sahabah') },
  ];

  return (
    <div className={styles.page}>
      <KidsBackButton to={ROUTES.KIDS} />
      <Typography variant="h2">{t('kids.stories')}</Typography>
      <PillGroup options={TABS} value={tab} onChange={(id) => setTab(id as Tab)} />

      <div className={styles.grid}>
        {stories.map((story) => (
          <Link key={story.id} to={storyLink(story.id)} className={styles.cardLink}>
            <Card elevation="raised" className={styles.card}>
              <StoryIllustration symbol={story.illustrationSymbol} color={story.accentColor} size={64} />
              <Typography variant="body">{story.nameEnglish}</Typography>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
