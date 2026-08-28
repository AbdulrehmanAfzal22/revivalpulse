import { useEffect, useState } from 'react';
import { Moon, MoonStar, SunDim, Sunrise, Sunset, SunMedium } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PRAYER_DISPLAY_ORDER } from 'constants/prayerNames';
import { getCountdownParts, getCurrentPrayerInfo } from 'features/prayerTimes/services/prayerTimeCalculations';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import useTranslation from 'hooks/useTranslation';
import type { PrayerTimesResult } from 'types/prayerTimes.types';
import styles from './PrayerTimesList.module.css';

export interface PrayerTimesListProps {
  result: PrayerTimesResult;
}

export default function PrayerTimesList({ result }: PrayerTimesListProps) {
  const [, setClockTick] = useState(0);
  const { current, next, minutesUntilNext } = getCurrentPrayerInfo(result.timings, result.timezone);
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const interval = window.setInterval(() => setClockTick((tick) => tick + 1), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const { hours, minutes } = getCountdownParts(minutesUntilNext);
  const icons = { Fajr: Moon, Sunrise, Dhuhr: SunMedium, Asr: SunDim, Maghrib: Sunset, Isha: MoonStar };
  const countdown =
    hours === 0 ? t('prayerTimes.countdownMinutes', { minutes }) : t('prayerTimes.countdownHoursMinutes', { hours, minutes });
  const entrance = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 18, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } };
  const transition = reduceMotion ? { duration: 0.01 } : { duration: 0.72, ease: [0.16, 1, 0.3, 1] as const };
  const isClose = minutesUntilNext < 5;

  return (
    <motion.div
      className={styles.wrapper}
      initial="hidden"
      animate="visible"
      variants={entrance}
      transition={transition}
    >
      <motion.div
        className={[styles.heroShell, isClose && styles.heroClose].filter(Boolean).join(' ')}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0.01 } : { duration: 0.82, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className={styles.ambient} aria-hidden="true" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} />
        <Card elevation="raised" className={styles.nextCard}>
        <Typography variant="caption" muted>
          {current ? t('prayerTimes.currentNext', { current }) : t('prayerTimes.next')}
        </Typography>
        <Typography variant="h2">{next}</Typography>
        <Typography variant="body" muted className={styles.countdown}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={countdown}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(3px)' }}
              transition={transition}
            >
              {t('prayerTimes.in', { countdown })}
            </motion.span>
          </AnimatePresence>{' · '}{result.timings[next]}
        </Typography>
        </Card>
      </motion.div>

      <ul className={styles.list}>
        {PRAYER_DISPLAY_ORDER.map((name, index) => (
          <motion.li
            key={name}
            className={styles.row}
            initial="hidden"
            animate="visible"
            variants={entrance}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.26 + index * 0.07 }}
          >
            {name === next && <motion.div className={styles.activeRail} layoutId="active-prayer" transition={transition} />}
            <span className={styles.name}>
              {(() => { const Icon = icons[name]; return <motion.span className={styles.iconWrap} animate={reduceMotion ? undefined : { y: name === 'Fajr' || name === 'Isha' ? [0, -2, 0] : [0, 1, 0], rotate: name === 'Dhuhr' ? [0, 2, 0] : 0 }} transition={{ duration: name === 'Dhuhr' ? 8 : 4.5, repeat: Infinity, ease: 'easeInOut' }}><Icon size={15} className={styles.prayerIcon} aria-hidden="true" /></motion.span>; })()}
              {name}
            </span>
            <motion.span className={styles.time} animate={name === next && !reduceMotion ? { color: 'var(--color-text)', fontWeight: 650 } : undefined}>{result.timings[name]}</motion.span>
          </motion.li>
        ))}
      </ul>

      <Typography variant="caption" muted className={styles.meta}>
        {t('prayerTimes.dateMeta', {
          gregorian: result.dateGregorian,
          hijri: result.dateHijri,
          method: result.methodName,
        })}
      </Typography>
    </motion.div>
  );
}
