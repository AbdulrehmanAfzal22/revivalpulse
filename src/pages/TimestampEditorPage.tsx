import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Download, Eraser, Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import Button from 'components/ui/Button';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import useDivineNames from 'features/namesOfAllah/hooks/useDivineNames';
import { ACTIVE_RECITER, validateTimestampEntries } from 'config/recitationConfig';
import type { TimestampEntry } from 'types/immersiveRecitation.types';
import styles from './TimestampEditorPage.module.css';

const NAME_COUNT = 99;
const EMPTY_ENTRIES = Array.from({ length: NAME_COUNT }, () => null) as (number | null)[];

/**
 * Phase 4 — DEV-ONLY timestamp capture helper.
 *
 * Plays the ACTIVE_RECITER audio with native transport controls. The melodic
 * nasheed opens with `introSeconds` (17) of instrumental material, so playback
 * AUTOMATICALLY starts from the intro: pressing Play (or the dedicated
 * "Restart from intro" button) seeks the element to real second 17 before
 * playback begins, matching the immersive player's normalized timeline. As each
 * name is called out you press Enter (or tap the big button) while the audio
 * keeps playing; the CURRENT position in REAL file seconds is snapped into the
 * next uncaptured slot and the row advances. Backspace undoes the last capture
 * so you can re-capture after seeking. Export produces JSON matching
 * data/namesTimestamps.json (validated — ascending real seconds, 99 rows) —
 * then paste/overwrite it over the PLACEHOLDER file and the synchronizer picks
 * it up immediately.
 *
 * Route + import are gated out of production (see AppRoutes.tsx).
 */
export default function TimestampEditorPage() {
  const { data: divineNames } = useDivineNames();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // True once the intro has been applied for the current pass, so a fresh play
  // never restarts from literal 0 (the 17s instrumental opening).
  const introSeekedRef = useRef(false);

  const [captures, setCaptures] = useState<(number | null)[]>(EMPTY_ENTRIES);
  const [running, setRunning] = useState(false);
  // Live playhead for the big clock — updated from the element every frame
  // (rAF) while playing so timing by ear is accurate to a tenth of a second.
  const [displayTime, setDisplayTime] = useState(0);

  const firstFreeIndex = captures.findIndex((value) => value === null);
  const currentName =
    firstFreeIndex >= 0 ? divineNames?.[firstFreeIndex] : undefined;

  const entries: TimestampEntry[] = captures.map((captured, index) => ({
    id: String(index + 1).padStart(2, '0'),
    // Uncaptured slots stay at 0; validation below flags incomplete files so
    // you export only finished work.
    timestampSeconds: captured ?? 0,
  }));
  const problems = validateTimestampEntries(entries);
  const capturedCount = captures.filter((value) => value !== null).length;
  const jsonOutput = useMemo(
    () => `${JSON.stringify(entries, null, 2)}\n`,
    [entries]
  );

  const capture = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCaptures((previous) => {
      const next = [...previous];
      const slot = next.findIndex((value) => value === null);
      if (slot === -1) return previous;
      next[slot] = audio.currentTime;
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setCaptures((previous) => {
      const next = [...previous];
      for (let i = next.length - 1; i >= 0; i -= 1) {
        if (next[i] !== null) {
          next[i] = null;
          return next;
        }
      }
      return previous;
    });
  }, []);

  const reset = useCallback(() => {
    setCaptures([...EMPTY_ENTRIES]);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const onPlay = () => {
      // Covers the NATIVE transport controls (they bypass togglePlay): if this
      // is a fresh pass that never reached the intro, land on it as soon as
      // playback starts so captures never fall inside the instrumental opening.
      if (!introSeekedRef.current && audio.currentTime < ACTIVE_RECITER.introSeconds) {
        introSeekedRef.current = true;
        audio.currentTime = ACTIVE_RECITER.introSeconds;
      }
      setRunning(true);
    };
    const onPause = () => setRunning(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  // Smooth 10 Hz+ clock: read the playhead every animation frame while the
  // audio is playing (falls back to `timeupdate` cadence when paused/seeked).
  useEffect(() => {
    if (!running) return undefined;
    let frame = 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio) setDisplayTime(audio.currentTime);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const formatTenths = useCallback((totalSeconds: number) => {
    const whole = Math.max(0, Math.floor(totalSeconds));
    const tenths = Math.max(0, Math.floor((totalSeconds - whole) * 10));
    const h = Math.floor(whole / 3600);
    const m = Math.floor((whole % 3600) / 60);
    const s = whole % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}.${tenths}` : `${mm}:${ss}.${tenths}`;
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        capture();
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        undo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [capture, undo]);

  const download = useCallback(() => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'namesTimestamps.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }, [jsonOutput]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = jsonOutput;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }, [jsonOutput]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      // Fresh pass: never let the instrumental opening be heard — seek to the
      // melodic intro (real seconds) in the same gesture, exactly like the
      // immersive engine does, before play().
      if (!introSeekedRef.current && audio.currentTime < ACTIVE_RECITER.introSeconds) {
        audio.currentTime = ACTIVE_RECITER.introSeconds;
      }
      introSeekedRef.current = true;
      void audio.play();
    } else {
      audio.pause();
    }
  }, []);

  const restartFromIntro = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    introSeekedRef.current = true;
    audio.currentTime = ACTIVE_RECITER.introSeconds;
    void audio.play();
  }, []);

  return (
    <main className={styles.page}>
      <Card className={styles.card}>
        <Typography variant="h3">Timestamp Editor — {ACTIVE_RECITER.id}</Typography>
        <Typography variant="body" muted>
          DEV ONLY. Audio: {ACTIVE_RECITER.audioUrl}
        </Typography>

        <audio
          ref={audioRef}
          src={ACTIVE_RECITER.audioUrl}
          preload="metadata"
          controls
          className={styles.audio}
        />

        <div className={styles.clockRow}>
          <Typography variant="body" muted>
            Playhead (REAL file seconds) — capture on the first syllable
          </Typography>
          <div className={styles.clock} data-running={running}>
            {formatTenths(displayTime)}
          </div>
        </div>

        <Typography variant="body" muted className={styles.hint}>
          This nasheed has a {formatTenths(ACTIVE_RECITER.introSeconds)} instrumental intro. Playback
          always starts there (not 0:00); captured values are raw file seconds,
          ready for namesTimestamps.json.
        </Typography>

        <Card className={styles.currentRow} elevation="raised">
          {currentName ? (
            <>
              <Typography variant="body">
                <strong>
                  {String(currentName.number).padStart(2, '0')} — {currentName.transliteration}
                </strong>
              </Typography>
              <Typography variant="body" muted>
                {currentName.arabic} · {currentName.meaning}
              </Typography>
            </>
          ) : (
            <Typography variant="body">All 99 names captured — export below.</Typography>
          )}
        </Card>

        <div className={styles.actions}>
          <Button onClick={capture} leadingIcon={<Play size={16} />} disabled={firstFreeIndex === -1}>
            Capture at {formatTenths(displayTime)}
          </Button>
          <Button variant="secondary" onClick={togglePlay} leadingIcon={running ? <Pause size={16} /> : <Play size={16} />}>
            {running ? 'Pause' : 'Play'}
          </Button>
          <Button variant="secondary" onClick={restartFromIntro} leadingIcon={<SkipForward size={16} />}>
            Restart from intro ({formatTenths(ACTIVE_RECITER.introSeconds)})
          </Button>
          <Button variant="secondary" onClick={undo} leadingIcon={<RotateCcw size={16} />}>
            Undo (Backspace)
          </Button>
          <Button variant="ghost" onClick={reset} leadingIcon={<Eraser size={16} />}>
            Reset
          </Button>
        </div>

        <div className={styles.meta}>
          <Typography variant="body" muted>
            Captured {capturedCount} / {NAME_COUNT}
          </Typography>
          {problems.length === 0 ? (
            <Typography variant="body" className={styles.ok}>
              Valid: 99 rows, ascending, ready to export.
            </Typography>
          ) : (
            <>
              <Typography variant="body" className={styles.error}>
                {problems.length} issue{problems.length === 1 ? '' : 's'} to fix:
              </Typography>
              <ul className={styles.problems}>
                {problems.map((problem) => (
                  <li key={problem}>
                    <Typography variant="body" muted>
                      {problem}
                    </Typography>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <Button onClick={copy} leadingIcon={<Copy size={16} />}>
            Copy JSON
          </Button>
          <Button variant="secondary" onClick={download} leadingIcon={<Download size={16} />}>
            Download namesTimestamps.json
          </Button>
        </div>
      </Card>
    </main>
  );
}
