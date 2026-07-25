import { Compass, Loader2 } from 'lucide-react';
import Button from 'components/ui/Button';
import Typography from 'components/ui/Typography';
import type { CompassSupport, QiblaResult } from 'types/qibla.types';
import useTranslation from 'hooks/useTranslation';
import type { TranslationKey } from 'i18n';
import styles from './QiblaCompass.module.css';

export interface QiblaCompassProps {
  qibla: QiblaResult;
  heading: number | null;
  support: CompassSupport;
  onRequestPermission: () => void;
}

const CARDINALS: { labelKey: TranslationKey; angle: number }[] = [
  { labelKey: 'qibla.cardinalNorth', angle: 0 },
  { labelKey: 'qibla.cardinalEast', angle: 90 },
  { labelKey: 'qibla.cardinalSouth', angle: 180 },
  { labelKey: 'qibla.cardinalWest', angle: 270 },
];

export default function QiblaCompass({ qibla, heading, support, onRequestPermission }: QiblaCompassProps) {
  const isLive = support === 'supported' && heading !== null;
  const needleRotation = isLive ? qibla.bearing - heading : qibla.bearing;
  const dialRotation = isLive ? -heading : 0;
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.dial} style={{ transform: `rotate(${dialRotation}deg)` }}>
        {CARDINALS.map((cardinal) => (
          <span
            key={cardinal.labelKey}
            className={styles.cardinal}
            style={{ transform: `rotate(${cardinal.angle}deg) translateY(-8rem) rotate(${-cardinal.angle}deg)` }}
          >
            {t(cardinal.labelKey)}
          </span>
        ))}
        <div className={styles.needle} style={{ transform: `rotate(${needleRotation}deg)` }}>
          <div className={styles.needleKaaba} aria-hidden="true" />
        </div>
        <div className={styles.center} />
      </div>

      <Typography variant="h3">{t('qibla.bearingFromNorth', { bearing: qibla.bearing.toFixed(1) })}</Typography>
      <Typography variant="caption" muted>
        {t('qibla.distanceToKaaba', {
          distance: qibla.distanceKm.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        })}
      </Typography>

      {support === 'permission-required' && (
        <Button variant="primary" onClick={onRequestPermission} leadingIcon={<Compass size={16} />}>
          {t('qibla.enableCompass')}
        </Button>
      )}

      {support === 'unsupported' && (
        <Typography variant="caption" muted className={styles.fallbackNote}>
          {t('qibla.fallbackNote', { bearing: qibla.bearing.toFixed(0) })}
        </Typography>
      )}

      {support === 'unknown' && (
        <span className={styles.detecting}>
          <Loader2 size={14} className={styles.spin} /> {t('qibla.checkingSupport')}
        </span>
      )}
    </div>
  );
}
