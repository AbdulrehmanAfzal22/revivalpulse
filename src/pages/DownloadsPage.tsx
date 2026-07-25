import { useEffect, useState } from 'react';
import { Check, Download, Loader2, Trash2 } from 'lucide-react';
import { SURAHS } from 'data/quran/surahs';
import { RECITERS } from 'constants/reciters';
import { useDownloadsStore } from 'stores/downloadsStore';
import Typography from 'components/ui/Typography';
import PillGroup from 'components/ui/PillGroup';
import Button from 'components/ui/Button';
import useTranslation from 'hooks/useTranslation';
import styles from './DownloadsPage.module.css';

export default function DownloadsPage() {
  const [reciterId, setReciterId] = useState(RECITERS[0]?.id ?? '');
  const downloads = useDownloadsStore((state) => state.downloads);
  const startDownload = useDownloadsStore((state) => state.startDownload);
  const remove = useDownloadsStore((state) => state.remove);
  const refresh = useDownloadsStore((state) => state.refresh);
  const { t, tp } = useTranslation();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className={styles.page}>
      <Typography variant="h2">{t('downloads.title')}</Typography>
      <Typography variant="body" muted>
        {t('downloads.description')}
      </Typography>

      <PillGroup
        options={RECITERS.map((reciter) => ({ id: reciter.id, label: reciter.name }))}
        value={reciterId}
        onChange={setReciterId}
      />

      <ul className={styles.list}>
        {SURAHS.map((surah) => {
          const download = downloads[`${reciterId}:${surah.id}`];
          const status = download?.status ?? 'idle';

          return (
            <li key={surah.id} className={styles.row}>
              <span className={styles.number}>{surah.id}</span>
              <span className={styles.rowText}>
                <span className={styles.rowTitle}>{surah.nameSimple}</span>
                <span className={styles.rowSubtitle}>{tp('quran.versesCount', surah.versesCount)}</span>
              </span>

              {status === 'downloaded' && (
                <>
                  <span className={styles.downloadedBadge}>
                    <Check size={14} /> {t('downloads.downloaded')}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void remove(reciterId, surah.id)}
                    aria-label={t('downloads.removeDownloadedAudio', { name: surah.nameSimple })}
                    leadingIcon={<Trash2 size={14} />}
                  />
                </>
              )}

              {status === 'downloading' && download && (
                <span className={styles.downloadingBadge}>
                  <Loader2 size={14} className={styles.spin} />
                  {download.completedFiles}/{download.totalFiles}
                </span>
              )}

              {(status === 'idle' || status === 'error') && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => void startDownload(reciterId, surah.id)}
                  leadingIcon={<Download size={14} />}
                >
                  {status === 'error' ? t('downloads.retry') : t('downloads.download')}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
