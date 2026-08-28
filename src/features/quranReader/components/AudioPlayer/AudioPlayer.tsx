import { Loader2, Pause, Play, SkipBack, SkipForward, X } from 'lucide-react';
import type { CSSProperties } from 'react';
import { usePlaybackStore } from 'stores/playbackStore';
import * as engine from 'features/quranReader/services/playbackEngine';
import { getReciterById } from 'constants/reciters';
import { SURAHS } from 'data/quran/surahs';
import Button from 'components/ui/Button';
import useTranslation from 'hooks/useTranslation';
import styles from './AudioPlayer.module.css';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export default function AudioPlayer() {
  const surahId = usePlaybackStore((state) => state.surahId);
  const source = usePlaybackStore((state) => state.source);
  const isPlaying = usePlaybackStore((state) => state.isPlaying);
  const isLoading = usePlaybackStore((state) => state.isLoading);
  const verseKey = usePlaybackStore((state) => state.verseKey);
  const currentTime = usePlaybackStore((state) => state.currentTime);
  const duration = usePlaybackStore((state) => state.duration);
  const reciterId = usePlaybackStore((state) => state.reciterId);
  const { t } = useTranslation();

  const surah = SURAHS.find((item) => item.id === surahId);
  const reciter = getReciterById(reciterId);
  const ayahNumber = verseKey ? Number(verseKey.split(':')[1]) : null;

  if (source !== 'surah' || !surah || !reciter) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.progressRow}>
        <span className={styles.time}>{formatTime(currentTime)}</span>
        <input
          type="range"
          className={styles.progress}
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          style={{ '--progress': `${duration ? (currentTime / duration) * 100 : 0}%` } as CSSProperties}
          onChange={(event) => engine.seekToTime(Number(event.target.value))}
          aria-label={t('quran.seek')}
        />
        <span className={styles.time}>{formatTime(duration)}</span>
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.nowPlaying}>
          <span className={styles.surahName}>{surah.nameSimple}</span>
          {ayahNumber !== null && <span className={styles.ayahLabel}>{t('quran.ayahLabel', { number: ayahNumber })}</span>}
          <span className={styles.reciterName}>{reciter.name}</span>
        </div>

        <div className={styles.transport}>
          <Button
            variant="icon"
            onClick={() => void engine.previous()}
            aria-label={t('quran.previousAyah')}
            leadingIcon={<SkipBack size={16} />}
          />
          <Button
            variant="icon"
            onClick={() => (isPlaying ? engine.pause() : engine.resume())}
            aria-label={isPlaying ? t('quran.pause') : t('quran.play')}
            leadingIcon={
              isLoading ? (
                <Loader2 size={18} className={styles.spin} />
              ) : isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} />
              )
            }
          />
          <Button
            variant="icon"
            onClick={() => void engine.next()}
            aria-label={t('quran.nextAyah')}
            leadingIcon={<SkipForward size={16} />}
          />
        </div>

        <div className={styles.actions}>
          <Button variant="icon" onClick={() => engine.stop()} aria-label={t('quran.closePlayer')} leadingIcon={<X size={16} />} />
        </div>
      </div>
    </div>
  );
}
