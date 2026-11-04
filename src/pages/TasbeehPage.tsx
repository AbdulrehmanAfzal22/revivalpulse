import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Check,
  CloudOff,
  Globe2,
  History,
  Infinity as InfinityIcon,
  Loader2,
  RotateCcw,
  Sparkles,
  Sun,
  Undo2,
  Vibrate,
  VibrateOff,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Dialog from 'components/ui/Dialog';
import { ROUTES } from 'constants/routes';
import {
  DEFAULT_TARGET,
  DHIKR_PRESETS,
  GLOBAL_TIME_RANGES,
  TARGET_OPTIONS,
} from 'constants/tasbeeh';
import useAnimatedNumber from 'features/tasbeeh/hooks/useAnimatedNumber';
import useInterfaceLanguage from 'hooks/useInterfaceLanguage';
import useTranslation from 'hooks/useTranslation';
import { useGlobalCounterStore } from 'stores/globalCounterStore';
import { flushTasbeehSync, getTodayCount, useTasbeehStore } from 'stores/tasbeehStore';
import { useTasbeehPreferencesStore } from 'stores/tasbeehPreferencesStore';
import type { DhikrPreset, GlobalConnectionStatus, GlobalTimeRange } from 'types/tasbeeh.types';
import styles from './TasbeehPage.module.css';

type TasbeehView = 'personal' | 'worldwide';
type HistoryFilter = 'all' | 'today';

const DAILY_INTENTION_GOAL = 100;

function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

function formatPercentage(mine: number, total: number): string {
  if (total <= 0 || mine <= 0) return '0%';
  const pct = (mine / total) * 100;
  return pct < 0.1 ? '<0.1%' : `${pct.toFixed(1)}%`;
}

interface ConnectionStatusProps {
  status: GlobalConnectionStatus;
}

function ConnectionStatus({ status }: ConnectionStatusProps) {
  const { t } = useTranslation();

  if (status === 'live') {
    return (
      <span className={styles.status}>
        <Wifi size={13} /> {t('tasbeeh.live')}
      </span>
    );
  }
  if (status === 'connecting') {
    return (
      <span className={styles.status}>
        <Loader2 size={13} className={styles.spin} /> {t('tasbeeh.connecting')}
      </span>
    );
  }
  if (status === 'unavailable') {
    return (
      <span className={styles.status}>
        <WifiOff size={13} /> {t('emptyState.tasbeeh.globalUnavailableTitle')}
      </span>
    );
  }
  return (
    <span className={styles.status}>
      <WifiOff size={13} /> {t('tasbeeh.offline')}
    </span>
  );
}

interface CommunityCardProps {
  total: number;
  isAvailable: boolean;
  status: GlobalConnectionStatus;
  rangeLabel: string;
  onExplore?: () => void;
}

function CommunityCard({ total, isAvailable, status, rangeLabel, onExplore }: CommunityCardProps) {
  const { t } = useTranslation();
  const animatedTotal = useAnimatedNumber(total);

  return (
    <section className={`${styles.card} ${styles.community}`}>
      <div className={styles.communityTop}>
        <span className={styles.communityEyebrow}>{t('tasbeeh.communityLabel')}</span>
        <span className={styles.communityBadge}>
          <ConnectionStatus status={status} />
        </span>
      </div>
      <h2 className={styles.communityTitle}>{t('tasbeeh.communityTitle')}</h2>
      <p className={styles.communityDescription}>{t('tasbeeh.communityDescription')}</p>
      <div className={styles.worldNumber}>
        {isAvailable ? animatedTotal.toLocaleString() : '—'}
      </div>
      <div className={styles.worldLive}>{t('tasbeeh.communityTally')}</div>
      <div className={styles.worldFooter}>
        <span>{isAvailable ? t('tasbeeh.live') : t('tasbeeh.offline')}</span>
        <span>{rangeLabel}</span>
      </div>
      {onExplore && (
        <button type="button" className={styles.exploreButton} onClick={onExplore}>
          {t('tasbeeh.exploreWorldwide')} <ArrowRight size={14} />
        </button>
      )}
    </section>
  );
}

export default function TasbeehPage() {
  const dailyHistory = useTasbeehStore((state) => state.dailyHistory);
  const tap = useTasbeehStore((state) => state.tap);
  const reset = useTasbeehStore((state) => state.reset);
  const undo = useTasbeehStore((state) => state.undo);

  const activeDhikrKey = useTasbeehPreferencesStore((state) => state.activeDhikrKey);
  const target = useTasbeehPreferencesStore((state) => state.target);
  const vibrationEnabled = useTasbeehPreferencesStore((state) => state.vibrationEnabled);
  const setActiveDhikrKey = useTasbeehPreferencesStore((state) => state.setActiveDhikrKey);
  const setTarget = useTasbeehPreferencesStore((state) => state.setTarget);
  const setVibrationEnabled = useTasbeehPreferencesStore((state) => state.setVibrationEnabled);

  const isGlobalAvailable = useGlobalCounterStore((state) => state.isAvailable);
  const connectionStatus = useGlobalCounterStore((state) => state.connectionStatus);
  const selectedRange = useGlobalCounterStore((state) => state.selectedRange);
  const rangeTotals = useGlobalCounterStore((state) => state.rangeTotals);
  const allTimeTotals = useGlobalCounterStore((state) => state.allTimeTotals);
  const myContribution = useGlobalCounterStore((state) => state.myContribution);
  const hasPendingTaps = useGlobalCounterStore((state) => state.hasPendingTaps);
  const isLoadingRange = useGlobalCounterStore((state) => state.isLoadingRange);
  const startGlobalCounter = useGlobalCounterStore((state) => state.start);
  const stopGlobalCounter = useGlobalCounterStore((state) => state.stop);
  const setRange = useGlobalCounterStore((state) => state.setRange);
  const globalTap = useGlobalCounterStore((state) => state.tap);

  const { t } = useTranslation();
  const { interfaceLanguage } = useInterfaceLanguage();

  const [view, setView] = useState<TasbeehView>('personal');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');
  const [isTargetDialogOpen, setIsTargetDialogOpen] = useState(false);
  const [customTargetInput, setCustomTargetInput] = useState(String(DEFAULT_TARGET));
  const [isTapFeedback, setIsTapFeedback] = useState(false);

  const activePreset: DhikrPreset = useMemo(
    () => DHIKR_PRESETS.find((preset) => preset.id === activeDhikrKey) ?? (DHIKR_PRESETS[0] as DhikrPreset),
    [activeDhikrKey]
  );
  const activeLabel = activePreset.transliteration;

  const todayCount = getTodayCount(dailyHistory, activePreset.id);

  const { todayTotal, allTimeTotal, completedSessions, historyRows } = useMemo(() => {
    const today = localDateKey();
    const liveRecords = dailyHistory.filter((entry) => !entry.deleted && entry.payload.count > 0);
    const perPresetToday = DHIKR_PRESETS.map((preset) => getTodayCount(dailyHistory, preset.id));

    return {
      todayTotal: perPresetToday.reduce((sum, count) => sum + count, 0),
      allTimeTotal: liveRecords.reduce((sum, entry) => sum + entry.payload.count, 0),
      completedSessions: liveRecords.reduce(
        (sum, entry) => sum + Math.floor(entry.payload.count / target),
        0
      ),
      historyRows: [...liveRecords]
        .filter((entry) => historyFilter === 'all' || entry.payload.date === today)
        .sort((a, b) =>
          a.payload.date < b.payload.date
            ? 1
            : a.payload.date > b.payload.date
              ? -1
              : b.updatedAt - a.updatedAt
        ),
    };
  }, [dailyHistory, historyFilter, target]);

  const rangeTotal = useMemo(
    () => Object.values(rangeTotals).reduce((sum, count) => sum + count, 0),
    [rangeTotals]
  );

  const selectedRangeLabel = useMemo(
    () => t(GLOBAL_TIME_RANGES.find((range) => range.id === selectedRange)?.labelKey ?? 'tasbeeh.range.today'),
    [selectedRange, t]
  );

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(interfaceLanguage.code),
    [interfaceLanguage.code]
  );

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(interfaceLanguage.code, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    [interfaceLanguage.code]
  );

  const formatNumber = useCallback(
    (value: number) => numberFormatter.format(value),
    [numberFormatter]
  );

  useEffect(() => {
    startGlobalCounter();
    return () => {
      stopGlobalCounter();
      flushTasbeehSync();
    };
  }, [startGlobalCounter, stopGlobalCounter]);

  const isCustomTarget = !(TARGET_OPTIONS as readonly number[]).includes(target);
  const cycleCount = todayCount === 0 ? 0 : todayCount % target === 0 ? target : todayCount % target;
  const progressDegrees = Math.round((cycleCount / target) * 360);
  const reachedTarget = todayCount > 0 && todayCount % target === 0;
  const goalPercent = Math.min(100, Math.round((todayTotal / DAILY_INTENTION_GOAL) * 100));

  const handleTap = useCallback(() => {
    tap(activePreset.id, activeLabel);
    globalTap(activePreset.id);

    if (vibrationEnabled && canVibrate()) {
      const willReachTarget = (todayCount + 1) % target === 0;
      navigator.vibrate(willReachTarget ? [40, 30, 40] : 15);
    }

    setIsTapFeedback(true);
    window.setTimeout(() => setIsTapFeedback(false), 140);
  }, [activeLabel, activePreset.id, globalTap, tap, target, todayCount, vibrationEnabled]);

  useEffect(() => {
    if (view !== 'personal') return;

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.code !== 'Space' || isTargetDialogOpen) return;
      if (event.repeat) return;

      const element = event.target as HTMLElement | null;
      const tag = element?.tagName;
      if (
        tag === 'INPUT' ||
        tag === 'BUTTON' ||
        tag === 'SELECT' ||
        tag === 'TEXTAREA' ||
        element?.isContentEditable
      ) {
        return;
      }

      event.preventDefault();
      handleTap();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTap, isTargetDialogOpen, view]);

  function openTargetDialog(): void {
    setCustomTargetInput(String(target));
    setIsTargetDialogOpen(true);
  }

  function handleCustomTargetSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const parsed = Number(customTargetInput);
    if (Number.isFinite(parsed) && parsed > 0 && parsed <= 100000) {
      setTarget(Math.round(parsed));
      setIsTargetDialogOpen(false);
    }
  }

  function toggleVibration(): void {
    setVibrationEnabled(!vibrationEnabled);
  }

  const circleStyle = { '--progress': `${progressDegrees}deg` } as CSSProperties;

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label={t('nav.primary')}>
        <Link to={ROUTES.HOME}>{t('nav.home')}</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span>{t('tasbeeh.breadcrumbWorship')}</span>
        <span className={styles.breadcrumbSep}>/</span>
        <strong>{t('tasbeeh.title')}</strong>
      </nav>

      <header className={styles.intro}>
        <div>
          <h1 className={styles.title}>{t('tasbeeh.pageTitle')}</h1>
          <p className={styles.subtitle}>{t('tasbeeh.pageSubtitle')}</p>
        </div>
        <div className={styles.date}>
          <CalendarDays size={14} />
          <span>{dateLabel}</span>
        </div>
      </header>

      <div className={styles.tabs} role="tablist" aria-label={t('tasbeeh.title')}>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'personal'}
          className={`${styles.tab} ${view === 'personal' ? styles.tabActive : ''}`}
          onClick={() => setView('personal')}
        >
          <Sun size={14} /> {t('tasbeeh.tabPersonal')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'worldwide'}
          className={`${styles.tab} ${view === 'worldwide' ? styles.tabActive : ''}`}
          onClick={() => setView('worldwide')}
        >
          <Globe2 size={14} /> {t('tasbeeh.tabWorldwide')}
          <small className={styles.tabBadge}>{t('tasbeeh.communityLabel')}</small>
        </button>
      </div>

      <div className={styles.stats}>
        <article className={styles.stat}>
          <span className={styles.statIcon}>
            <Sun size={18} />
          </span>
          <div>
            <span className={styles.statLabel}>{t('tasbeeh.statToday')}</span>
            <strong className={styles.statValue}>{formatNumber(todayTotal)}</strong>
          </div>
        </article>
        <article className={styles.stat}>
          <span className={styles.statIcon}>
            <InfinityIcon size={18} />
          </span>
          <div>
            <span className={styles.statLabel}>{t('tasbeeh.statAllTime')}</span>
            <strong className={styles.statValue}>{formatNumber(allTimeTotal)}</strong>
          </div>
        </article>
        <article className={styles.stat}>
          <span className={styles.statIcon}>
            <Check size={18} />
          </span>
          <div>
            <span className={styles.statLabel}>{t('tasbeeh.statSessions')}</span>
            <strong className={styles.statValue}>{formatNumber(completedSessions)}</strong>
          </div>
        </article>
      </div>

      {view === 'personal' ? (
        <>
          <div className={styles.layout}>
            <section className={`${styles.card} ${styles.counter}`} role="tabpanel">
              <div className={styles.cardTop}>
                <span className={styles.eyebrow}>{t('tasbeeh.eyebrow')}</span>
                <span className={styles.badge}>
                  <Check size={11} /> {t('tasbeeh.savedOnDevice')}
                </span>
              </div>

              <div className={styles.dhikrTabs} role="group" aria-label={t('tasbeeh.title')}>
                {DHIKR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={preset.id === activePreset.id}
                    className={`${styles.dhikrTab} ${
                      preset.id === activePreset.id ? styles.dhikrTabActive : ''
                    }`}
                    onClick={() => setActiveDhikrKey(preset.id)}
                  >
                    {preset.transliteration}
                  </button>
                ))}
              </div>

              <p className={styles.arabic} lang="ar" dir="rtl">
                {activePreset.arabic}
              </p>
              <p className={styles.translation}>{t(activePreset.translationKey)}</p>

              <button
                type="button"
                onClick={handleTap}
                style={circleStyle}
                aria-label={t('tasbeeh.tapToCount', { label: activeLabel })}
                className={`${styles.circle} ${reachedTarget ? styles.circleReached : ''} ${
                  isTapFeedback ? styles.circlePressed : ''
                }`}
              >
                <strong className={styles.count}>{formatNumber(todayCount)}</strong>
                <span className={styles.circleTarget}>{t('tasbeeh.of', { target: formatNumber(target) })}</span>
              </button>

              <div className={styles.tapHint}>{t('tasbeeh.tapHint')}</div>

              <div className={styles.controls}>
                <button type="button" className={styles.controlButton} onClick={() => reset(activePreset.id)}>
                  <RotateCcw size={13} /> {t('tasbeeh.reset')}
                </button>
                <button type="button" className={styles.controlButton} onClick={toggleVibration}>
                  {vibrationEnabled ? <Vibrate size={13} /> : <VibrateOff size={13} />}{' '}
                  {vibrationEnabled ? t('tasbeeh.vibrationOn') : t('tasbeeh.vibrationOff')}
                </button>
                <button
                  type="button"
                  className={styles.controlButton}
                  onClick={() => undo(activePreset.id)}
                  disabled={todayCount === 0}
                >
                  <Undo2 size={13} /> {t('tasbeeh.undo')}
                </button>
              </div>

              <div className={styles.targetRow}>
                <span className={styles.targetLabel}>{t('tasbeeh.target')}</span>
                {TARGET_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={target === option}
                    className={`${styles.targetPill} ${target === option ? styles.targetPillActive : ''}`}
                    onClick={() => setTarget(option)}
                  >
                    {formatNumber(option)}
                  </button>
                ))}
                <button
                  type="button"
                  className={`${styles.targetPill} ${isCustomTarget ? styles.targetPillActive : ''}`}
                  onClick={openTargetDialog}
                >
                  {isCustomTarget ? formatNumber(target) : t('tasbeeh.customTargetPlaceholder')}
                </button>
              </div>
            </section>

            <aside className={styles.right}>
              <CommunityCard
                total={rangeTotal}
                isAvailable={isGlobalAvailable}
                status={connectionStatus}
                rangeLabel={selectedRangeLabel}
                onExplore={() => setView('worldwide')}
              />

              <section className={`${styles.card} ${styles.goal}`}>
                <div className={styles.titleRow}>
                  <h3>{t('tasbeeh.dailyIntention')}</h3>
                  <Sparkles size={16} />
                </div>
                <div className={styles.goalLine}>
                  <span>
                    <b>{formatNumber(todayTotal)}</b> / {formatNumber(DAILY_INTENTION_GOAL)}
                  </span>
                  <b>{goalPercent}%</b>
                </div>
                <div
                  className={styles.bar}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={goalPercent}
                >
                  <div style={{ width: `${goalPercent}%` }} />
                </div>
                <p className={styles.goalNote}>{t('tasbeeh.smallSteps')}</p>
                <blockquote className={styles.quote}>
                  “{t('tasbeeh.quote')}”
                  <cite>
                    {t('nav.quran')} · 13:28
                  </cite>
                </blockquote>
              </section>
            </aside>
          </div>

          <section className={`${styles.card} ${styles.historyCard}`}>
            <div className={styles.titleRow}>
              <h3 className={styles.historyTitle}>
                <History size={15} /> {t('tasbeeh.dailyHistory')}
              </h3>
              <select
                className={styles.historyFilter}
                aria-label={t('tasbeeh.dailyHistory')}
                value={historyFilter}
                onChange={(event) => setHistoryFilter(event.target.value as HistoryFilter)}
              >
                <option value="all">{t('tasbeeh.range.allTime')}</option>
                <option value="today">{t('tasbeeh.range.today')}</option>
              </select>
            </div>

            {historyRows.length === 0 ? (
              <p className={styles.empty}>{t('emptyState.tasbeeh.noHistoryDescription')}</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t('tasbeeh.historyDhikr')}</th>
                      <th>{t('tasbeeh.historyDate')}</th>
                      <th>{t('tasbeeh.statSessions')}</th>
                      <th>{t('tasbeeh.historyTotal')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRows.map((entry) => {
                      const label =
                        DHIKR_PRESETS.find((preset) => preset.id === entry.payload.dhikrKey)
                          ?.transliteration ?? entry.payload.label;
                      return (
                        <tr key={entry.id}>
                          <td>
                            <span className={styles.historyDhikr}>
                              <span aria-hidden="true">✧</span> {label}
                            </span>
                          </td>
                          <td>
                            {new Date(`${entry.payload.date}T12:00:00`).toLocaleDateString(
                              interfaceLanguage.code,
                              { day: 'numeric', month: 'short', year: 'numeric' }
                            )}
                          </td>
                          <td>{formatNumber(Math.floor(entry.payload.count / target))}</td>
                          <td className={styles.historyTotal}>{formatNumber(entry.payload.count)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : (
        <section className={styles.worldView} role="tabpanel">
          <div className={styles.worldHeader}>
            <div>
              <span className={styles.eyebrow}>{t('tasbeeh.communityLabel')}</span>
              <h2>{t('tasbeeh.communityTally')}</h2>
            </div>
            <ConnectionStatus status={connectionStatus} />
          </div>

          {!isGlobalAvailable ? (
            <div className={`${styles.card} ${styles.unavailable}`}>
              <WifiOff size={22} />
              <h3>{t('emptyState.tasbeeh.globalUnavailableTitle')}</h3>
              <p>{t('emptyState.tasbeeh.globalUnavailableDescription')}</p>
            </div>
          ) : (
            <>
              {hasPendingTaps && (
                <p className={styles.pendingNote}>
                  <CloudOff size={13} /> {t('tasbeeh.unsyncedNotice')}
                </p>
              )}

              <div className={styles.rangeRow} role="group" aria-label={t('tasbeeh.communityTally')}>
                {GLOBAL_TIME_RANGES.map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    aria-pressed={selectedRange === range.id}
                    className={`${styles.targetPill} ${
                      selectedRange === range.id ? styles.targetPillActive : ''
                    }`}
                    onClick={() => setRange(range.id as GlobalTimeRange)}
                  >
                    {t(range.labelKey)}
                  </button>
                ))}
              </div>

              <div className={styles.worldGrid}>
                <CommunityCard
                  total={rangeTotal}
                  isAvailable={isGlobalAvailable}
                  status={connectionStatus}
                  rangeLabel={selectedRangeLabel}
                />

                <section className={`${styles.card} ${styles.contribution}`}>
                  <div className={styles.titleRow}>
                    <h3>{t('tasbeeh.yourContribution')}</h3>
                    <span className={styles.rangeHint}>{selectedRangeLabel}</span>
                  </div>
                  <ul className={styles.contributionList}>
                    {DHIKR_PRESETS.map((preset) => {
                      const mine = myContribution[preset.id] ?? 0;
                      const total = allTimeTotals[preset.id] ?? 0;
                      return (
                        <li key={preset.id} className={styles.contributionItem}>
                          <span>{preset.transliteration}</span>
                          <span className={styles.contributionCount}>{formatNumber(mine)}</span>
                          <span className={styles.contributionPercent}>
                            {formatPercentage(mine, total)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className={styles.worldNote}>{t('tasbeeh.worldwideNote')}</p>
                </section>
              </div>

              <section className={`${styles.card} ${styles.breakdown}`}>
                <div className={styles.titleRow}>
                  <h3>{t('tasbeeh.communityRemembrance')}</h3>
                  <span className={styles.rangeHint}>{selectedRangeLabel}</span>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>{t('tasbeeh.historyDhikr')}</th>
                        <th>{t('tasbeeh.communityTally')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DHIKR_PRESETS.map((preset) => (
                        <tr key={preset.id}>
                          <td>{preset.transliteration}</td>
                          <td className={styles.historyTotal}>
                            {isLoadingRange ? (
                              <span className={styles.skeletonBar} />
                            ) : (
                              formatNumber(rangeTotals[preset.id] ?? 0)
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <button type="button" className={styles.continueButton} onClick={() => setView('personal')}>
                {t('tasbeeh.continueTasbeeh')} <ArrowRight size={15} />
              </button>
            </>
          )}
        </section>
      )}

      <Dialog
        isOpen={isTargetDialogOpen}
        onClose={() => setIsTargetDialogOpen(false)}
        title={t('tasbeeh.setIntention')}
      >
        <form className={styles.dialogForm} onSubmit={handleCustomTargetSubmit}>
          <p className={styles.dialogText}>{t('tasbeeh.setIntentionDescription')}</p>
          <label className={styles.inputLabel} htmlFor="tasbeeh-custom-target">
            {t('tasbeeh.target')}
          </label>
          <input
            id="tasbeeh-custom-target"
            className={styles.targetInput}
            type="number"
            inputMode="numeric"
            min={1}
            max={100000}
            step={1}
            value={customTargetInput}
            onChange={(event) => setCustomTargetInput(event.target.value)}
            autoFocus
          />
          <div className={styles.dialogActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setIsTargetDialogOpen(false)}
            >
              {t('common.close')}
            </button>
            <button type="submit" className={styles.primaryButton}>
              {t('common.save')}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
