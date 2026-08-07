import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import Button from 'components/ui/Button';
import Typography from 'components/ui/Typography';
import type { AudioEngine } from 'features/immersiveRecitation/hooks/useAudioEngine';
import { useImmersiveRecitationStore } from 'stores/immersiveRecitationStore';
import { formatTime } from 'utils/formatters';
import { ACTIVE_RECITER } from 'config/recitationConfig';
import {
  toDisplayDuration,
  toDisplaySeconds,
} from 'features/immersiveRecitation/utils/timeline';
import useTranslation from 'hooks/useTranslation';
import styles from './PlaybackControls.module.css';

export interface PlaybackControlsProps {
  /** Imperative audio engine (Phase 8); all transport actions go through it. */
  engine: AudioEngine;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

/**
 * Phase 9 "PlaybackControls" — the immersive player's transport bar.
 *
 * The time readout is the NORMALIZED timeline: `currentTime`/`duration` are
 * real audio seconds, but the user sees display seconds (real minus the
 * melodic intro) so the clock starts at 0:00 and the remaining countdown
 * matches the visible seek bar. The audio element always starts 17s in (see
 * engine) — this bar only reports what the user perceives.
 *
 * Every action dispatches through the store (single source of state) while the
 * native transport is driven by `engine`. No local state here: everything is
 * read straight from `useImmersiveRecitationStore`.
 */
export default function PlaybackControls({
  engine,
  isFullscreen,
  onToggleFullscreen,
}: PlaybackControlsProps) {
  const { t } = useTranslation();
  const isPlaying = useImmersiveRecitationStore((state) => state.isPlaying);
  const currentTime = useImmersiveRecitationStore((state) => state.currentTime);
  const duration = useImmersiveRecitationStore((state) => state.duration);
  const volume = useImmersiveRecitationStore((state) => state.volume);
  const isMuted = useImmersiveRecitationStore((state) => state.isMuted);

  // Display timeline (intro hidden): elapsed and remaining shown to the user.
  const displayTime = toDisplaySeconds(currentTime, ACTIVE_RECITER.introSeconds);
  const displayMax = toDisplayDuration(duration, ACTIVE_RECITER.introSeconds);
  const remaining = Number.isFinite(duration) ? displayMax - displayTime : 0;

  return (
    <div className={styles.controls}>
      <div className={styles.row}>
        <Button
          variant="primary"
          size="lg"
          onClick={() => (isPlaying ? engine.pause() : engine.play())}
          leadingIcon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
          aria-label={isPlaying ? t('common.pause') : t('common.play')}
        >
          {isPlaying ? t('common.pause') : t('common.play')}
        </Button>

        <Button
          variant="secondary"
          onClick={engine.replay}
          leadingIcon={<RotateCcw size={16} />}
          aria-label={t('common.replay')}
        >
          {t('common.replay')}
        </Button>

        <Typography variant="body" className={styles.time}>
          {formatTime(displayTime)} / –{formatTime(remaining)}
        </Typography>
      </div>

      <div className={styles.row}>
        <label className={styles.label}>
          {t('common.volume')}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(event) => engine.setVolume(Number(event.target.value))}
            aria-label={t('common.volume')}
          />
        </label>

        <Button
          variant="secondary"
          onClick={() => engine.setMuted(!isMuted)}
          leadingIcon={isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          aria-label={isMuted ? t('common.unmute') : t('common.mute')}
        >
          {isMuted ? t('common.unmute') : t('common.mute')}
        </Button>

        <Button
          variant="secondary"
          onClick={onToggleFullscreen}
          leadingIcon={isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          aria-label={t('common.fullscreen')}
        >
          {t('common.fullscreen')}
        </Button>
      </div>
    </div>
  );
}