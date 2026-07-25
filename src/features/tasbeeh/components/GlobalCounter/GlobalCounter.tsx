import { useEffect } from 'react';
import { CloudOff, Loader2, Wifi, WifiOff } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import PillGroup from 'components/ui/PillGroup';
import EmptyState from 'components/feedback/EmptyState';
import Skeleton from 'components/ui/Skeleton';
import { useGlobalCounterStore } from 'stores/globalCounterStore';
import useAnimatedNumber from '../../hooks/useAnimatedNumber';
import { DHIKR_PRESETS, GLOBAL_TIME_RANGES } from 'constants/tasbeeh';
import type { DhikrPreset, GlobalTimeRange } from 'types/tasbeeh.types';
import useTranslation from 'hooks/useTranslation';
import styles from './GlobalCounter.module.css';

interface StatCardProps {
  preset: DhikrPreset;
  total: number;
}

function StatCard({ preset, total }: StatCardProps) {
  const animated = useAnimatedNumber(total);

  return (
    <Card className={styles.statCard}>
      <Typography variant="caption" muted>
        {preset.transliteration}
      </Typography>
      <Typography variant="h3" as="p" className={styles.statValue}>
        {animated.toLocaleString()}
      </Typography>
    </Card>
  );
}

function formatPercentage(mine: number, total: number): string {
  if (total <= 0 || mine <= 0) return '0%';
  const pct = (mine / total) * 100;
  return pct < 0.1 ? '<0.1%' : `${pct.toFixed(1)}%`;
}

export default function GlobalCounter() {
  const isAvailable = useGlobalCounterStore((state) => state.isAvailable);
  const connectionStatus = useGlobalCounterStore((state) => state.connectionStatus);
  const selectedRange = useGlobalCounterStore((state) => state.selectedRange);
  const rangeTotals = useGlobalCounterStore((state) => state.rangeTotals);
  const allTimeTotals = useGlobalCounterStore((state) => state.allTimeTotals);
  const myContribution = useGlobalCounterStore((state) => state.myContribution);
  const hasPendingTaps = useGlobalCounterStore((state) => state.hasPendingTaps);
  const isLoadingRange = useGlobalCounterStore((state) => state.isLoadingRange);
  const start = useGlobalCounterStore((state) => state.start);
  const stop = useGlobalCounterStore((state) => state.stop);
  const setRange = useGlobalCounterStore((state) => state.setRange);
  const { t } = useTranslation();

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAvailable) {
    return (
      <Card>
        <EmptyState
          icon={<WifiOff size={20} />}
          title={t('emptyState.tasbeeh.globalUnavailableTitle')}
          description={t('emptyState.tasbeeh.globalUnavailableDescription')}
        />
      </Card>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Typography variant="h3" as="h2">
          {t('tasbeeh.communityTally')}
        </Typography>
        <span className={styles.status}>
          {connectionStatus === 'live' && (
            <>
              <Wifi size={14} /> {t('tasbeeh.live')}
            </>
          )}
          {connectionStatus === 'connecting' && (
            <>
              <Loader2 size={14} className={styles.spin} /> {t('tasbeeh.connecting')}
            </>
          )}
          {(connectionStatus === 'offline' || connectionStatus === 'error') && (
            <>
              <WifiOff size={14} /> {t('tasbeeh.offline')}
            </>
          )}
        </span>
      </div>

      {hasPendingTaps && (
        <Typography variant="caption" muted className={styles.pendingNote}>
          <CloudOff size={12} /> {t('tasbeeh.unsyncedNotice')}
        </Typography>
      )}

      <PillGroup
        options={GLOBAL_TIME_RANGES.map((range) => ({ id: range.id, label: t(range.labelKey) }))}
        value={selectedRange}
        onChange={(id) => setRange(id as GlobalTimeRange)}
      />

      {isLoadingRange ? (
        <div className={styles.grid}>
          {DHIKR_PRESETS.map((preset) => (
            <Skeleton key={preset.id} variant="rect" height={88} />
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {DHIKR_PRESETS.map((preset) => (
            <StatCard key={preset.id} preset={preset} total={rangeTotals[preset.id] ?? 0} />
          ))}
        </div>
      )}

      <Card>
        <Typography variant="h4" as="h3" className={styles.contributionTitle}>
          {t('tasbeeh.yourContribution')}
        </Typography>
        <ul className={styles.contributionList}>
          {DHIKR_PRESETS.map((preset) => {
            const mine = myContribution[preset.id] ?? 0;
            const total = allTimeTotals[preset.id] ?? 0;
            return (
              <li key={preset.id} className={styles.contributionItem}>
                <Typography variant="body">{preset.transliteration}</Typography>
                <Typography variant="body" muted>
                  {mine.toLocaleString()}
                </Typography>
                <Typography variant="caption" muted>
                  {formatPercentage(mine, total)}
                </Typography>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
