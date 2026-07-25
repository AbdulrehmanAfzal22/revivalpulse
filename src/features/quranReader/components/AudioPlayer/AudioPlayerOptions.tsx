import { useEffect } from 'react';
import { Check, Download } from 'lucide-react';
import Dialog from 'components/ui/Dialog';
import Typography from 'components/ui/Typography';
import PillGroup from 'components/ui/PillGroup';
import Button from 'components/ui/Button';
import { usePlaybackStore } from 'stores/playbackStore';
import { useDownloadsStore } from 'stores/downloadsStore';
import * as engine from 'features/quranReader/services/playbackEngine';
import { RECITERS, getReciterById } from 'constants/reciters';
import { SURAHS } from 'data/quran/surahs';
import type { LoopMode } from 'types/audioPlayer.types';
import useTranslation from 'hooks/useTranslation';
import styles from './AudioPlayerOptions.module.css';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export interface AudioPlayerOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  surahId: number;
}

export default function AudioPlayerOptions({ isOpen, onClose, surahId }: AudioPlayerOptionsProps) {
  const reciterId = usePlaybackStore((state) => state.reciterId);
  const loopMode = usePlaybackStore((state) => state.loopMode);
  const range = usePlaybackStore((state) => state.range);
  const autoplayEnabled = usePlaybackStore((state) => state.autoplayEnabled);
  const playbackSpeed = usePlaybackStore((state) => state.playbackSpeed);
  const setAutoplayEnabled = usePlaybackStore((state) => state.setAutoplayEnabled);

  const downloads = useDownloadsStore((state) => state.downloads);
  const startDownload = useDownloadsStore((state) => state.startDownload);
  const refresh = useDownloadsStore((state) => state.refresh);
  const { t } = useTranslation();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const surah = SURAHS.find((item) => item.id === surahId);
  const reciter = getReciterById(reciterId);
  const download = downloads[`${reciterId}:${surahId}`];

  const LOOP_MODES: { id: LoopMode; label: string }[] = [
    { id: 'off', label: t('quran.loopOff') },
    { id: 'ayah', label: t('quran.loopAyah') },
    { id: 'range', label: t('quran.loopRange') },
    { id: 'surah', label: t('quran.loopSurah') },
  ];

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t('quran.playbackOptions')}>
      <section className={styles.section}>
        <Typography variant="caption" muted className={styles.label}>
          {t('settings.reciter')}
        </Typography>
        <PillGroup
          options={RECITERS.map((item) => ({ id: item.id, label: item.name }))}
          value={reciterId}
          onChange={(id) => engine.setReciter(id)}
        />
        {reciter && !reciter.supportsWordSync && (
          <Typography variant="caption" muted className={styles.note}>
            {t('quran.wordSyncNote')}
          </Typography>
        )}
      </section>

      <section className={styles.section}>
        <Typography variant="caption" muted className={styles.label}>
          {t('quran.speed')}
        </Typography>
        <PillGroup
          options={SPEEDS.map((speed) => ({ id: String(speed), label: `${speed}x` }))}
          value={String(playbackSpeed)}
          onChange={(id) => engine.setSpeed(Number(id))}
        />
      </section>

      <section className={styles.section}>
        <Typography variant="caption" muted className={styles.label}>
          {t('quran.loop')}
        </Typography>
        <PillGroup
          options={LOOP_MODES}
          value={loopMode}
          onChange={(id) => engine.setLoopMode(id as LoopMode)}
        />
        {loopMode === 'range' && surah && (
          <div className={styles.rangeRow}>
            <label className={styles.rangeField}>
              {t('quran.from')}
              <input
                type="number"
                min={1}
                max={surah.versesCount}
                value={range?.startAyah ?? 1}
                onChange={(event) =>
                  engine.setRange({
                    startAyah: Number(event.target.value),
                    endAyah: range?.endAyah ?? surah.versesCount,
                  })
                }
              />
            </label>
            <label className={styles.rangeField}>
              {t('quran.to')}
              <input
                type="number"
                min={1}
                max={surah.versesCount}
                value={range?.endAyah ?? surah.versesCount}
                onChange={(event) =>
                  engine.setRange({
                    startAyah: range?.startAyah ?? 1,
                    endAyah: Number(event.target.value),
                  })
                }
              />
            </label>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <label className={styles.toggleRow}>
          <span>{t('quran.autoplayNextAyah')}</span>
          <input
            type="checkbox"
            checked={autoplayEnabled}
            onChange={(event) => setAutoplayEnabled(event.target.checked)}
          />
        </label>
      </section>

      <section className={styles.section}>
        <Button
          variant="secondary"
          disabled={download?.status === 'downloading' || download?.status === 'downloaded'}
          onClick={() => void startDownload(reciterId, surahId)}
          leadingIcon={download?.status === 'downloaded' ? <Check size={16} /> : <Download size={16} />}
        >
          {download?.status === 'downloaded'
            ? t('quran.downloaded')
            : download?.status === 'downloading'
              ? t('quran.downloading', { completed: download.completedFiles, total: download.totalFiles })
              : t('quran.downloadForOffline')}
        </Button>
      </section>
    </Dialog>
  );
}
