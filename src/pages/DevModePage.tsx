import { useEffect, useState } from 'react';
import { CheckCircle2, RotateCw, Trash2, XCircle } from 'lucide-react';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Switch from 'components/ui/Switch';
import Skeleton from 'components/ui/Skeleton';
import { useDevModeStore } from 'stores/devModeStore';
import { runApiDiagnostics } from 'features/devMode/services/apiDiagnostics';
import type { ApiDiagnosticResult } from 'features/devMode/services/apiDiagnostics';
import { runDatasetValidation } from 'features/devMode/services/datasetValidation';
import type { DatasetCheck } from 'features/devMode/services/datasetValidation';
import { getAudioCacheStats } from 'services/audioCache';
import { getSurahAudioCacheStats } from 'services/surahAudioCache';
import styles from './DevModePage.module.css';

function useAsyncRunner<T>(runner: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  async function run() {
    setIsRunning(true);
    try {
      setData(await runner());
    } finally {
      setIsRunning(false);
    }
  }

  return { data, isRunning, run };
}

function ResultRow({ passed, label, detail }: { passed: boolean; label: string; detail: string }) {
  return (
    <div className={styles.resultRow}>
      {passed ? <CheckCircle2 size={16} className={styles.pass} /> : <XCircle size={16} className={styles.fail} />}
      <Typography variant="body">{label}</Typography>
      <Typography variant="caption" muted>
        {detail}
      </Typography>
    </div>
  );
}

export default function DevModePage() {
  const flags = useDevModeStore((state) => state.flags);
  const setFlag = useDevModeStore((state) => state.setFlag);
  const errorLog = useDevModeStore((state) => state.errorLog);
  const clearErrorLog = useDevModeStore((state) => state.clearErrorLog);
  const webVitals = useDevModeStore((state) => state.webVitals);

  const api = useAsyncRunner<ApiDiagnosticResult[]>(runApiDiagnostics);
  const dataset = useAsyncRunner<DatasetCheck[]>(runDatasetValidation);

  const [storageEstimate, setStorageEstimate] = useState<StorageEstimate | null>(null);
  const [wordAudioStats, setWordAudioStats] = useState<{ count: number; maxEntries: number } | null>(null);
  const [surahAudioStats, setSurahAudioStats] = useState<{ fileCount: number; downloadCount: number } | null>(null);

  useEffect(() => {
    if ('storage' in navigator && navigator.storage.estimate) {
      void navigator.storage.estimate().then(setStorageEstimate);
    }
    void getAudioCacheStats().then(setWordAudioStats);
    void getSurahAudioCacheStats().then(setSurahAudioStats);
  }, []);

  return (
    <div className={styles.page}>
      <Typography variant="h2">Developer Mode</Typography>
      <Typography variant="caption" muted>
        Not linked anywhere in the app's navigation — diagnostics and testing tools only.
      </Typography>

      <section className={styles.section}>
        <Typography variant="h4" as="h2" className={styles.sectionTitle}>
          Feature flags
        </Typography>
        <Card className={styles.card}>
          <div className={styles.row}>
            <Typography variant="body">Force offline</Typography>
            <Switch checked={flags.forceOffline} onChange={(value) => setFlag('forceOffline', value)} label="Force offline" />
          </div>
          <div className={styles.row}>
            <Typography variant="body">Force RTL</Typography>
            <Switch checked={flags.forceRtl} onChange={(value) => setFlag('forceRtl', value)} label="Force RTL" />
          </div>
          <div className={styles.row}>
            <div>
              <Typography variant="body">Mock data mode</Typography>
              <Typography variant="caption" muted>
                Prayer times return fixed sample data instead of a live fetch
              </Typography>
            </div>
            <Switch checked={flags.mockDataMode} onChange={(value) => setFlag('mockDataMode', value)} label="Mock data mode" />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Typography variant="h4" as="h2">
            API diagnostics
          </Typography>
          <Button variant="secondary" size="sm" onClick={() => void api.run()} disabled={api.isRunning} leadingIcon={<RotateCw size={14} />}>
            {api.isRunning ? 'Checking…' : 'Run'}
          </Button>
        </div>
        <Card className={styles.card}>
          {api.isRunning && <Skeleton variant="text" count={4} />}
          {api.data?.map((result) => (
            <div key={result.name} className={styles.resultRow}>
              {result.status === 'ok' ? <CheckCircle2 size={16} className={styles.pass} /> : <XCircle size={16} className={styles.fail} />}
              <Typography variant="body">{result.name}</Typography>
              <Typography variant="caption" muted>
                {result.message}
                {result.latencyMs !== null ? ` · ${result.latencyMs}ms` : ''}
              </Typography>
            </div>
          ))}
          {!api.data && !api.isRunning && (
            <Typography variant="caption" muted>
              Not run yet.
            </Typography>
          )}
        </Card>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Typography variant="h4" as="h2">
            Dataset validation
          </Typography>
          <Button variant="secondary" size="sm" onClick={() => void dataset.run()} disabled={dataset.isRunning} leadingIcon={<RotateCw size={14} />}>
            {dataset.isRunning ? 'Checking…' : 'Run'}
          </Button>
        </div>
        <Card className={styles.card}>
          {dataset.isRunning && <Skeleton variant="text" count={6} />}
          {dataset.data?.map((check) => <ResultRow key={check.label} passed={check.passed} label={check.label} detail={check.detail} />)}
          {!dataset.data && !dataset.isRunning && (
            <Typography variant="caption" muted>
              Not run yet.
            </Typography>
          )}
        </Card>
      </section>

      <section className={styles.section}>
        <Typography variant="h4" as="h2" className={styles.sectionTitle}>
          Audio cache status
        </Typography>
        <Card className={styles.card}>
          <div className={styles.row}>
            <Typography variant="body">Word audio (auto-evicting)</Typography>
            <Typography variant="caption" muted>
              {wordAudioStats ? `${wordAudioStats.count} / ${wordAudioStats.maxEntries} cached` : 'Loading…'}
            </Typography>
          </div>
          <div className={styles.row}>
            <Typography variant="body">Downloaded surah audio</Typography>
            <Typography variant="caption" muted>
              {surahAudioStats ? `${surahAudioStats.downloadCount} surahs, ${surahAudioStats.fileCount} files` : 'Loading…'}
            </Typography>
          </div>
          <div className={styles.row}>
            <Typography variant="body">Total storage usage</Typography>
            <Typography variant="caption" muted>
              {storageEstimate?.usage !== undefined
                ? `${(storageEstimate.usage / 1024 / 1024).toFixed(1)} MB / ${((storageEstimate.quota ?? 0) / 1024 / 1024).toFixed(0)} MB`
                : 'Unavailable in this browser'}
            </Typography>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <Typography variant="h4" as="h2" className={styles.sectionTitle}>
          Performance metrics (this page load)
        </Typography>
        <Card className={styles.card}>
          {Object.keys(webVitals).length === 0 && (
            <Typography variant="caption" muted>
              No metrics reported yet — some (like CLS) only report once you interact with or leave the page.
            </Typography>
          )}
          {Object.values(webVitals).map((metric) => (
            <div key={metric.id} className={styles.row}>
              <Typography variant="body">{metric.name}</Typography>
              <Typography variant="caption" muted>
                {metric.value.toFixed(2)}
              </Typography>
            </div>
          ))}
        </Card>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Typography variant="h4" as="h2">
            Error log ({errorLog.length})
          </Typography>
          <Button variant="ghost" size="sm" onClick={clearErrorLog} leadingIcon={<Trash2 size={14} />}>
            Clear
          </Button>
        </div>
        <Card className={styles.card}>
          {errorLog.length === 0 && (
            <Typography variant="caption" muted>
              No errors logged this session (or ever, if this is a fresh browser profile).
            </Typography>
          )}
          {errorLog.map((entry) => (
            <div key={entry.id} className={styles.errorEntry}>
              <Typography variant="caption" muted>
                {new Date(entry.timestamp).toLocaleString()} · {entry.source}
              </Typography>
              <Typography variant="body">{entry.message}</Typography>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
