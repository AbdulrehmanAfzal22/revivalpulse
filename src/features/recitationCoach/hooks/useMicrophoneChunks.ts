import { useEffect, useRef } from 'react';
import { createLogger } from 'services/logger';

/**
 * Phase 10 instrumentation note: every `trace.debug(...)` call in this file
 * is a pure diagnostic addition — logging only, zero behavior change. No
 * conditional, return value, timing, or control-flow was altered to add
 * these. Namespaced separately from the feature's ordinary `logger` so this
 * verbose trace output is easy to isolate/filter in the console.
 */
const trace = createLogger('mic-trace');

/** Whisper's ONNX export expects 16kHz mono input. */
const SAMPLE_RATE = 16000;
/**
 * 1.5s balances latency against accuracy: short enough to noticeably cut
 * the delay between speaking and highlighting, but not so short that
 * Whisper loses the audio context it needs — going much below this (e.g.
 * under ~1s) starts visibly hurting recognition quality since the model
 * has less surrounding context per word.
 */
const CHUNK_DURATION_S = 1.5;
/** Repeats the tail of each chunk at the start of the next one, in raw audio, so a word spoken right at a chunk boundary is never split mid-word for the model — see transcriptStitcher for the corresponding text-side dedup. Kept at the same ~20% ratio as before. */
const OVERLAP_DURATION_S = 0.3;

const CHUNK_SAMPLES = Math.round(CHUNK_DURATION_S * SAMPLE_RATE);
const OVERLAP_SAMPLES = Math.round(OVERLAP_DURATION_S * SAMPLE_RATE);

/** How long with zero chunks produced before the instrumentation flags it as suspicious — purely diagnostic, does not affect capture in any way. */
const NO_CHUNK_WATCHDOG_MS = 5000;

function mergeFloat32(chunks: Float32Array[], totalLength: number): Float32Array {
  const result = new Float32Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

export interface UseMicrophoneChunksOptions {
  enabled: boolean;
  onChunk: (chunk: Float32Array) => void;
  onError?: (error: Error) => void;
}

/**
 * Captures the microphone in rolling ~2.5s chunks (with a 0.5s audio
 * overlap between consecutive chunks) instead of one long recording, so
 * the first chunk's transcript — and therefore surah detection — is
 * available within a few seconds rather than only at the end of a
 * recording.
 *
 * Uses a ScriptProcessorNode rather than an AudioWorklet: it's deprecated
 * but universally supported, and since this only buffers raw samples
 * (no DSP), the "runs on the main thread" downside is negligible — the
 * actual transcription work happens in the Whisper worker, not here.
 */
export default function useMicrophoneChunks({ enabled, onChunk, onError }: UseMicrophoneChunksOptions): void {
  const onChunkRef = useRef(onChunk);
  onChunkRef.current = onChunk;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    if (!enabled) {
      trace.debug('effect skipped — enabled=false');
      return;
    }

    trace.debug('effect starting', {
      sampleRateRequested: SAMPLE_RATE,
      chunkDurationS: CHUNK_DURATION_S,
      overlapDurationS: OVERLAP_DURATION_S,
      chunkSamples: CHUNK_SAMPLES,
      overlapSamples: OVERLAP_SAMPLES,
      timestamp: Date.now(),
    });

    let cancelled = false;
    let stream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let processor: ScriptProcessorNode | null = null;
    let silentGain: GainNode | null = null;
    let pending: Float32Array[] = [];
    let pendingLength = 0;

    // --- Phase 10 instrumentation state (diagnostic only) ---
    let chunkCount = 0;
    let lastChunkAt: number | null = null;
    const effectStartedAt = Date.now();
    let noChunkWatchdog: number | null = null;

    function armNoChunkWatchdog(): void {
      if (noChunkWatchdog !== null) window.clearTimeout(noChunkWatchdog);
      noChunkWatchdog = window.setTimeout(() => {
        if (chunkCount === 0) {
          trace.error('ERROR: No microphone chunks received.', {
            msSinceCaptureStarted: Date.now() - effectStartedAt,
            timestamp: Date.now(),
          });
        }
      }, NO_CHUNK_WATCHDOG_MS);
    }

    async function start(): Promise<void> {
      trace.debug('permission requested', {
        constraints: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
        timestamp: Date.now(),
      });

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
        });

        if (cancelled) {
          trace.debug('permission granted, but effect already cancelled before use — stopping tracks immediately', {
            timestamp: Date.now(),
          });
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const [primaryTrack] = stream.getAudioTracks();
        // getSettings() is diagnostic-only here — guarded so that a track
        // which doesn't implement it (older browsers, test doubles) can
        // never turn this logging addition into a thrown exception that
        // aborts the rest of start().
        let settings: MediaTrackSettings | undefined;
        try {
          settings = primaryTrack?.getSettings();
        } catch {
          settings = undefined;
        }
        trace.debug('permission granted', {
          selectedDeviceId: settings?.deviceId ?? 'unknown',
          actualSampleRate: settings?.sampleRate ?? 'unknown',
          // channelCount is a real MediaTrackSettings field per spec, just
          // missing from this project's TS DOM lib — cast is type-only.
          actualChannelCount: (settings as (MediaTrackSettings & { channelCount?: number }) | undefined)?.channelCount ?? 'unknown',
          trackLabel: primaryTrack?.label || '(label unavailable — permission not yet persisted, or browser policy)',
          trackReadyState: primaryTrack?.readyState ?? 'unknown',
          timestamp: Date.now(),
        });

        // The OS/browser can stop the track out from under us mid-session —
        // the device is unplugged, the user revokes the permission, or
        // another app takes exclusive access to the microphone. Without
        // this, the pipeline would just go silently deaf: no more chunks,
        // no error, nothing telling the user (or useRecitationSession)
        // anything went wrong.
        stream.getAudioTracks().forEach((track) => {
          track.addEventListener('ended', () => {
            trace.debug('audio track ended event fired', { cancelled, timestamp: Date.now() });
            if (cancelled) return;
            onErrorRef.current?.(new Error('Microphone disconnected'));
          });
        });

        audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
        trace.debug('AudioContext created', {
          requestedSampleRate: SAMPLE_RATE,
          actualSampleRate: audioContext.sampleRate,
          initialState: audioContext.state,
          timestamp: Date.now(),
        });

        // A running context can be forced into 'suspended' by the browser —
        // most commonly an OS-level interruption on mobile (an incoming
        // call, backgrounding on iOS Safari) — without always resuming it
        // automatically once the interruption ends. Reclaiming it here
        // means a backgrounded/interrupted session can keep listening
        // instead of silently stalling until the user notices and restarts.
        audioContext.addEventListener('statechange', () => {
          trace.debug('AudioContext statechange', { newState: audioContext?.state, timestamp: Date.now() });
          if (cancelled || audioContext?.state !== 'suspended') return;
          audioContext.resume().catch(() => {
            onErrorRef.current?.(new Error('Microphone audio was interrupted and could not resume'));
          });
        });
        source = audioContext.createMediaStreamSource(stream);
        processor = audioContext.createScriptProcessor(4096, 1, 1);

        // ScriptProcessorNode only reliably fires onaudioprocess once
        // connected through to a destination in some browsers — routed
        // through a zero-gain node so the raw mic input is never audible.
        silentGain = audioContext.createGain();
        silentGain.gain.value = 0;

        armNoChunkWatchdog();

        processor.onaudioprocess = (event) => {
          const input = event.inputBuffer.getChannelData(0);
          const copy = new Float32Array(input);
          pending.push(copy);
          pendingLength += copy.length;

          if (pendingLength >= CHUNK_SAMPLES) {
            const merged = mergeFloat32(pending, pendingLength);
            const chunkToEmit = merged.slice(0, CHUNK_SAMPLES);

            chunkCount += 1;
            const now = Date.now();
            const gapSincePrevious = lastChunkAt !== null ? now - lastChunkAt : now - effectStartedAt;
            lastChunkAt = now;
            trace.debug('chunk produced', {
              chunkNumber: chunkCount,
              chunkLengthSamples: chunkToEmit.length,
              chunkDurationS: chunkToEmit.length / SAMPLE_RATE,
              msSincePreviousChunk: gapSincePrevious,
              timestamp: now,
            });

            onChunkRef.current(chunkToEmit);

            const overlapStart = CHUNK_SAMPLES - OVERLAP_SAMPLES;
            const remainder = merged.slice(overlapStart);
            pending = [remainder];
            pendingLength = remainder.length;
          }
        };

        source.connect(processor);
        processor.connect(silentGain);
        silentGain.connect(audioContext.destination);

        trace.debug('audio graph connected — capture is live', { timestamp: Date.now() });
      } catch (error) {
        trace.error('permission/setup failed', {
          error: error instanceof Error ? { name: error.name, message: error.message } : String(error),
          timestamp: Date.now(),
        });
        onErrorRef.current?.(error instanceof Error ? error : new Error(String(error)));
      }
    }

    void start();

    return () => {
      trace.debug('effect cleanup', {
        totalChunksProducedThisSession: chunkCount,
        timestamp: Date.now(),
      });
      cancelled = true;
      if (noChunkWatchdog !== null) window.clearTimeout(noChunkWatchdog);
      processor?.disconnect();
      source?.disconnect();
      silentGain?.disconnect();
      stream?.getTracks().forEach((track) => track.stop());
      void audioContext?.close();
    };
  }, [enabled]);
}
