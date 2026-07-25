import { useState } from 'react';
import { History, RotateCcw, Vibrate, VibrateOff } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Button from 'components/ui/Button';
import PillGroup from 'components/ui/PillGroup';
import EmptyState from 'components/feedback/EmptyState';
import { useTasbeehStore, getTodayCount, getRecentHistory } from 'stores/tasbeehStore';
import { useTasbeehPreferencesStore } from 'stores/tasbeehPreferencesStore';
import { useGlobalCounterStore } from 'stores/globalCounterStore';
import { DHIKR_PRESETS, HISTORY_DAYS_SHOWN, TARGET_OPTIONS } from 'constants/tasbeeh';
import type { DhikrPreset } from 'types/tasbeeh.types';
import useTranslation from 'hooks/useTranslation';
import styles from './PersonalCounter.module.css';

function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

export default function PersonalCounter() {
  const dailyHistory = useTasbeehStore((state) => state.dailyHistory);
  const tap = useTasbeehStore((state) => state.tap);
  const reset = useTasbeehStore((state) => state.reset);

  const activeDhikrKey = useTasbeehPreferencesStore((state) => state.activeDhikrKey);
  const target = useTasbeehPreferencesStore((state) => state.target);
  const vibrationEnabled = useTasbeehPreferencesStore((state) => state.vibrationEnabled);
  const setActiveDhikrKey = useTasbeehPreferencesStore((state) => state.setActiveDhikrKey);
  const setTarget = useTasbeehPreferencesStore((state) => state.setTarget);
  const setVibrationEnabled = useTasbeehPreferencesStore((state) => state.setVibrationEnabled);

  const globalTap = useGlobalCounterStore((state) => state.tap);
  const { t } = useTranslation();

  const [customTargetInput, setCustomTargetInput] = useState('');

  const activePreset: DhikrPreset | undefined = DHIKR_PRESETS.find((preset) => preset.id === activeDhikrKey);
  const activeLabel = activePreset?.transliteration ?? activeDhikrKey;

  const pillOptions = DHIKR_PRESETS.map((preset) => ({ id: preset.id, label: preset.transliteration }));

  const todayCount = getTodayCount(dailyHistory, activeDhikrKey);
  const justReached = todayCount > 0 && todayCount % target === 0;
  const recentHistory = getRecentHistory(dailyHistory, HISTORY_DAYS_SHOWN);

  function handleTap() {
    tap(activeDhikrKey, activeLabel);
    globalTap(activeDhikrKey);

    if (vibrationEnabled && canVibrate()) {
      const willReachTarget = (todayCount + 1) % target === 0;
      navigator.vibrate(willReachTarget ? [40, 30, 40] : 15);
    }
  }

  function handleCustomTarget() {
    const parsed = Number(customTargetInput);
    if (Number.isFinite(parsed) && parsed > 0) {
      setTarget(parsed);
      setCustomTargetInput('');
    }
  }

  return (
    <div className={styles.wrapper}>
      <Card>
        <div className={styles.presetRow}>
          <PillGroup options={pillOptions} value={activeDhikrKey} onChange={setActiveDhikrKey} />
        </div>
      </Card>

      <Card elevation="raised" className={styles.counterCard}>
        {activePreset && (
          <Typography variant="h2" as="p" className={styles.arabic} dir="rtl">
            {activePreset.arabic}
          </Typography>
        )}
        <Typography variant="body" muted>
          {activePreset ? t(activePreset.translationKey) : activeLabel}
        </Typography>

        <button
          type="button"
          onClick={handleTap}
          className={[styles.tapButton, justReached && styles.tapButtonReached].filter(Boolean).join(' ')}
          aria-label={t('tasbeeh.tapToCount', { label: activeLabel })}
        >
          <span className={styles.count}>{todayCount}</span>
          <span className={styles.targetLabel}>{t('tasbeeh.of', { target })}</span>
        </button>

        <div className={styles.controlsRow}>
          <Button variant="ghost" size="sm" leadingIcon={<RotateCcw size={14} />} onClick={() => reset(activeDhikrKey)}>
            {t('tasbeeh.reset')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leadingIcon={vibrationEnabled ? <Vibrate size={14} /> : <VibrateOff size={14} />}
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
          >
            {vibrationEnabled ? t('tasbeeh.vibrationOn') : t('tasbeeh.vibrationOff')}
          </Button>
        </div>

        <div className={styles.targetRow}>
          <Typography variant="caption" muted>
            {t('tasbeeh.target')}
          </Typography>
          <PillGroup
            options={TARGET_OPTIONS.map((option) => ({ id: String(option), label: String(option) }))}
            value={String(target)}
            onChange={(id) => setTarget(Number(id))}
          />
          <input
            type="number"
            min={1}
            value={customTargetInput}
            onChange={(event) => setCustomTargetInput(event.target.value)}
            onBlur={handleCustomTarget}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleCustomTarget();
            }}
            placeholder={t('tasbeeh.customTargetPlaceholder')}
            className={styles.targetInput}
          />
        </div>
      </Card>

      <Card>
        <Typography variant="h4" as="h3" className={styles.historyTitle}>
          <History size={16} /> {t('tasbeeh.dailyHistory')}
        </Typography>
        {recentHistory.length === 0 ? (
          <EmptyState
            title={t('emptyState.tasbeeh.noHistoryTitle')}
            description={t('emptyState.tasbeeh.noHistoryDescription')}
          />
        ) : (
          <ul className={styles.historyList}>
            {recentHistory.map((entry) => (
              <li key={entry.id} className={styles.historyItem}>
                <Typography variant="body">{entry.payload.label}</Typography>
                <Typography variant="caption" muted>
                  {entry.payload.date}
                </Typography>
                <Typography variant="body" className={styles.historyCount}>
                  {entry.payload.count}
                </Typography>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
