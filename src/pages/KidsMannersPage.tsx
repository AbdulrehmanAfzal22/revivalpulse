import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import PillGroup from 'components/ui/PillGroup';
import Skeleton from 'components/ui/Skeleton';
import HadithSnippetCard from 'features/kids/components/HadithSnippetCard';
import DuaCard from 'features/duas/components/DuaCard';
import useDuas from 'features/duas/hooks/useDuas';
import { useKidsProgressStore } from 'stores/kidsProgressStore';
import { MANNER_TIPS, RAMADAN_EID_ACTIVITIES, SIMPLIFIED_HADITH } from 'data/kids/manners';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsMannersPage.module.css';

type Tab = 'manners' | 'hadith' | 'duas' | 'activities';

const KID_FRIENDLY_DUA_CATEGORIES = ['wakingUp', 'sleeping', 'eating'];

function MannerTipCard({ tip, onView }: { tip: (typeof MANNER_TIPS)[number]; onView: () => void }) {
  const { t } = useTranslation();

  useEffect(() => {
    onView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <HadithSnippetCard framing={t(tip.tipKey)} bookSlug={tip.bookSlug} idInBook={tip.idInBook} />;
}

export default function KidsMannersPage() {
  const [tab, setTab] = useState<Tab>('manners');
  const markContentViewed = useKidsProgressStore((state) => state.markContentViewed);
  const { data: duas, isPending: duasPending } = useDuas();
  const { t } = useTranslation();

  const TABS: { id: Tab; label: string }[] = [
    { id: 'manners', label: t('kids.mannersTab.manners') },
    { id: 'hadith', label: t('kids.mannersTab.hadith') },
    { id: 'duas', label: t('kids.mannersTab.duas') },
    { id: 'activities', label: t('kids.mannersTab.activities') },
  ];

  const kidDuas = duas?.filter((dua) => KID_FRIENDLY_DUA_CATEGORIES.includes(dua.categoryId)).slice(0, 6) ?? [];

  return (
    <div className={styles.page}>
      <Typography variant="h2">{t('kids.mannersAndMore')}</Typography>
      <PillGroup options={TABS} value={tab} onChange={(id) => setTab(id as Tab)} />

      {tab === 'manners' && (
        <div className={styles.list}>
          {MANNER_TIPS.map((tip) => (
            <MannerTipCard key={tip.id} tip={tip} onView={() => markContentViewed('mannerTip', tip.id)} />
          ))}
        </div>
      )}

      {tab === 'hadith' && (
        <div className={styles.list}>
          {SIMPLIFIED_HADITH.map((hadith) => (
            <HadithSnippetCard
              key={hadith.id}
              framing={t(hadith.kidFramingKey)}
              bookSlug={hadith.bookSlug}
              idInBook={hadith.idInBook}
            />
          ))}
        </div>
      )}

      {tab === 'duas' && (
        <div className={styles.list}>
          {duasPending && <Skeleton variant="rect" height="8rem" count={3} />}
          {kidDuas.map((dua) => (
            <DuaCard key={dua.id} dua={dua} />
          ))}
        </div>
      )}

      {tab === 'activities' && (
        <div className={styles.list}>
          {RAMADAN_EID_ACTIVITIES.map((activity) => (
            <Card key={activity.id} elevation="raised" className={styles.activityCard}>
              <div className={styles.activityHeader}>
                <Sparkles size={16} />
                <Typography variant="body">{t(activity.titleKey)}</Typography>
              </div>
              <Typography variant="caption" muted>
                {t(activity.descriptionKey)}
              </Typography>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
