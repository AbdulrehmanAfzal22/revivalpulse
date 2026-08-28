import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PillGroup from 'components/ui/PillGroup';
import EmptyState from 'components/feedback/EmptyState';
import { DUA_CATEGORIES } from 'data/duas';
import DuaCard from './DuaCard';
import type { DuaItem } from 'types/duas.types';
import type { DuaCategoryId } from 'types/duas.types';
import useTranslation from 'hooks/useTranslation';
import styles from './DuasBrowser.module.css';
import DuaSettingsPopover from './DuaSettingsPopover';
import type { DuaSettings } from './DuaSettingsPopover';

const DEFAULT_DUA_SETTINGS: DuaSettings = {
  arabicSize: 33,
  translationSize: 19,
  playbackRate: 1,
};

const DUA_SETTINGS_STORAGE_KEY = 'duas-display-settings';

export interface DuasBrowserProps {
  duas: DuaItem[];
}

export default function DuasBrowser({ duas }: DuasBrowserProps) {
  // DUA_CATEGORIES is a fixed non-empty literal array (data/duas/index.ts), so index 0 always exists.
  const [categoryId, setCategoryId] = useState<DuaCategoryId>((DUA_CATEGORIES[0] as (typeof DUA_CATEGORIES)[number]).id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [settings, setSettings] = useState<DuaSettings>(() => {
    try {
      const stored = window.localStorage.getItem(DUA_SETTINGS_STORAGE_KEY);
      if (!stored) return DEFAULT_DUA_SETTINGS;
      const parsed = JSON.parse(stored) as Partial<DuaSettings>;
      return {
        arabicSize: parsed.arabicSize ?? DEFAULT_DUA_SETTINGS.arabicSize,
        translationSize: parsed.translationSize ?? DEFAULT_DUA_SETTINGS.translationSize,
        playbackRate: parsed.playbackRate ?? DEFAULT_DUA_SETTINGS.playbackRate,
      };
    } catch {
      return DEFAULT_DUA_SETTINGS;
    }
  });
  const touchStartX = useRef<number | null>(null);
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const items = useMemo(() => duas.filter((dua) => dua.categoryId === categoryId), [duas, categoryId]);
  const categoryCount = items.length;
  const currentDua = items[currentIndex];

  useEffect(() => {
    window.localStorage.setItem(DUA_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const moveTo = useCallback((nextIndex: number, nextDirection: number): void => {
    if (nextIndex < 0 || nextIndex >= categoryCount) return;
    setDirection(nextDirection);
    setCurrentIndex(nextIndex);
  }, [categoryCount]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
      if (event.key === 'ArrowLeft') moveTo(currentIndex - 1, -1);
      if (event.key === 'ArrowRight') moveTo(currentIndex + 1, 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, moveTo]);

  return (
    <div className={styles.wrapper}>
      <PillGroup
        options={DUA_CATEGORIES.map((category) => ({ id: category.id, label: t(category.labelKey) }))}
        value={categoryId}
        onChange={(id) => {
          setCategoryId(id as DuaCategoryId);
          setCurrentIndex(0);
          setDirection(1);
        }}
      />

      {categoryCount === 0 ? (
        <EmptyState title={t('emptyState.duas.categoryEmpty')} />
      ) : (
        <div className={styles.viewer}>
          <div
            className={styles.cardStage}
            tabIndex={0}
            onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }}
            onTouchEnd={(event) => {
              const startX = touchStartX.current;
              const endX = event.changedTouches[0]?.clientX;
              touchStartX.current = null;
              if (startX === null || endX === undefined || Math.abs(endX - startX) < 48) return;
              moveTo(currentIndex + (endX < startX ? 1 : -1), endX < startX ? 1 : -1);
            }}
          >
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              {currentDua && (
                <motion.div
                  key={currentDua.id}
                  className={styles.cardMotion}
                  custom={direction}
                  role="listitem"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -28 }}
                  transition={reduceMotion ? { duration: 0.01 } : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DuaCard
                    dua={currentDua}
                    arabicSize={settings.arabicSize}
                    translationSize={settings.translationSize}
                    playbackRate={settings.playbackRate}
                    headerAction={
                      <DuaSettingsPopover
                        settings={settings}
                        onChange={(patch) => setSettings((current) => ({ ...current, ...patch }))}
                      />
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.navigation}>
            <button type="button" className={styles.navButton} onClick={() => moveTo(currentIndex - 1, -1)} disabled={currentIndex === 0}>
              <ChevronLeft size={16} aria-hidden="true" />
              <span>Previous</span>
            </button>
            <span className={styles.progress} aria-live="polite">{currentIndex + 1} / {categoryCount}</span>
            <button type="button" className={styles.navButton} onClick={() => moveTo(currentIndex + 1, 1)} disabled={currentIndex === categoryCount - 1}>
              <span>Next</span>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.progressTrack} aria-hidden="true">
            <motion.div className={styles.progressBar} animate={{ scaleX: (currentIndex + 1) / categoryCount }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} />
          </div>
        </div>
      )}
    </div>
  );
}
